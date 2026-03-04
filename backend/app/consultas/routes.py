from flask import Blueprint, request, jsonify
from app.database import supabase

consultas_bp = Blueprint("consultas", __name__)


def get_token(req):
    return req.headers.get("Authorization", "").replace("Bearer ", "")


def get_user_clinica(token):
    user = supabase.auth.get_user(token).user
    perfil = supabase.table("usuarios").select("clinica_id").eq("id", user.id).single().execute()
    return user.id, perfil.data["clinica_id"]


@consultas_bp.route("/", methods=["GET"])
def listar_consultas():
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinica_id = get_user_clinica(token)
        result = (
            supabase.table("consultas")
            .select("*, pacientes(nome, telefone_whatsapp), usuarios(nome)")
            .eq("clinica_id", clinica_id)
            .order("data_hora")
            .execute()
        )
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@consultas_bp.route("/", methods=["POST"])
def agendar_consulta():
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinica_id = get_user_clinica(token)
        data = request.get_json()

        nova = {
            "clinica_id": clinica_id,
            "paciente_id": data.get("paciente_id"),
            "especialista_id": data.get("especialista_id"),
            "data_hora": data.get("data_hora"),
            "observacoes": data.get("observacoes"),
            "status": "agendada",
        }

        result = supabase.table("consultas").insert(nova).execute()
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@consultas_bp.route("/<consulta_id>", methods=["PUT"])
def atualizar_consulta(consulta_id):
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinica_id = get_user_clinica(token)
        data = request.get_json()

        result = (
            supabase.table("consultas")
            .update(data)
            .eq("id", consulta_id)
            .eq("clinica_id", clinica_id)
            .execute()
        )
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@consultas_bp.route("/<consulta_id>", methods=["DELETE"])
def cancelar_consulta(consulta_id):
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinica_id = get_user_clinica(token)
        supabase.table("consultas").update({"status": "cancelada"}).eq("id", consulta_id).eq("clinica_id", clinica_id).execute()
        return jsonify({"message": "Consulta cancelada"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
