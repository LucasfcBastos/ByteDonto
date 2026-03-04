from flask import Blueprint, request, jsonify
from supabase import create_client
from config import Config
from app.database import supabase

# Cliente com anon key — usado para autenticação de usuários
supabase_auth = create_client(Config.SUPABASE_URL, Config.SUPABASE_ANON_KEY)

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Login via Supabase Auth.
    Body JSON: { "email": "...", "password": "..." }
    """
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400

    try:
        response = supabase_auth.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        user = response.user
        session = response.session

        return jsonify({
            "access_token": session.access_token,
            "user": {
                "id": user.id,
                "email": user.email,
            }
        }), 200

    except Exception as e:
        return jsonify({"error": "Credenciais inválidas", "detail": str(e)}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """
    Logout — invalida o token no Supabase.
    Header: Authorization: Bearer <token>
    """
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"error": "Token não fornecido"}), 401

    try:
        supabase.auth.sign_out()
        return jsonify({"message": "Logout realizado com sucesso"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/me", methods=["GET"])
def me():
    """
    Retorna dados do usuário autenticado.
    Header: Authorization: Bearer <token>
    """
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"error": "Token não fornecido"}), 401

    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user

        # Buscar perfil do usuário na tabela usuarios
        perfil = supabase.table("usuarios").select("*").eq("id", user.id).single().execute()

        return jsonify({
            "id": user.id,
            "email": user.email,
            "perfil": perfil.data
        }), 200

    except Exception as e:
        return jsonify({"error": "Token inválido", "detail": str(e)}), 401
