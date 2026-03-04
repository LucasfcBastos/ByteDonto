/* IMPORTS */
import { useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/Auth.css';

/* MAIN COMPONENT */
function CadastroPage() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        password: "",
        confirmPassword: "",
        clinica: "",
        perfil: "funcionario",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.password !== form.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            /* Por enquanto exibe mensagem — o endpoint de cadastro
               será criado quando o líder do projeto configurar o deploy.
               O fluxo completo de cadastro requer criação de clínica + usuário. */
            setSuccess("Cadastro recebido! Aguarde o administrador ativar sua conta.");
        } catch (err) {
            setError(err.message || "Erro ao cadastrar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* HEADER */}
                <div className="auth-header">
                    <span>ByteDonto</span>
                    <p>Crie sua conta na plataforma</p>
                </div>

                {/* FORM */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="nome">Nome completo</label>
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            placeholder="Seu nome"
                            value={form.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="clinica">Nome da clínica</label>
                        <input
                            id="clinica"
                            name="clinica"
                            type="text"
                            placeholder="Clínica Odontológica XYZ"
                            value={form.clinica}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="perfil">Perfil</label>
                        <select
                            id="perfil"
                            name="perfil"
                            value={form.perfil}
                            onChange={handleChange}
                        >
                            <option value="proprietario">Proprietário</option>
                            <option value="especialista">Especialista</option>
                            <option value="funcionario">Funcionário</option>
                        </select>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="confirmPassword">Confirmar senha</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}
                    {success && (
                        <p style={{
                            color: "#2e7d32",
                            fontSize: "12px",
                            textAlign: "center",
                            padding: "8px 12px",
                            backgroundColor: "#e8f5e9",
                            borderRadius: "8px"
                        }}>
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        <h1>{loading ? "Cadastrando..." : "Criar conta"}</h1>
                    </button>
                </form>

                {/* FOOTER */}
                <div className="auth-footer-link">
                    <p>
                        Já tem conta?{" "}
                        <Link to="/login">Fazer login</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

/* STANDARD EXPORT */
export default CadastroPage;
