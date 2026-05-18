/* IMPORTS OF COMPONENTS */
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiGetClinic, apiUpdateClinic } from "../../../services/api";
import { useOwnerSidebar } from "../../../hooks/useSidebar";

import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";

import "../../../styles/clinic.css";
import "../../../styles/Forms.css";

function formatCNPJ(value) {
    const digits = value.replace(/\D/g, "").slice(0, 14);

    if (digits.length <= 2) return digits;

    if (digits.length <= 5) {
        return `${digits.slice(0,2)}.${digits.slice(2)}`;
    }

    if (digits.length <= 8) {
        return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5)}`;
    }

    if (digits.length <= 12) {
        return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8)}`;
    }

    return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8,12)}-${digits.slice(12)}`;
}

/* MAIN COMPONENT */
function EditClinic() {

    const { id } = useParams();

    const { token } = useAuth();

    const opc_bar = useOwnerSidebar("clinic");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [name_clinic, setNameClinic] = useState("");
    const [CNPJ, setCNPJ] = useState("");
    const [razao_social, setRazaoSocial] = useState("");
    const [resumo, setResumo] = useState("");

    const [whatsapp, setWhatsapp] = useState("");
    const [telefone, setTelefone] = useState("");
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");

    const [pais, setPais] = useState("");
    const [estado, setEstado] = useState("");
    const [cidade, setCidade] = useState("");
    const [endereco, setEndereco] = useState("");

    /* LOAD CLINIC */
    useEffect(() => {

        async function loadClinic() {

            try {

                const clinicData = await apiGetClinic(
                    token,
                    id
                );

                setNameClinic(clinicData.name || "");

                setCNPJ(
                    formatCNPJ(
                        clinicData.cnpj || ""
                    )
                );

                setRazaoSocial(
                    clinicData.company_name || ""
                );

                setResumo(
                    clinicData.summary || ""
                );

                setWhatsapp(
                    clinicData.whatsapp || ""
                );

                setTelefone(
                    clinicData.phone_number || ""
                );

                setInstagram(
                    clinicData.instagram || ""
                );

                setFacebook(
                    clinicData.facebook || ""
                );

                setPais(
                    clinicData.country || ""
                );

                setEstado(
                    clinicData.states || ""
                );

                setCidade(
                    clinicData.city || ""
                );

                setEndereco(
                    clinicData.address || ""
                );

            } catch (err) {

                console.error(
                    "Erro ao carregar clínica",
                    err
                );

            } finally {

                setLoading(false);

            }

        }

        if (token && id) {
            loadClinic();
        }

    }, [token, id]);

    /* SUBMIT */
    async function handleSubmit(e) {

        e.preventDefault();

        setSaving(true);

        const updatedClinic = {
            name: name_clinic,
            company_name: razao_social,
            cnpj: CNPJ,
            phone_number: telefone,
            whatsapp: whatsapp,
            instagram: instagram,
            facebook: facebook,
            summary: resumo,
            address: endereco,
            city: cidade,
            states: estado,
            country: pais,
        };

        try {

            await apiUpdateClinic(
                token,
                id,
                updatedClinic
            );

            alert(
                "Clínica atualizada com sucesso!"
            );

        } catch (err) {

            console.error(err);

            alert(
                err.message ||
                "Erro ao atualizar clínica."
            );

        } finally {

            setSaving(false);

        }

    }

    if (loading) {

        return (
            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >
                Carregando clínica...
            </div>
        );

    }

    return (
        <>
            <Section type_styles="owner" />

            <SideBar
                opc={opc_bar}
                styles="owner"
            />

            <main className="mainBar owner register">

                <p>

                    <Link
                        className="text75"
                        to={`/owner/view-clinic/${id}`}
                    >
                        ← Voltar para Clínica
                    </Link>

                </p>

                <div className="camp-clinic camp-register">

                    <div>

                        <h1
                            style={{
                                margin: "0 0 0.5rem 0"
                            }}
                        >
                            Atualizar Clínica
                        </h1>

                        <p className="text75">
                            Atualize as informações da sua clínica.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            style={{
                                marginTop: "2rem"
                            }}
                        >

                            {/* DADOS BÁSICOS */}

                            <div className="forms-dat-section">

                                <p className="sec-title">
                                    Dados Básicos
                                </p>

                                <div className="field">

                                    <label>
                                        Nome da Clínica *
                                    </label>

                                    <input
                                        type="text"
                                        value={name_clinic}
                                        onChange={(e) =>
                                            setNameClinic(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="flex-inpus">

                                    <div className="field">

                                        <label>
                                            CNPJ *
                                        </label>

                                        <input
                                            type="text"
                                            value={CNPJ}
                                            onChange={(e) =>
                                                setCNPJ(
                                                    formatCNPJ(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                            placeholder="00.000.000/0000-00"
                                            maxLength={18}
                                        />

                                    </div>

                                    <div className="field">

                                        <label>
                                            Razão Social
                                        </label>

                                        <input
                                            type="text"
                                            value={razao_social}
                                            onChange={(e) =>
                                                setRazaoSocial(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                                <div className="field">

                                    <label>
                                        Resumo da Clínica
                                    </label>

                                    <textarea
                                        value={resumo}
                                        onChange={(e) =>
                                            setResumo(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                            {/* REDES SOCIAIS */}

                            <div className="forms-dat-section">

                                <p className="sec-title">
                                    Redes Sociais
                                </p>

                                <div className="flex-inpus">

                                    <div className="field">

                                        <label>
                                            Whatsapp *
                                        </label>

                                        <input
                                            type="text"
                                            value={whatsapp}
                                            onChange={(e) =>
                                                setWhatsapp(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="field">

                                        <label>
                                            Telefone
                                        </label>

                                        <input
                                            type="text"
                                            value={telefone}
                                            onChange={(e) =>
                                                setTelefone(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                                <div className="flex-inpus">

                                    <div className="field">

                                        <label>
                                            Instagram
                                        </label>

                                        <input
                                            type="text"
                                            value={instagram}
                                            onChange={(e) =>
                                                setInstagram(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="field">

                                        <label>
                                            Facebook
                                        </label>

                                        <input
                                            type="text"
                                            value={facebook}
                                            onChange={(e) =>
                                                setFacebook(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* ENDEREÇO */}

                            <div className="forms-dat-section">

                                <p className="sec-title">
                                    Endereço
                                </p>

                                <div className="field">

                                    <label>
                                        País
                                    </label>

                                    <input
                                        type="text"
                                        value={pais}
                                        onChange={(e) =>
                                            setPais(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="flex-inpus">

                                    <div className="field">

                                        <label>
                                            Estado
                                        </label>

                                        <input
                                            type="text"
                                            value={estado}
                                            onChange={(e) =>
                                                setEstado(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="field">

                                        <label>
                                            Cidade
                                        </label>

                                        <input
                                            type="text"
                                            value={cidade}
                                            onChange={(e) =>
                                                setCidade(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                                <div className="field">

                                    <label>
                                        Endereço Completo
                                    </label>

                                    <input
                                        type="text"
                                        value={endereco}
                                        onChange={(e) =>
                                            setEndereco(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    marginTop: "2rem"
                                }}
                            >

                                <button
                                    type="submit"
                                    className="submit"
                                    disabled={saving}
                                >
                                    {
                                        saving
                                            ? "Salvando..."
                                            : "Salvar Atualizações"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </main>
        </>
    );

}

export default EditClinic;