import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiGetFinanceiroClinica, apiAtualizarLancamento, apiGetClinic } from "../../../services/api";
import { useEmployeeSidebar } from "../../../hooks/useSidebar";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import AlertError from "../../../components/alerts/AlertError";
import "../../../styles/clinic.css";
import "../../../styles/Table.css";

const STATUS_STYLE = {
    Pago: { bg: "rgba(34,197,94,0.12)", color: "#16A34A" },
    Pendente: { bg: "rgba(251,191,36,0.15)", color: "#D97706" },
    Cancelado: { bg: "rgba(239,68,68,0.1)", color: "#DC2626" },
};

function formatCurrency(val) {
    return Number(val || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("pt-BR");
}

function Financial() {
    const { token } = useAuth();
    const { id_clinic } = useParams();

    const [lancamentos, setLancamentos] = useState([]);
    const [clinica, setClinica] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState("Todos");
    const [atualizandoId, setAtualizandoId] = useState(null);
    const [erroAlert, setErroAlert] = useState(null);

    const opc_bar = useEmployeeSidebar("financial");

    const carregarLancamentos = useCallback(async () => {
        if (!token || !id_clinic) return;
        setLoading(true);
        try {
            const data = await apiGetFinanceiroClinica(token, id_clinic);
            setLancamentos(data);
        } catch (err) {
            setErroAlert(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, id_clinic]);

    useEffect(() => {
        carregarLancamentos();
    }, [carregarLancamentos]);

    useEffect(() => {
        if (!token || !id_clinic) return;
        apiGetClinic(token, id_clinic)
            .then(setClinica)
            .catch(() => {});
    }, [token, id_clinic]);

    async function handleMarcarPago(id) {
        setAtualizandoId(id);
        try {
            await apiAtualizarLancamento(token, id, { status: "Pago" });
            setLancamentos(prev => prev.map(l => l.id === id ? { ...l, status: "Pago" } : l));
        } catch (err) {
            setErroAlert(err.message);
        } finally {
            setAtualizandoId(null);
        }
    }

    const mesAtual = new Date().toISOString().slice(0, 7);
    const lancamentosMes = lancamentos.filter(l => l.created_at?.startsWith(mesAtual));
    const totalPago = lancamentosMes.filter(l => l.status === "Pago").reduce((s, l) => s + Number(l.valor || 0), 0);
    const totalPendente = lancamentosMes.filter(l => l.status === "Pendente").reduce((s, l) => s + Number(l.valor || 0), 0);

    const filtrados = filtroStatus === "Todos"
        ? lancamentos
        : lancamentos.filter(l => l.status === filtroStatus);

    return (
        <>
            <Section type_styles="employee" />
            <SideBar opc={opc_bar} styles="employee" />

            {erroAlert && (
                <AlertError
                    styles="employee"
                    text={erroAlert}
                    onClose={() => setErroAlert(null)}
                />
            )}

            <main className="mainBar employee">
                <p>
                    <Link className="text75" to="/employee/financial">← Voltar para clínicas</Link>
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ background: "white", borderRadius: "16px", border: "1px solid var(--LineColor)", padding: "1.5rem" }}>
                        <p style={{ margin: "0 0 0.25rem 0", fontSize: "13px", fontWeight: 700, color: "var(--TextColor75)", textTransform: "uppercase" }}>Total Pago (Mês)</p>
                        <p style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#16A34A" }}>
                            {loading ? "—" : formatCurrency(totalPago)}
                        </p>
                    </div>
                    <div style={{ background: "white", borderRadius: "16px", border: "1px solid var(--LineColor)", padding: "1.5rem" }}>
                        <p style={{ margin: "0 0 0.25rem 0", fontSize: "13px", fontWeight: 700, color: "var(--TextColor75)", textTransform: "uppercase" }}>Total Pendente</p>
                        <p style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#D97706" }}>
                            {loading ? "—" : formatCurrency(totalPendente)}
                        </p>
                    </div>
                    <div style={{ background: "white", borderRadius: "16px", border: "1px solid var(--LineColor)", padding: "1.5rem" }}>
                        <p style={{ margin: "0 0 0.25rem 0", fontSize: "13px", fontWeight: 700, color: "var(--TextColor75)", textTransform: "uppercase" }}>Total de Lançamentos</p>
                        <p style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "var(--PrimaryColorsTheme)" }}>
                            {loading ? "—" : lancamentos.length}
                        </p>
                    </div>
                </div>

                <div className="camp-clinic camp-register">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <div>
                            <h1 style={{ margin: "0 0 0.5rem 0" }}>Financeiro</h1>
                            <p className="text75">Clínica: {clinica?.name}</p>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                        {["Todos", "Pago", "Pendente", "Cancelado"].map(s => (
                            <button
                                key={s}
                                onClick={() => setFiltroStatus(s)}
                                style={{
                                    padding: "8px 14px",
                                    borderRadius: "10px",
                                    border: "1px solid var(--LineColor)",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    fontSize: "13px",
                                    background: filtroStatus === s ? "var(--PrimaryColorsTheme)" : "white",
                                    color: filtroStatus === s ? "white" : "var(--TextColor75)",
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>Carregando lançamentos...</div>
                    ) : filtrados.length === 0 ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>
                            Nenhum lançamento encontrado.
                        </div>
                    ) : (
                        <div className="table">
                            <div className="table-header" style={{ gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1fr" }}>
                                <p className="text75">Data</p>
                                <p className="text75">Paciente</p>
                                <p className="text75">Valor</p>
                                <p className="text75">Status</p>
                                <p className="text75" style={{ textAlign: "right" }}>Ação</p>
                            </div>
                            <div className="table-body">
                                {filtrados.map((l, idx) => {
                                    const st = STATUS_STYLE[l.status] || STATUS_STYLE["Pendente"];
                                    return (
                                        <div
                                            key={l.id}
                                            className="table-row"
                                            style={{
                                                gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1fr",
                                                borderBottom: idx === filtrados.length - 1 ? "none" : "1px solid var(--LineColor)",
                                            }}
                                        >
                                            <p style={{ fontSize: "13px" }}>{formatData(l.created_at)}</p>
                                            <p style={{ fontWeight: 600 }}>{l.consultations?.patients?.name || "—"}</p>
                                            <p style={{ fontWeight: 700 }}>{formatCurrency(l.valor)}</p>
                                            <div>
                                                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: st.bg, color: st.color }}>
                                                    {l.status || "Pendente"}
                                                </span>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                {l.status === "Pendente" && (
                                                    <button
                                                        onClick={() => handleMarcarPago(l.id)}
                                                        disabled={atualizandoId === l.id}
                                                        className="submit"
                                                        style={{ padding: "6px 12px", fontSize: "12px", background: "#16A34A", boxShadow: "none", whiteSpace: "nowrap" }}
                                                    >
                                                        {atualizandoId === l.id ? "..." : "Marcar Pago"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default Financial;
