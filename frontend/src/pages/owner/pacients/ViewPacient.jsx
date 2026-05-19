import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiGetPaciente } from "../../../services/api";
import {
    formatCPF,
    formatPhone,
    formatDate,
    calcIdade,
} from "../../../utils/formatters";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import { useOwnerSidebar } from "../../../hooks/useSidebar";
import "../../../styles/clinic.css";
import "../../../styles/Forms.css";

function InfoRow({ label, value }) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <p
                className="text75"
                style={{ margin: "0 0 0.25rem 0", fontSize: "12px" }}
            >
                {label}
            </p>
            <p style={{ margin: 0, fontWeight: 600 }}>
                {value || "—"}
            </p>
        </div>
    );
}

function Section2({ title, children }) {
    return (
        <div className="forms-dat-section" style={{ marginTop: "1.5rem" }}>
            <p className="sec-title">{title}</p>
            {children}
        </div>
    );
}

function ViewPacient() {
    const { token } = useAuth();
    const { id_clinic, id_pacient } = useParams();
    const navigate = useNavigate();

    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const opc_bar = useOwnerSidebar("patients");

    useEffect(() => {
        if (!token || !id_pacient) return;

        apiGetPaciente(token, id_pacient)
            .then(setPaciente)
            .catch((err) => setErro(err.message))
            .finally(() => setLoading(false));
    }, [token, id_pacient]);

    return (
        <>
            <Section type_styles="owner" />
            <SideBar opc={opc_bar} styles="owner" />

            <main className="mainBar owner register">
                <p>
                    <Link
                        className="text75"
                        to={`/owner/pacients/${id_clinic}`}
                    >
                        ← Voltar
                    </Link>
                </p>

                <div className="camp-clinic camp-register">
                    {loading ? (
                        <div
                            style={{
                                padding: "2rem",
                                textAlign: "center",
                                color: "var(--TextColor75)",
                            }}
                        >
                            Carregando ficha do paciente...
                        </div>
                    ) : erro ? (
                        <div
                            style={{
                                padding: "2rem",
                                textAlign: "center",
                                color: "#EF4444",
                            }}
                        >
                            {erro}
                        </div>
                    ) : paciente ? (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "1rem",
                                }}
                            >
                                <div>
                                    <h1 style={{ margin: "0 0 0.25rem 0" }}>
                                        {paciente.name}
                                    </h1>
                                    <p className="text75">
                                        {calcIdade(paciente.birth_date)} anos ·{" "}
                                        {paciente.gender}
                                    </p>
                                </div>

                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    <span
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            background:
                                                paciente.status === "Ativo"
                                                    ? "rgba(34,197,94,0.12)"
                                                    : "rgba(239,68,68,0.1)",
                                            color:
                                                paciente.status === "Ativo"
                                                    ? "#22C55E"
                                                    : "#EF4444",
                                            fontWeight: 700,
                                            fontSize: "13px",
                                        }}
                                    >
                                        {paciente.status || "Ativo"}
                                    </span>

                                    <Link
                                        to={`/owner/pacients/${id_clinic}/edit-pacient/${id_pacient}`}
                                        className="submit"
                                        style={{ padding: "8px 20px", fontSize: "14px" }}
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>

                            <Section2 title="Identificação">
                                <div className="flex-inpus">
                                    <InfoRow
                                        label="CPF"
                                        value={formatCPF(paciente.cpf)}
                                    />
                                    <InfoRow label="RG" value={paciente.rg} />
                                </div>
                                <div className="flex-inpus">
                                    <InfoRow
                                        label="Data de Nascimento"
                                        value={formatDate(paciente.birth_date)}
                                    />
                                    <InfoRow
                                        label="Gênero"
                                        value={paciente.gender}
                                    />
                                </div>
                            </Section2>

                            <Section2 title="Contato">
                                <div className="flex-inpus">
                                    <InfoRow
                                        label="WhatsApp"
                                        value={formatPhone(paciente.whatsapp)}
                                    />
                                    <InfoRow
                                        label="Telefone Celular"
                                        value={formatPhone(paciente.phone_number)}
                                    />
                                </div>
                                <InfoRow label="E-mail" value={paciente.email} />
                                <div className="flex-inpus">
                                    <InfoRow
                                        label="Contato de Emergência"
                                        value={paciente.emergency_name}
                                    />
                                    <InfoRow
                                        label="Telefone de Emergência"
                                        value={formatPhone(
                                            paciente.emergency_phone
                                        )}
                                    />
                                </div>
                            </Section2>

                            <Section2 title="Endereço">
                                <div className="flex-inpus">
                                    <InfoRow
                                        label="País"
                                        value={paciente.country}
                                    />
                                    <InfoRow
                                        label="Estado"
                                        value={paciente.states}
                                    />
                                </div>
                                <div className="flex-inpus">
                                    <InfoRow
                                        label="Cidade"
                                        value={paciente.city}
                                    />
                                    <InfoRow
                                        label="Endereço"
                                        value={paciente.address}
                                    />
                                </div>
                            </Section2>

                            <Section2 title="Anamnese e Saúde Geral">
                                <InfoRow
                                    label="Alergias Conhecidas"
                                    value={paciente.known_allergias}
                                />
                                <InfoRow
                                    label="Condições Sistêmicas"
                                    value={paciente.systemic_conditions}
                                />
                                <InfoRow
                                    label="Medicações em Uso Contínuo"
                                    value={paciente.continuous_medications}
                                />
                                <InfoRow
                                    label="Drogas Recreativas"
                                    value={paciente.drug_use}
                                />
                                <InfoRow
                                    label="Cirurgias Prévias / Histórico"
                                    value={paciente.surgeries_history}
                                />
                            </Section2>
                        </>
                    ) : null}
                </div>
            </main>
        </>
    );
}

export default ViewPacient;
