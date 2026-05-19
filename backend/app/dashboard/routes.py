from flask import Blueprint, request, jsonify
from app.database import supabase
from app.utils import get_token, get_user_clinica
from datetime import date

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/metricas", methods=["GET"])
def metricas():
    token = get_token(request)
    if not token:
        return jsonify({"error": "Não autorizado"}), 401

    try:
        _, default_clinic_id = get_user_clinica(token)

        # Permite filtrar por clínica específica via query param
        clinic_id = request.args.get("clinic_id") or default_clinic_id

        hoje = date.today().isoformat()

        # Total de pacientes
        pacientes = (
            supabase.table("patients")
            .select("id")
            .eq("clinic_id", clinic_id)
            .execute()
        )
        total_pacientes = len(pacientes.data)

        # Consultas de hoje
        consultas_hoje_res = (
            supabase.table("consultations")
            .select("id, status")
            .eq("clinic_id", clinic_id)
            .gte("consultation_date", f"{hoje}T00:00:00")
            .lte("consultation_date", f"{hoje}T23:59:59")
            .execute()
        )
        consultas_hoje = len(consultas_hoje_res.data)

        # Membros da clínica via teams + users
        team_members = (
            supabase.table("teams")
            .select("user_id")
            .eq("clinic_id", clinic_id)
            .execute()
        )
        user_ids = [t["user_id"] for t in team_members.data] if team_members.data else []

        total_especialistas = 0
        total_funcionarios = 0
        total_membros = len(user_ids)

        if user_ids:
            membros_data = (
                supabase.table("users")
                .select("id, roles")
                .in_("id", user_ids)
                .execute()
            )
            for m in membros_data.data:
                if m.get("roles") == "Specialist":
                    total_especialistas += 1
                elif m.get("roles") == "Employee":
                    total_funcionarios += 1

        return jsonify({
            "total_pacientes": total_pacientes,
            "consultas_hoje": consultas_hoje,
            "total_especialistas": total_especialistas,
            "total_funcionarios": total_funcionarios,
            "total_membros": total_membros,
            "receita_mes": 0,
            "pendente_mes": 0,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
