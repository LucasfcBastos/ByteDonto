import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiGetProcedimento, apiAtualizarProcedimento } from "../../../services/api";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import { useOwnerSidebar } from "../../../hooks/useSidebar";
import "../../../styles/clinic.css";
import "../../../styles/Forms.css";

function EditProcedure() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id_clinic, id_procedure } = useParams();

    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState(null);

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [tempoMedio, setTempoMedio] = useState("");
    const [materiais, setMateriais] = useState("");
    const [status, setStatus] = useState("Ativo");

    const opc_bar = useOwnerSidebar("procedures");

    useEffect(() => {
        if (!token || !id_procedure) return;

        apiGetProcedimento(token, id_procedure)
            .then((p) => {
                setNome(p.name || "");
                setDescricao(p.description || "");
                setValor(p.standard_value != null ? String(p.standard_value) : "");
                setTempoMedio(p.average_time || "");
                setMateriais(p.materials_needed || "");
                setStatus(p.status || "Ativo");
            })
            .catch((err) => setErro(err.message))
            .finally(() => setLoading(false));
    }, [token, id_procedure]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSalvando(true);
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
            await apiAtualizarProcedimento(token, id_procedure, payload);
            navigate(`/owner/procedures/${id_clinic}`);
        } catch (err) {
            setErro(err.message || "Erro ao atualizar procedimento.");
        } finally {
            setSalvando(false);
        }
    }

    if (loading) {
        return (
            <>
                <Section type_styles="owner" />
                <SideBar opc={opc_bar} styles="owner" />
                <main className="mainBar owner register">
                    <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>
                        Carregando dados do procedimento...
                    </div>
                </main>
            </>
        );
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
                        <h1 style={{ margin: "0 0 0.5rem 0" }}>Editar Procedimento</h1>
                        <p className="text75">
                            Atualize os dados do procedimento abaixo.
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
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="descricao">Descrição</label>
                                    <textarea
                                        id="descricao"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        rows="3"
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
                                    disabled={salvando}
                                >
                                    {salvando ? "Salvando..." : "Salvar Alterações"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}

export default EditProcedure;
