/* IMPORTS */
import { useState } from "react";
import { Link } from "react-router-dom";
import Art from "../../components/artAuth/ArtAuthReg"
import IMG from "../../assets/img/img_reg_owner.png"
import '../../styles/Auth.css';

/* MAIN COMPONENT */
function CadastroPage() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        password: "",
        confirmPassword: "",
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
        <>
            <Art
                type="owner"
                img={IMG}
            />
            <div className="auth-page auth-left owner">
                <div className="auth-card">

                    {/* HEADER */}
                    <p className="text75">
                        <Link to="/">← Voltar para home</Link>
                    </p>

                    <span>
                        Você está fazendo cadastro como PROPRIETÁRIO.
                    </span>

                    {/* FORM */}
                    <form onSubmit={handleSubmit}>
                        <div className="field">
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

                        <div className="field">
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

                        <div className="field">
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

                        <div className="field">
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
                            <h1>{loading ? "ENTRANDO..." : "FAZER CADASTRO"}</h1>
                        </button>
                    </form>

                    {/* FOOTER */}
                    <div className="auth-footer">
                        <p className="text75">
                            Já têm registro?{" "}
                            <Link to="/login">VAMOS LOGAR</Link>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}

/* STANDARD EXPORT */
export default CadastroPage;
