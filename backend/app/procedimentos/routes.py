from flask import Blueprint, request, jsonify
from app.database import supabase
from app.utils import get_token, get_user_clinica

procedimentos_bp = Blueprint("procedimentos", __name__)

CAMPOS_PROCEDIMENTO = {
    "name", "description", "standard_value",
    "average_time", "materials_needed", "status"
}


# =========================================================
# LISTAR PROCEDIMENTOS DA CLÍNICA
# =========================================================
@procedimentos_bp.route("/", methods=["GET"])
def listar_procedimentos():
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinic_id = get_user_clinica(token)

        # Suporta filtro por clinic_id via query param (para exibir de clínica específica)
        clinic_id_param = request.args.get("clinic_id")
        if clinic_id_param:
            clinic_id = clinic_id_param

        result = (
            supabase.table("procedures")
            .select("*")
            .eq("clinic_id", clinic_id)
            .order("name")
            .execute()
        )
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# OBTER PROCEDIMENTO ESPECÍFICO
# =========================================================
@procedimentos_bp.route("/<procedimento_id>", methods=["GET"])
def obter_procedimento(procedimento_id):
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinic_id = get_user_clinica(token)
        result = (
            supabase.table("procedures")
            .select("*")
            .eq("id", procedimento_id)
            .eq("clinic_id", clinic_id)
            .single()
            .execute()
        )
        if not result.data:
            return jsonify({"error": "Procedimento não encontrado"}), 404
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# CRIAR PROCEDIMENTO
# =========================================================
@procedimentos_bp.route("/", methods=["POST"])
def criar_procedimento():
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        user_id, clinic_id = get_user_clinica(token)
        data = request.get_json()

        # Validações de campos obrigatórios
        name = (data.get("name") or "").strip()
        standard_value = data.get("standard_value")
        average_time = data.get("average_time")

        erros = []
        if not name:
            erros.append("Nome")
        if standard_value is None or standard_value == "":
            erros.append("Valor padrão")
        if not average_time:
            erros.append("Tempo médio")

        if erros:
            return jsonify({
                "error": f"Campos obrigatórios não preenchidos: {', '.join(erros)}"
            }), 400

        try:
            standard_value = float(standard_value)
        except (ValueError, TypeError):
            return jsonify({"error": "Valor padrão deve ser numérico"}), 400

        novo = {
            "clinic_id": clinic_id,
            "user_id": user_id,
            "name": name,
            "description": data.get("description") or None,
            "standard_value": standard_value,
            "average_time": average_time,
            "materials_needed": data.get("materials_needed") or None,
            "status": data.get("status") or "Ativo",
        }
        novo = {k: v for k, v in novo.items() if v is not None}

        result = supabase.table("procedures").insert(novo).execute()
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# ATUALIZAR PROCEDIMENTO
# =========================================================
@procedimentos_bp.route("/<procedimento_id>", methods=["PUT"])
def atualizar_procedimento(procedimento_id):
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinic_id = get_user_clinica(token)
        data = request.get_json()

        payload = {}
        for campo in CAMPOS_PROCEDIMENTO:
            if campo in data:
                payload[campo] = data[campo]

        if not payload:
            return jsonify({"error": "Nenhum campo válido para atualizar"}), 400

        # Converte standard_value para float se presente
        if "standard_value" in payload:
            try:
                payload["standard_value"] = float(payload["standard_value"])
            except (ValueError, TypeError):
                return jsonify({"error": "Valor padrão deve ser numérico"}), 400

        result = (
            supabase.table("procedures")
            .update(payload)
            .eq("id", procedimento_id)
            .eq("clinic_id", clinic_id)
            .execute()
        )
        if not result.data:
            return jsonify({"error": "Procedimento não encontrado"}), 404
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# DELETAR PROCEDIMENTO (OU INATIVAR)
# =========================================================
@procedimentos_bp.route("/<procedimento_id>", methods=["DELETE"])
def deletar_procedimento(procedimento_id):
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinic_id = get_user_clinica(token)

        # Verifica se pertence à clínica antes de deletar
        existente = (
            supabase.table("procedures")
            .select("id")
            .eq("id", procedimento_id)
            .eq("clinic_id", clinic_id)
            .execute()
        )
        if not existente.data:
            return jsonify({"error": "Procedimento não encontrado"}), 404

        supabase.table("procedures").delete().eq("id", procedimento_id).eq("clinic_id", clinic_id).execute()
        return jsonify({"message": "Procedimento removido com sucesso"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# ALTERAR STATUS DO PROCEDIMENTO
# =========================================================
@procedimentos_bp.route("/<procedimento_id>/status", methods=["PATCH"])
def alterar_status_procedimento(procedimento_id):
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinic_id = get_user_clinica(token)
        data = request.get_json()

        novo_status = (data.get("status") or "").strip()
        if novo_status not in ("Ativo", "Inativo"):
            return jsonify({"error": "Status inválido. Use 'Ativo' ou 'Inativo'"}), 400

        result = (
            supabase.table("procedures")
            .update({"status": novo_status})
            .eq("id", procedimento_id)
            .eq("clinic_id", clinic_id)
            .execute()
        )
        if not result.data:
            return jsonify({"error": "Procedimento não encontrado"}), 404
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
