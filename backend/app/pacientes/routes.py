from flask import Blueprint, request, jsonify
from app.database import supabase

pacientes_bp = Blueprint("pacientes", __name__)


def get_token(req):
    return req.headers.get("Authorization", "").replace("Bearer ", "")


def get_user_clinica(token):
    """Retorna o clinica_id do usuário autenticado."""
    user = supabase.auth.get_user(token).user
    
    # Consulta segura sem .single() para não quebrar se não existir
    perfil = supabase.table("usuarios").select("clinica_id").eq("id", user.id).execute()
    
    # FALLBACK DE RECONSTRUÇÃO: Se o banco foi resetado e o usuário apagado das tabelas públicas
    if not perfil.data:
        # 1. Cria uma clínica de emergência vinculada a ele
        clinica = supabase.table("clinicas").insert({
            "nome_fantasia": "Clínica ByteDonto (Recuperada)", 
            "dono_id": user.id
        }).execute()
        
        clinica_id = clinica.data[0]["id"]
        
        # 2. Re-insere o perfil dele na tabela usuarios
        supabase.table("usuarios").insert({
            "id": user.id,
            "clinica_id": clinica_id,
            "nome": "Usuário Teste",
            "papel": "Recepção"
        }).execute()
        
        return user.id, clinica_id

    return user.id, perfil.data[0]["clinica_id"]


@pacientes_bp.route("/", methods=["GET"])
def listar_pacientes():
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinica_id = get_user_clinica(token)
        result = supabase.table("pacientes").select("*").eq("clinica_id", clinica_id).order("created_at", desc=True).execute()
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@pacientes_bp.route("/<paciente_id>", methods=["GET"])
def obter_paciente(paciente_id):
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinica_id = get_user_clinica(token)
        result = supabase.table("pacientes").select("*").eq("id", paciente_id).eq("clinica_id", clinica_id).single().execute()
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@pacientes_bp.route("/", methods=["POST"])
def criar_paciente():
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinica_id = get_user_clinica(token)
        data = request.get_json()

        novo = {
            "clinica_id": clinica_id,
            "nome": data.get("nome"),
            "email": data.get("email"),
            "telefone_whatsapp": data.get("telefone_whatsapp"),
            "data_nascimento": data.get("data_nascimento"),
            "cpf": data.get("cpf"),
            "rg": data.get("rg"),
            "genero": data.get("genero"),
            "endereco": data.get("endereco", {}),
            "anamnese": data.get("anamnese", {})
        }

        result = supabase.table("pacientes").insert(novo).execute()
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@pacientes_bp.route("/<paciente_id>", methods=["PUT"])
def atualizar_paciente(paciente_id):
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinica_id = get_user_clinica(token)
        data = request.get_json()

        result = (
            supabase.table("pacientes")
            .update(data)
            .eq("id", paciente_id)
            .eq("clinica_id", clinica_id)
            .execute()
        )
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@pacientes_bp.route("/<paciente_id>", methods=["DELETE"])
def deletar_paciente(paciente_id):
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, clinica_id = get_user_clinica(token)
        supabase.table("pacientes").delete().eq("id", paciente_id).eq("clinica_id", clinica_id).execute()
        return jsonify({"message": "Paciente removido"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
