import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiGetConsultasClinica, apiGetClinic } from "../../../services/api";
import { useSpecialistSidebar } from "../../../hooks/useSidebar";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import "../../../styles/clinic.css";
import "../../../styles/Table.css";

const hoje = () => new Date().toISOString().slice(0, 10);

function statusStyle(status) {
    if (status === "Concluído") return { bg: "rgba(34,197,94,0.12)", color: "#16A34A" };
    if (status === "Cancelado") return { bg: "rgba(239,68,68,0.1)", color: "#DC2626" };
    if (status === "Faltou") return { bg: "rgba(251,191,36,0.15)", color: "#D97706" };
    return { bg: "rgba(59,130,246,0.1)", color: "#2563EB" };
}

function formatDateTime(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Dashboard() {
    const { token, user } = useAuth();
    const { id_clinic } = useParams();

    const [consultas, setConsultas] = useState([]);
    const [clinica, setClinica] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const opc_bar = useSpecialistSidebar("dashboard");

    const carregarConsultas = useCallback(async () => {
        if (!token || !id_clinic || !user?.id) return;
        setLoading(true);
        setErro(null);
        try {
            const data = await apiGetConsultasClinica(token, id_clinic, { specialist_id: user.id });
            setConsultas(data);
        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, id_clinic, user?.id]);

    useEffect(() => {
        carregarConsultas();
    }, [carregarConsultas]);

    useEffect(() => {
        if (!token || !id_clinic) return;
        apiGetClinic(token, id_clinic)
            .then(setClinica)
            .catch(() => {});
    }, [token, id_clinic]);

    const dataHoje = hoje();
    const consultasHoje = consultas.filter(c => c.consultation_date?.startsWith(dataHoje));
    const consultasFuturas = consultas.filter(c => c.consultation_date > dataHoje + "T99");
    const consultasPassadas = consultas.filter(c => c.consultation_date < dataHoje);

    return (
        <>
            <Section type_styles="" />
            <SideBar opc={opc_bar} styles="" />

            <main className="mainBar">
                <p>
                    <Link className="text75" to="/specialist/dashboard">← Voltar para clínicas</Link>
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { emoji: "📅", valor: consultasHoje.length, label: "Consultas Hoje" },
                        { emoji: "⏳", valor: consultasFuturas.length, label: "Futuras" },
                        { emoji: "✅", valor: consultasPassadas.length, label: "Realizadas" },
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
                            <h1 style={{ margin: "0 0 0.5rem 0" }}>Minhas Consultas</h1>
                            <p className="text75">Clínica: {clinica?.name}</p>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>Carregando consultas...</div>
                    ) : erro ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "#EF4444" }}>{erro}</div>
                    ) : consultas.length === 0 ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>
                            Nenhuma consulta encontrada.
                        </div>
                    ) : (
                        <div className="table">
                            <div className="table-header" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr" }}>
                                <p className="text75">Paciente</p>
                                <p className="text75">Data e Hora</p>
                                <p className="text75">Status</p>
                                <p className="text75" style={{ textAlign: "right" }}>Ação</p>
                            </div>
                            <div className="table-body">
                                {consultas.map((c, idx) => {
                                    const st = statusStyle(c.status);
                                    return (
                                        <div
                                            key={c.id}
                                            className="table-row"
                                            style={{
                                                gridTemplateColumns: "2fr 2fr 1fr 1fr",
                                                borderBottom: idx === consultas.length - 1 ? "none" : "1px solid var(--LineColor)",
                                            }}
                                        >
                                            <p style={{ fontWeight: 600 }}>{c.patients?.name || "—"}</p>
                                            <p>{formatDateTime(c.consultation_date)}</p>
                                            <div>
                                                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: st.bg, color: st.color }}>
                                                    {c.status || "Agendado"}
                                                </span>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <Link
                                                    to={`/specialist/patients/${id_clinic}/view-pacient/${c.patient_id}`}
                                                    className="submit"
                                                    style={{ padding: "6px 14px", fontSize: "12px" }}
                                                >
                                                    Ver Ficha
                                                </Link>
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
