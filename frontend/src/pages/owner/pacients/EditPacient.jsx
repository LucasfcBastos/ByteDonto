import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiGetPaciente, apiAtualizarPaciente } from "../../../services/api";
import { maskCPF, maskPhone, maskRG } from "../../../utils/formatters";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import { useOwnerSidebar } from "../../../hooks/useSidebar";
import "../../../styles/clinic.css";
import "../../../styles/Forms.css";

function EditPacient() {
    const { token } = useAuth();
    const { id_clinic, id_pacient } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState(null);

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [data_nascimento, setDataNascimento] = useState("");
    const [genero, setGenero] = useState("Feminino");
    const [status, setStatus] = useState("Ativo");

    const [tel_whatsapp, setTelWhatsapp] = useState("");
    const [tel_celular, setTelCelular] = useState("");
    const [email, setEmail] = useState("");
    const [emerg_nome, setEmergNome] = useState("");
    const [emerg_tel, setEmergTel] = useState("");

    const [pais, setPais] = useState("");
    const [estado, setEstado] = useState("");
    const [cidade, setCidade] = useState("");
    const [endereco_completo, setEnderecoCompleto] = useState("");

    const [alergias, setAlergias] = useState("");
    const [condicoes, setCondicoes] = useState("");
    const [medicacoes, setMedicacoes] = useState("");
    const [drogas, setDrogas] = useState("");
    const [cirurgias, setCirurgias] = useState("");

    const opc_bar = useOwnerSidebar("patients");

    useEffect(() => {
        if (!token || !id_pacient) return;

        apiGetPaciente(token, id_pacient)
            .then((p) => {
                setNome(p.name || "");
                setCpf(maskCPF(p.cpf || ""));
                setRg(p.rg || "");
                setDataNascimento(p.birth_date ? p.birth_date.split("T")[0] : "");
                setGenero(p.gender || "Feminino");
                setStatus(p.status || "Ativo");
                setTelWhatsapp(maskPhone(p.whatsapp || ""));
                setTelCelular(maskPhone(p.phone_number || ""));
                setEmail(p.email || "");
                setEmergNome(p.emergency_name || "");
                setEmergTel(maskPhone(p.emergency_phone || ""));
                setPais(p.country || "");
                setEstado(p.states || "");
                setCidade(p.city || "");
                setEnderecoCompleto(p.address || "");
                setAlergias(p.known_allergias || "");
                setCondicoes(p.systemic_conditions || "");
                setMedicacoes(p.continuous_medications || "");
                setDrogas(p.drug_use || "");
                setCirurgias(p.surgeries_history || "");
            })
            .catch((err) => setErro(err.message))
            .finally(() => setLoading(false));
    }, [token, id_pacient]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSalvando(true);
        setErro(null);

        const payload = {
            name: nome,
            cpf: cpf.replace(/\D/g, ""),
            rg: rg || undefined,
            birth_date: data_nascimento,
            gender: genero,
            status,
            email,
            whatsapp: tel_whatsapp.replace(/\D/g, ""),
            phone_number: tel_celular ? tel_celular.replace(/\D/g, "") : undefined,
            emergency_name: emerg_nome,
            emergency_phone: emerg_tel.replace(/\D/g, ""),
            country: pais || undefined,
            states: estado || undefined,
            city: cidade || undefined,
            address: endereco_completo || undefined,
            known_allergias: alergias || undefined,
            systemic_conditions: condicoes || undefined,
            continuous_medications: medicacoes || undefined,
            drug_use: drogas || undefined,
            surgeries_history: cirurgias || undefined,
        };

        try {
            await apiAtualizarPaciente(token, id_pacient, payload);
            navigate(`/owner/pacients/${id_clinic}/view-pacient/${id_pacient}`);
        } catch (err) {
            setErro(err.message || "Erro ao atualizar paciente.");
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
                        Carregando dados do paciente...
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
                    <Link
                        className="text75"
                        to={`/owner/pacients/${id_clinic}/view-pacient/${id_pacient}`}
                    >
                        ← Voltar
                    </Link>
                </p>

                <div className="camp-clinic camp-register">
                    <div>
                        <h1 style={{ margin: "0 0 0.5rem 0" }}>Editar Paciente</h1>
                        <p className="text75">
                            Atualize os dados do paciente abaixo.
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
                                <p className="sec-title">Identificação Básica</p>

                                <div className="field">
                                    <label htmlFor="nome">Nome Completo *</label>
                                    <input
                                        id="nome"
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex-inpus">
                                    <div className="field">
                                        <label htmlFor="cpf">CPF *</label>
                                        <input
                                            id="cpf"
                                            type="text"
                                            value={cpf}
                                            onChange={(e) => setCpf(maskCPF(e.target.value))}
                                            required
                                            placeholder="000.000.000-00"
                                            maxLength={14}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="rg">RG</label>
                                        <input
                                            id="rg"
                                            type="text"
                                            value={rg}
                                            onChange={(e) => setRg(maskRG(e.target.value))}
                                            placeholder="Apenas números"
                                            maxLength={9}
                                        />
                                    </div>
                                </div>

                                <div className="flex-inpus">
                                    <div className="field">
                                        <label htmlFor="data_nascimento">Data de Nascimento *</label>
                                        <input
                                            id="data_nascimento"
                                            type="date"
                                            value={data_nascimento}
                                            onChange={(e) => setDataNascimento(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="genero">Gênero *</label>
                                        <select
                                            id="genero"
                                            value={genero}
                                            onChange={(e) => setGenero(e.target.value)}
                                        >
                                            <option>Feminino</option>
                                            <option>Masculino</option>
                                            <option>Outro</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="status">Status *</label>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option>Ativo</option>
                                        <option>Inativo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="forms-dat-section">
                                <p className="sec-title">Informações de Contato</p>

                                <div className="flex-inpus">
                                    <div className="field">
                                        <label htmlFor="tel_whatsapp">Telefone WhatsApp *</label>
                                        <input
                                            id="tel_whatsapp"
                                            type="text"
                                            value={tel_whatsapp}
                                            onChange={(e) => setTelWhatsapp(maskPhone(e.target.value))}
                                            required
                                            placeholder="(DD) 90000-0000"
                                            maxLength={15}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="tel_celular">Telefone Celular</label>
                                        <input
                                            id="tel_celular"
                                            type="text"
                                            value={tel_celular}
                                            onChange={(e) => setTelCelular(maskPhone(e.target.value))}
                                            placeholder="(DD) 90000-0000"
                                            maxLength={15}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="paciente@email.com"
                                        required
                                    />
                                </div>

                                <div className="flex-inpus">
                                    <div className="field">
                                        <label htmlFor="emerg_nome">Nome Contato de Emergência *</label>
                                        <input
                                            id="emerg_nome"
                                            type="text"
                                            value={emerg_nome}
                                            onChange={(e) => setEmergNome(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="emerg_tel">Telefone de Emergência *</label>
                                        <input
                                            id="emerg_tel"
                                            type="text"
                                            value={emerg_tel}
                                            onChange={(e) => setEmergTel(maskPhone(e.target.value))}
                                            placeholder="(DD) 90000-0000"
                                            maxLength={15}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="forms-dat-section">
                                <p className="sec-title">Endereço</p>

                                <div className="field">
                                    <label htmlFor="pais">País</label>
                                    <input
                                        id="pais"
                                        type="text"
                                        value={pais}
                                        onChange={(e) => setPais(e.target.value)}
                                    />
                                </div>

                                <div className="flex-inpus">
                                    <div className="field">
                                        <label htmlFor="estado">Estado</label>
                                        <input
                                            id="estado"
                                            type="text"
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="cidade">Cidade</label>
                                        <input
                                            id="cidade"
                                            type="text"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="endereco_completo">Endereço Completo</label>
                                    <input
                                        id="endereco_completo"
                                        type="text"
                                        value={endereco_completo}
                                        onChange={(e) => setEnderecoCompleto(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="forms-dat-section">
                                <p className="sec-title">Anamnese e Saúde Geral</p>

                                <div className="field">
                                    <label htmlFor="alergias">Alergias Conhecidas</label>
                                    <textarea
                                        id="alergias"
                                        value={alergias}
                                        onChange={(e) => setAlergias(e.target.value)}
                                        rows="3"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="condicoes">Condições Sistêmicas</label>
                                    <textarea
                                        id="condicoes"
                                        value={condicoes}
                                        onChange={(e) => setCondicoes(e.target.value)}
                                        rows="3"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="medicacoes">Medicações em Uso Contínuo</label>
                                    <textarea
                                        id="medicacoes"
                                        value={medicacoes}
                                        onChange={(e) => setMedicacoes(e.target.value)}
                                        rows="3"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="drogas">Drogas Recreativas de uso lícito e ilícito</label>
                                    <textarea
                                        id="drogas"
                                        value={drogas}
                                        onChange={(e) => setDrogas(e.target.value)}
                                        rows="3"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="cirurgias">Cirurgias Prévias e Histórico de Cicatrização/Sangramento</label>
                                    <textarea
                                        id="cirurgias"
                                        value={cirurgias}
                                        onChange={(e) => setCirurgias(e.target.value)}
                                        rows="3"
                                    />
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
                                    to={`/owner/pacients/${id_clinic}/view-pacient/${id_pacient}`}
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

export default EditPacient;
