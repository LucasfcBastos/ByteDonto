import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
    apiGetConsultasClinica,
    apiCriarConsulta,
    apiAtualizarConsulta,
    apiCancelarConsulta,
    apiGetPacientesClinica,
    apiGetClinic,
} from "../../../services/api";
import { useEmployeeSidebar } from "../../../hooks/useSidebar";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import AlertConfirmAction from "../../../components/alerts/AlertConfirmAction";
import AlertError from "../../../components/alerts/AlertError";
import "../../../styles/clinic.css";
import "../../../styles/Forms.css";
import "../../../styles/Table.css";

const STATUS_OPTIONS = ["Agendado", "Concluído", "Cancelado", "Faltou"];

function statusStyle(status) {
    if (status === "Concluído") return { bg: "rgba(34,197,94,0.12)", color: "#16A34A" };
    if (status === "Cancelado") return { bg: "rgba(239,68,68,0.1)", color: "#DC2626" };
    if (status === "Faltou") return { bg: "rgba(251,191,36,0.15)", color: "#D97706" };
    return { bg: "rgba(59,130,246,0.1)", color: "#2563EB" };
}

function formatDateTime(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const FORM_INICIAL = {
    patient_id: "",
    consultation_date: "",
    reason_complaint: "",
    status: "Agendado",
};

function ListConsultations() {
    const { token } = useAuth();
    const { id_clinic } = useParams();

    const [consultas, setConsultas] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [clinica, setClinica] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("Todos");

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(FORM_INICIAL);
    const [enviando, setEnviando] = useState(false);
    const [formErro, setFormErro] = useState(null);

    const [confirmCancelar, setConfirmCancelar] = useState(null);
    const [atualizandoId, setAtualizandoId] = useState(null);
    const [erroAlert, setErroAlert] = useState(null);

    const opc_bar = useEmployeeSidebar("consultations");

    const carregarConsultas = useCallback(async () => {
        if (!token || !id_clinic) return;
        setLoading(true);
        try {
            const data = await apiGetConsultasClinica(token, id_clinic);
            setConsultas(data);
        } catch (err) {
            setErroAlert(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, id_clinic]);

    useEffect(() => {
        carregarConsultas();
    }, [carregarConsultas]);

    useEffect(() => {
        if (!token || !id_clinic) return;
        apiGetPacientesClinica(token, id_clinic)
            .then(setPacientes)
            .catch(() => {});
        apiGetClinic(token, id_clinic)
            .then(setClinica)
            .catch(() => {});
    }, [token, id_clinic]);

    async function handleCriar(e) {
        e.preventDefault();
        if (!form.patient_id || !form.consultation_date) {
            setFormErro("Paciente e data são obrigatórios.");
            return;
        }
        setEnviando(true);
        setFormErro(null);
        try {
            await apiCriarConsulta(token, {
                patient_id: form.patient_id,
                consultation_date: form.consultation_date,
                reason_complaint: form.reason_complaint || undefined,
                status: form.status,
            });
            await carregarConsultas();
            setShowForm(false);
            setForm(FORM_INICIAL);
        } catch (err) {
            setFormErro(err.message);
        } finally {
            setEnviando(false);
        }
    }

    async function handleAlterarStatus(consulta, novoStatus) {
        setAtualizandoId(consulta.id);
        try {
            await apiAtualizarConsulta(token, consulta.id, { status: novoStatus });
            await carregarConsultas();
        } catch (err) {
            setErroAlert(err.message);
        } finally {
            setAtualizandoId(null);
        }
    }

    async function handleCancelarConfirmado() {
        const consulta = confirmCancelar;
        setConfirmCancelar(null);
        setAtualizandoId(consulta.id);
        try {
            await apiCancelarConsulta(token, consulta.id);
            await carregarConsultas();
        } catch (err) {
            setErroAlert(err.message);
        } finally {
            setAtualizandoId(null);
        }
    }

    const filtrados = consultas.filter(c => {
        const matchBusca = !busca ||
            c.patients?.name?.toLowerCase().includes(busca.toLowerCase()) ||
            c.specialist?.name?.toLowerCase().includes(busca.toLowerCase());
        const matchStatus = filtroStatus === "Todos" || c.status === filtroStatus;
        return matchBusca && matchStatus;
    });

    return (
        <>
            <Section type_styles="employee" />
            <SideBar opc={opc_bar} styles="employee" />

            {showForm && (
                <div className="forms-hover employee" style={{ display: "flex" }}>
                    <div className="forms-card">
                        <div style={{ marginBottom: "1.5rem" }}>
                            <h2 style={{ margin: 0, color: "var(--PrimaryColorsTheme)" }}>Nova Consulta</h2>
                            <p className="text75" style={{ margin: "0.5rem 0 0 0", fontSize: "14px" }}>
                                Agende uma nova consulta para a clínica.
                            </p>
                        </div>

                        <form onSubmit={handleCriar}>
                            {formErro && (
                                <div style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", padding: "10px 14px", borderRadius: "8px", marginBottom: "1rem", fontSize: "14px" }}>
                                    {formErro}
                                </div>
                            )}

                            <div className="field">
                                <label htmlFor="patient_id">Paciente *</label>
                                <select
                                    id="patient_id"
                                    required
                                    value={form.patient_id}
                                    onChange={e => setForm(prev => ({ ...prev, patient_id: e.target.value }))}
                                >
                                    <option value="">Selecione um paciente...</option>
                                    {pacientes.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="consultation_date">Data e Hora *</label>
                                <input
                                    id="consultation_date"
                                    type="datetime-local"
                                    required
                                    value={form.consultation_date}
                                    onChange={e => setForm(prev => ({ ...prev, consultation_date: e.target.value }))}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="reason_complaint">Motivo / Queixa</label>
                                <textarea
                                    id="reason_complaint"
                                    value={form.reason_complaint}
                                    onChange={e => setForm(prev => ({ ...prev, reason_complaint: e.target.value }))}
                                    rows="3"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="status_form">Status</label>
                                <select
                                    id="status_form"
                                    value={form.status}
                                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem" }}>
                                <button
                                    type="button"
                                    className="submit"
                                    style={{ background: "var(--LineColor)", color: "var(--TextColor)", boxShadow: "none" }}
                                    onClick={() => { setShowForm(false); setFormErro(null); }}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="submit" disabled={enviando}>
                                    {enviando ? "Salvando..." : "Agendar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmCancelar && (
                <AlertConfirmAction
                    styles="employee"
                    title="Cancelar Consulta"
                    text={`Deseja cancelar a consulta de "${confirmCancelar.patients?.name}"?`}
                    confirmText="Cancelar Consulta"
                    cancelText="Voltar"
                    onConfirm={handleCancelarConfirmado}
                    onCancel={() => setConfirmCancelar(null)}
                />
            )}

            {erroAlert && (
                <AlertError
                    styles="employee"
                    text={erroAlert}
                    onClose={() => setErroAlert(null)}
                />
            )}

            <main className="mainBar employee">
                <p>
                    <Link className="text75" to="/employee/consultations">← Voltar para clínicas</Link>
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { emoji: "📅", valor: consultas.length, label: "Total de Consultas" },
                        { emoji: "⏰", valor: consultas.filter(c => c.status === "Agendado").length, label: "Agendadas" },
                        { emoji: "✅", valor: consultas.filter(c => c.status === "Concluído").length, label: "Concluídas" },
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
                            <h1 style={{ margin: "0 0 0.5rem 0" }}>Consultas</h1>
                            <p className="text75">Clínica: {clinica?.name}</p>
                        </div>
                        <button className="submit" onClick={() => { setShowForm(true); setForm(FORM_INICIAL); setFormErro(null); }}>
                            + Nova Consulta
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            placeholder="Buscar por paciente ou especialista..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            style={{ flex: 1, maxWidth: "350px" }}
                        />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            {["Todos", ...STATUS_OPTIONS].map(s => (
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
                    </div>

                    {loading ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>Carregando consultas...</div>
                    ) : filtrados.length === 0 ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>
                            {busca || filtroStatus !== "Todos" ? "Nenhuma consulta encontrada." : "Nenhuma consulta cadastrada."}
                        </div>
                    ) : (
                        <div className="table">
                            <div className="table-header" style={{ gridTemplateColumns: "2fr 2fr 2fr 1fr 1.5fr" }}>
                                <p className="text75">Data e Hora</p>
                                <p className="text75">Paciente</p>
                                <p className="text75">Especialista</p>
                                <p className="text75">Status</p>
                                <p className="text75" style={{ textAlign: "right" }}>Ações</p>
                            </div>
                            <div className="table-body">
                                {filtrados.map((c, idx) => {
                                    const st = statusStyle(c.status);
                                    const ativa = !["Cancelado"].includes(c.status);
                                    return (
                                        <div
                                            key={c.id}
                                            className="table-row"
                                            style={{
                                                gridTemplateColumns: "2fr 2fr 2fr 1fr 1.5fr",
                                                borderBottom: idx === filtrados.length - 1 ? "none" : "1px solid var(--LineColor)",
                                            }}
                                        >
                                            <p style={{ fontWeight: 600 }}>{formatDateTime(c.consultation_date)}</p>
                                            <p>{c.patients?.name || "—"}</p>
                                            <p className="text75">{c.specialist?.name || "—"}</p>
                                            <div>
                                                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: st.bg, color: st.color }}>
                                                    {c.status || "Agendado"}
                                                </span>
                                            </div>
                                            <div style={{ textAlign: "right", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                                {ativa && c.status === "Agendado" && (
                                                    <button
                                                        onClick={() => handleAlterarStatus(c, "Concluído")}
                                                        disabled={atualizandoId === c.id}
                                                        className="submit"
                                                        style={{ padding: "5px 10px", fontSize: "12px", background: "rgba(34,197,94,0.12)", color: "#16A34A", boxShadow: "none" }}
                                                    >
                                                        Concluir
                                                    </button>
                                                )}
                                                {ativa && c.status !== "Cancelado" && (
                                                    <button
                                                        onClick={() => setConfirmCancelar(c)}
                                                        disabled={atualizandoId === c.id}
                                                        className="submit"
                                                        style={{ padding: "5px 10px", fontSize: "12px", background: "rgba(239,68,68,0.1)", color: "#EF4444", boxShadow: "none" }}
                                                    >
                                                        Cancelar
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

export default ListConsultations;
