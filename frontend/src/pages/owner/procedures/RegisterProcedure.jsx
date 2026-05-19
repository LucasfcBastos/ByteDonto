import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiCriarProcedimento } from "../../../services/api";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import { useOwnerSidebar } from "../../../hooks/useSidebar";
import "../../../styles/clinic.css";
import "../../../styles/Forms.css";

function RegisterProcedure() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id_clinic } = useParams();

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [tempoMedio, setTempoMedio] = useState("");
    const [materiais, setMateriais] = useState("");
    const [status, setStatus] = useState("Ativo");

    const opc_bar = useOwnerSidebar("procedures");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        const payload = {
            name: nome,
            description: descricao || undefined,
            standard_value: parseFloat(valor.replace(",", ".")),
            average_time: tempoMedio,
            materials_needed: materiais || undefined,
            status,
        };

        try {
            await apiCriarProcedimento(token, payload);
            navigate(`/owner/procedures/${id_clinic}`);
        } catch (err) {
            setErro(err.message || "Erro ao cadastrar procedimento.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Section type_styles="owner" />
            <SideBar opc={opc_bar} styles="owner" />

            <main className="mainBar owner register">
                <p>
                    <Link className="text75" to={`/owner/procedures/${id_clinic}`}>
                        ← Voltar
                    </Link>
                </p>

                <div className="camp-clinic camp-register">
                    <div>
                        <h1 style={{ margin: "0 0 0.5rem 0" }}>Cadastrar Procedimento</h1>
                        <p className="text75">
                            Preencha os dados do procedimento a ser oferecido pela clínica.
                        </p>

                        {erro && (
                            <div
                                style={{
                                    background: "rgba(239,68,68,0.1)",
                                    color: "#EF4444",
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    margin: "1rem 0",
                                    fontSize: "14px",
                                }}
                            >
                                {erro}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>

                            <div className="forms-dat-section">
                                <p className="sec-title">Identificação</p>

                                <div className="field">
                                    <label htmlFor="nome">Nome do Procedimento *</label>
                                    <input
                                        id="nome"
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                        placeholder="Ex: Limpeza dental, Extração simples..."
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="descricao">Descrição</label>
                                    <textarea
                                        id="descricao"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        rows="3"
                                        placeholder="Descreva o procedimento (opcional)"
                                    />
                                </div>
                            </div>

                            <div className="forms-dat-section">
                                <p className="sec-title">Valores e Tempo</p>

                                <div className="flex-inpus">
                                    <div className="field">
                                        <label htmlFor="valor">Valor Padrão (R$) *</label>
                                        <input
                                            id="valor"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={valor}
                                            onChange={(e) => setValor(e.target.value)}
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="tempoMedio">Tempo Médio *</label>
                                        <input
                                            id="tempoMedio"
                                            type="text"
                                            value={tempoMedio}
                                            onChange={(e) => setTempoMedio(e.target.value)}
                                            required
                                            placeholder="Ex: 30 minutes, 1 hour"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="forms-dat-section">
                                <p className="sec-title">Materiais e Status</p>

                                <div className="field">
                                    <label htmlFor="materiais">Materiais Necessários</label>
                                    <textarea
                                        id="materiais"
                                        value={materiais}
                                        onChange={(e) => setMateriais(e.target.value)}
                                        rows="3"
                                        placeholder="Liste os materiais necessários (opcional)"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="status">Status *</label>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "1rem",
                                    marginTop: "2rem",
                                }}
                            >
                                <Link
                                    to={`/owner/procedures/${id_clinic}`}
                                    className="submit"
                                    style={{
                                        background: "var(--LineColor)",
                                        color: "var(--TextColor)",
                                        boxShadow: "none",
                                    }}
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    className="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Salvando..." : "Salvar Procedimento"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}

export default RegisterProcedure;
