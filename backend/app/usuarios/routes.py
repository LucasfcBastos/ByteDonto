from flask import Blueprint, request, jsonify
from supabase import create_client
from app.database import supabase
from app.utils import get_token, get_user_e_clinica
from config import Config

supabase_admin = create_client(
    Config.SUPABASE_URL,
    Config.SUPABASE_KEY
)

usuarios_bp = Blueprint("usuarios", __name__)

PAPEIS_VALIDOS = ["Specialist", "Employee"]


# =========================================================
# LISTAR EQUIPE
# =========================================================
@usuarios_bp.route("/<clinic_id>", methods=["GET"])
def listar_equipe(clinic_id):
    """
    Lista todos os membros vinculados à clínica.
    """

    token = get_token(request)

    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:

        _, _, role_solicitante = get_user_e_clinica(token)

        if role_solicitante != "Owner":
            return jsonify({
                "error": "Apenas o proprietário pode visualizar a equipe"
            }), 403

        # =====================================================
        # BUSCA TODOS OS VÍNCULOS DA CLÍNICA
        # =====================================================
        teams_result = (
            supabase
            .table("teams")
            .select("""
                id,
                status,
                user_id,
                users (
                    id,
                    name,
                    roles
                )
            """)
            .eq("clinic_id", clinic_id)
            .execute()
        )

        membros = []

        for team in teams_result.data:

            user = team.get("users") or {}

            # =================================================
            # BUSCA EMAIL EM auth.users
            # =================================================
            auth_user = (
                supabase_admin.auth.admin.get_user_by_id(
                    team["user_id"]
                )
            )

            email = None

            if auth_user and auth_user.user:
                email = auth_user.user.email

            membros.append({
                "team_id": team["id"],
                "id": user.get("id"),
                "name": user.get("name"),
                "email": email,
                "roles": user.get("roles"),
                "status": team.get("status")
            })

        return jsonify(membros), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# CRIAR VÍNCULO COM CLÍNICA
# =========================================================
@usuarios_bp.route("/<clinic_id>/criar", methods=["POST"])
def criar_membro(clinic_id):
    """
    Vincula um usuário já existente à clínica.

    Body:
    {
        "email": "...",
        "papel": "Specialist"
    }
    """

    token = get_token(request)

    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:

        _, _, role_solicitante = get_user_e_clinica(token)

        if role_solicitante != "Owner":
            return jsonify({
                "error": "Apenas o proprietário pode adicionar membros"
            }), 403

        data = request.get_json()

        email = data.get("email", "").strip().lower()
        papel = data.get("papel", "").strip()

        # =====================================================
        # VALIDAÇÕES
        # =====================================================
        if not email or not papel:
            return jsonify({
                "error": "Email e papel são obrigatórios"
            }), 400

        if papel not in PAPEIS_VALIDOS:
            return jsonify({
                "error": "Papel inválido"
            }), 400

        # =====================================================
        # BUSCA USUÁRIO NO AUTH
        # =====================================================
        auth_response = supabase_admin.auth.admin.list_users()

        usuario_auth = None

        for u in auth_response:

            if u.email.lower() == email:
                usuario_auth = u
                break

        if not usuario_auth:
            return jsonify({
                "error": "Usuário não encontrado no sistema"
            }), 404

        user_id = usuario_auth.id

        # =====================================================
        # BUSCA PERFIL EM users
        # =====================================================
        user_result = (
            supabase
            .table("users")
            .select("id, name, roles")
            .eq("id", user_id)
            .single()
            .execute()
        )

        if not user_result.data:
            return jsonify({
                "error": "Perfil do usuário não encontrado"
            }), 404

        usuario = user_result.data

        # =====================================================
        # VALIDA O PAPEL
        # =====================================================
        if usuario["roles"] != papel:
            return jsonify({
                "error": f"O usuário possui perfil '{usuario['roles']}'"
            }), 400

        # =====================================================
        # VERIFICA SE JÁ ESTÁ NA CLÍNICA
        # =====================================================
        membro_existente = (
            supabase
            .table("teams")
            .select("id")
            .eq("clinic_id", clinic_id)
            .eq("user_id", user_id)
            .execute()
        )

        if membro_existente.data:
            return jsonify({
                "error": "Usuário já faz parte da clínica"
            }), 409

        # =====================================================
        # CRIA VÍNCULO
        # =====================================================
        novo_membro = (
            supabase_admin
            .table("teams")
            .insert({
                "user_id": user_id,
                "clinic_id": clinic_id,
                "status": "active"
            })
            .execute()
        )

        return jsonify({
            "message": "Membro vinculado com sucesso",
            "member": {
                "team_id": novo_membro.data[0]["id"],
                "id": usuario["id"],
                "name": usuario["name"],
                "email": email,
                "roles": usuario["roles"],
                "status": "active"
            }
        }), 201

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# REMOVER MEMBRO
# =========================================================
@usuarios_bp.route("/<clinic_id>/<usuario_id>", methods=["DELETE"])
def remover_membro(clinic_id, usuario_id):
    """
    Remove o vínculo do usuário com a clínica.
    """

    token = get_token(request)

    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:

        solicitante_id, _, role_solicitante = (
            get_user_e_clinica(token)
        )

        if role_solicitante != "Owner":
            return jsonify({
                "error": "Apenas o proprietário pode remover membros"
            }), 403

        # =====================================================
        # NÃO PODE REMOVER A SI MESMO
        # =====================================================
        if usuario_id == solicitante_id:
            return jsonify({
                "error": "Você não pode remover a si mesmo"
            }), 400

        # =====================================================
        # VERIFICA SE O MEMBRO EXISTE NA CLÍNICA
        # =====================================================
        membro = (
            supabase
            .table("teams")
            .select("id")
            .eq("clinic_id", clinic_id)
            .eq("user_id", usuario_id)
            .execute()
        )

        if not membro.data:
            return jsonify({
                "error": "Membro não encontrado na clínica"
            }), 404

        # =====================================================
        # REMOVE SOMENTE O VÍNCULO
        # =====================================================
        supabase_admin \
            .table("teams") \
            .delete() \
            .eq("clinic_id", clinic_id) \
            .eq("user_id", usuario_id) \
            .execute()

        return jsonify({
            "message": "Membro removido da clínica com sucesso"
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500