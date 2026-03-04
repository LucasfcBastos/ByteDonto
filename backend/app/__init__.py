from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Registrar blueprints
    from app.auth.routes import auth_bp
    from app.pacientes.routes import pacientes_bp
    from app.consultas.routes import consultas_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(pacientes_bp, url_prefix="/api/pacientes")
    app.register_blueprint(consultas_bp, url_prefix="/api/consultas")

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "ByteDonto API rodando"}

    return app
