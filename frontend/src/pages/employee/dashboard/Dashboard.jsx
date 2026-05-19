import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiGetConsultasClinica, apiGetClinic } from "../../../services/api";
import { useEmployeeSidebar } from "../../../hooks/useSidebar";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import "../../../styles/clinic.css";
import "../../../styles/Table.css";

function formatHora(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function statusStyle(status) {
    if (status === "Concluído") return { bg: "rgba(34,197,94,0.12)", color: "#16A34A" };
    if (status === "Cancelado") return { bg: "rgba(239,68,68,0.1)", color: "#DC2626" };
    if (status === "Faltou") return { bg: "rgba(251,191,36,0.15)", color: "#D97706" };
    return { bg: "rgba(59,130,246,0.1)", color: "#2563EB" };
}

function Dashboard() {
    const { token } = useAuth();
    const { id_clinic } = useParams();

    const [consultas, setConsultas] = useState([]);
    const [clinica, setClinica] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const opc_bar = useEmployeeSidebar("dashboard");

    const hoje = new Date().toISOString().slice(0, 10);

    const carregarConsultas = useCallback(async () => {
        if (!token || !id_clinic) return;
        setLoading(true);
        setErro(null);
        try {
            const data = await apiGetConsultasClinica(token, id_clinic);
            setConsultas(data.filter(c => c.consultation_date?.startsWith(hoje)));
        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, id_clinic, hoje]);

    useEffect(() => {
        carregarConsultas();
    }, [carregarConsultas]);

    useEffect(() => {
        if (!token || !id_clinic) return;
        apiGetClinic(token, id_clinic)
            .then(setClinica)
            .catch(() => {});
    }, [token, id_clinic]);

    const agendadas = consultas.filter(c => !["Concluído", "Faltou", "Cancelado"].includes(c.status));
    const concluidas = consultas.filter(c => c.status === "Concluído");
    const faltaram = consultas.filter(c => c.status === "Faltou");

    return (
        <>
            <Section type_styles="employee" />
            <SideBar opc={opc_bar} styles="employee" />

            <main className="mainBar employee">
                <p>
                    <Link className="text75" to="/employee/dashboard">← Voltar para clínicas</Link>
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { emoji: "📋", valor: consultas.length, label: "Total do Dia" },
                        { emoji: "⏰", valor: agendadas.length, label: "Pendentes" },
                        { emoji: "✅", valor: concluidas.length, label: "Concluídas" },
                    ].map((m) => (
                        <div
                            key={m.label}
                            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--LineColor)", padding: "1.5rem" }}
                        >
                            <span style={{ fontSize: "28px", display: "block", marginBottom: "0.75rem" }}>{m.emoji}</span>
                            <p style={{ margin: 0, fontSize: "28px", fontWeight: 800 }}>{m.valor}</p>
                            <p className="text75" style={{ marginTop: "0.5rem", fontSize: "13px" }}>{m.label}</p>
                        </div>
                    ))}
                </div>

                <div className="camp-clinic camp-register">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <div>
                            <h1 style={{ margin: "0 0 0.5rem 0" }}>Consultas de Hoje</h1>
                            <p className="text75">
                                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                                {" — "}{clinica?.name}
                            </p>
                        </div>
                        <Link
                            to={`/employee/consultations/${id_clinic}`}
                            className="submit"
                        >
                            Gerenciar Consultas
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>Carregando agenda...</div>
                    ) : erro ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "#EF4444" }}>{erro}</div>
                    ) : consultas.length === 0 ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>
                            Nenhuma consulta agendada para hoje.
                        </div>
                    ) : (
                        <div className="table">
                            <div className="table-header" style={{ gridTemplateColumns: "1fr 2fr 2fr 1.5fr 1fr" }}>
                                <p className="text75">Horário</p>
                                <p className="text75">Paciente</p>
                                <p className="text75">Especialista</p>
                                <p className="text75">Motivo</p>
                                <p className="text75">Status</p>
                            </div>
                            <div className="table-body">
                                {consultas.map((c, idx) => {
                                    const st = statusStyle(c.status);
                                    return (
                                        <div
                                            key={c.id}
                                            className="table-row"
                                            style={{
                                                gridTemplateColumns: "1fr 2fr 2fr 1.5fr 1fr",
                                                borderBottom: idx === consultas.length - 1 ? "none" : "1px solid var(--LineColor)",
                                            }}
                                        >
                                            <p style={{ fontWeight: 700 }}>{formatHora(c.consultation_date)}</p>
                                            <p style={{ fontWeight: 600 }}>{c.patients?.name || "—"}</p>
                                            <p className="text75">{c.specialist?.name || "—"}</p>
                                            <p className="text75" style={{ fontSize: "13px" }}>{c.reason_complaint || "—"}</p>
                                            <div>
                                                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: st.bg, color: st.color }}>
                                                    {c.status || "Agendado"}
                                                </span>
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

export default Dashboard;
