from flask import Blueprint, request, jsonify
from supabase import create_client
from app.database import supabase
from app.utils import get_token, get_user_e_clinica
from config import Config

usuarios_bp = Blueprint("usuarios", __name__)

supabase_admin = create_client(
    Config.SUPABASE_URL,
    Config.SUPABASE_KEY
)

PAPEIS_VALIDOS = ["Specialist", "Employee", "Owner"]


# =========================================================
# LISTAR EQUIPE
# =========================================================
@usuarios_bp.route("/<clinic_id>", methods=["GET"])
def listar_equipe(clinic_id):

    token = get_token(request)

    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        user = supabase.auth.get_user(token).user
        user_id = user.id

        # -------------------------------------------------
        # PEGA ROLE DO USUÁRIO (sem depender de clínica)
        # -------------------------------------------------
        user_data = (
            supabase
            .table("users")
            .select("roles")
            .eq("id", user_id)
            .single()
            .execute()
        )

        role_solicitante = user_data.data.get("roles")

        if role_solicitante != "Owner":
            return jsonify({
                "error": "Apenas o proprietário pode visualizar a equipe"
            }), 403

        # -------------------------------------------------
        # BUSCA EQUIPE DA CLÍNICA RECEBIDA NA ROTA
        # -------------------------------------------------
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

            auth_user = supabase_admin.auth.admin.get_user_by_id(
                team["user_id"]
            )

            email = auth_user.user.email if auth_user and auth_user.user else None

            membros.append({
                "team_id": team["id"],
                "user_id": user.get("id"),
                "name": user.get("name"),
                "email": email,
                "roles": user.get("roles"),
                "status": team.get("status")
            })

        return jsonify(membros), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# CRIAR MEMBRO
# =========================================================
@usuarios_bp.route("/<clinic_id>/criar", methods=["POST"])
def criar_membro(clinic_id):

    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        user = supabase.auth.get_user(token).user
        user_id = user.id

        # --------------------------------------------------
        # valida owner
        # --------------------------------------------------
        clinic = (
            supabase
            .table("clinics")
            .select("owner_id")
            .eq("id", clinic_id)
            .single()
            .execute()
        )

        if not clinic.data:
            return jsonify({"error": "Clínica não encontrada"}), 404

        if clinic.data["owner_id"] != user_id:
            return jsonify({"error": "Apenas o owner pode adicionar membros"}), 403

        # --------------------------------------------------
        # input
        # --------------------------------------------------
        data = request.get_json()
        email = (data.get("email") or "").strip().lower()
        papel = (data.get("papel") or "").strip()

        if not email or not papel:
            return jsonify({"error": "Email e papel são obrigatórios"}), 400

        if papel not in PAPEIS_VALIDOS:
            return jsonify({"error": "Papel inválido"}), 400

        # --------------------------------------------------
        # busca usuário no auth
        # --------------------------------------------------
        auth_users = supabase_admin.auth.admin.list_users()
        usuarios = auth_users.users if hasattr(auth_users, "users") else auth_users

        usuario_auth = next(
            (u for u in usuarios if u.email and u.email.lower() == email),
            None
        )

        if not usuario_auth:
            return jsonify({"error": "Usuário não encontrado"}), 404

        target_user_id = usuario_auth.id

        # --------------------------------------------------
        # pega role REAL do usuário
        # --------------------------------------------------
        user_profile = (
            supabase
            .table("users")
            .select("roles")
            .eq("id", target_user_id)
            .single()
            .execute()
        )

        if not user_profile.data:
            return jsonify({"error": "Perfil do usuário não encontrado"}), 404

        role_real = user_profile.data["roles"]

        # --------------------------------------------------
        # REGRA IMPORTANTE (CORREÇÃO DO SEU BUG)
        # --------------------------------------------------
        if role_real != papel:
            if papel == "Spacialist":
                return jsonify({
                    "error": "Conflito de papel. Usuário com esse email não é Especialista"
                }), 409
            elif papel == "Employee":
                return jsonify({
                    "error": "Conflito de papel. Usuário com esse email não é Funcionario"
                }), 409

        # --------------------------------------------------
        # evita duplicidade
        # --------------------------------------------------
        exists = (
            supabase
            .table("teams")
            .select("id")
            .eq("clinic_id", clinic_id)
            .eq("user_id", target_user_id)
            .execute()
        )

        if exists.data:
            return jsonify({"error": "Usuário já está na clínica"}), 409

        # --------------------------------------------------
        # cria vínculo (SEM role aqui)
        # --------------------------------------------------
        result = (
            supabase
            .table("teams")
            .insert({
                "clinic_id": clinic_id,
                "user_id": target_user_id,
                "status": "active"
            })
            .execute()
        )

        return jsonify({
            "message": "Membro adicionado com sucesso",
            "team": result.data[0]
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# REMOVER MEMBRO
# =========================================================
@usuarios_bp.route("/<clinic_id>/<usuario_id>", methods=["DELETE"])
def remover_membro(clinic_id, usuario_id):

    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        user = supabase.auth.get_user(token).user
        user_id = user.id

        # --------------------------------------------------
        # valida owner
        # --------------------------------------------------
        clinic = (
            supabase
            .table("clinics")
            .select("owner_id")
            .eq("id", clinic_id)
            .single()
            .execute()
        )

        if not clinic.data:
            return jsonify({"error": "Clínica não encontrada"}), 404

        if clinic.data["owner_id"] != user_id:
            return jsonify({"error": "Apenas o owner pode remover membros"}), 403

        # --------------------------------------------------
        # evita auto delete
        # --------------------------------------------------
        if usuario_id == user_id:
            return jsonify({"error": "Você não pode se remover"}), 400

        # --------------------------------------------------
        # delete real
        # --------------------------------------------------
        deleted = (
            supabase
            .table("teams")
            .delete()
            .eq("clinic_id", clinic_id)
            .eq("id", usuario_id)
            .execute()
        )

        if not deleted.data:
            return jsonify({"error": "Membro não encontrado na clínica"}), 404

        return jsonify({
            "message": "Membro removido com sucesso"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500