import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiGetPacientesClinica, apiGetClinic } from "../../../services/api";
import { formatCPF, formatPhone } from "../../../utils/formatters";
import { useSpecialistSidebar } from "../../../hooks/useSidebar";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import "../../../styles/clinic.css";
import "../../../styles/Table.css";

function ListPatients() {
    const { token } = useAuth();
    const { id_clinic } = useParams();

    const [pacientes, setPacientes] = useState([]);
    const [clinica, setClinica] = useState(null);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const opc_bar = useSpecialistSidebar("patients");

    const carregarPacientes = useCallback(async () => {
        if (!token || !id_clinic) return;
        setLoading(true);
        setErro(null);
        try {
            const data = await apiGetPacientesClinica(token, id_clinic);
            setPacientes(data);
        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, id_clinic]);

    useEffect(() => {
        carregarPacientes();
    }, [carregarPacientes]);

    useEffect(() => {
        if (!token || !id_clinic) return;
        apiGetClinic(token, id_clinic)
            .then(setClinica)
            .catch(() => {});
    }, [token, id_clinic]);

    const filtrados = pacientes.filter(p =>
        p.name?.toLowerCase().includes(busca.toLowerCase()) ||
        p.cpf?.includes(busca) ||
        p.email?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <>
            <Section type_styles="" />
            <SideBar opc={opc_bar} styles="" />

            <main className="mainBar">
                <p>
                    <Link className="text75" to="/specialist/patients">← Voltar para clínicas</Link>
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { emoji: "👥", valor: pacientes.length, label: "Total de Pacientes" },
                        { emoji: "✅", valor: pacientes.filter(p => p.status === "Ativo").length, label: "Pacientes Ativos" },
                        { emoji: "⏸️", valor: pacientes.filter(p => p.status !== "Ativo").length, label: "Pacientes Inativos" },
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
                            <h1 style={{ margin: "0 0 0.5rem 0" }}>Pacientes</h1>
                            <p className="text75">Clínica: {clinica?.name}</p>
                        </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <input
                            type="text"
                            placeholder="Buscar por nome, CPF ou e-mail..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            style={{ width: "100%", maxWidth: "400px" }}
                        />
                    </div>

                    {loading ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>Carregando pacientes...</div>
                    ) : erro ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "#EF4444" }}>{erro}</div>
                    ) : filtrados.length === 0 ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>
                            {busca ? "Nenhum paciente encontrado para esta busca." : "Nenhum paciente cadastrado."}
                        </div>
                    ) : (
                        <div className="table">
                            <div className="table-header" style={{ gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr" }}>
                                <p className="text75">Nome</p>
                                <p className="text75">CPF</p>
                                <p className="text75">Telefone</p>
                                <p className="text75">Status</p>
                                <p className="text75" style={{ textAlign: "right" }}>Ação</p>
                            </div>
                            <div className="table-body">
                                {filtrados.map((p, idx) => (
                                    <div
                                        key={p.id}
                                        className="table-row"
                                        style={{
                                            gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr",
                                            borderBottom: idx === filtrados.length - 1 ? "none" : "1px solid var(--LineColor)",
                                        }}
                                    >
                                        <p style={{ fontWeight: 600 }}>{p.name}</p>
                                        <p>{formatCPF(p.cpf)}</p>
                                        <p>{formatPhone(p.whatsapp)}</p>
                                        <div>
                                            <span
                                                style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "20px",
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    background: p.status === "Ativo" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
                                                    color: p.status === "Ativo" ? "#22C55E" : "#EF4444",
                                                }}
                                            >
                                                {p.status || "Ativo"}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <Link
                                                to={`/specialist/patients/${id_clinic}/view-pacient/${p.id}`}
                                                className="submit"
                                                style={{ padding: "6px 14px", fontSize: "12px" }}
                                            >
                                                Ver Ficha
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default ListPatients;
