/* IMPORTS OF COMPONENTS */
import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Data from '../../data/api_clinic';
import Section from "../../components/section/SectionAuth";
import Footer from "../../components/footer/FooterAuth";
import '../../styles/clinic.css';
import '../../styles/Forms.css';

/* MAIN COMPONENT */
function EditClinic() {
    
    const { id } = useParams();

    const clinic = Data.find(
        (item) => item.id === Number(id)
    );
    
    if (!clinic) {
        return <Navigate to="/" replace />;
    }

    /* STATES */
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

    /* LOAD DATA INTO INPUTS */
    useEffect(() => {
        if (clinic) {
            setNameClinic(clinic.name || "");
            setCNPJ(clinic.cnpj || "");
            setRazaoSocial(clinic.razao_social || "");
            setResumo(clinic.resumo || "");

            setWhatsapp(clinic.whatsapp || "");
            setTelefone(clinic.telefone || "");
            setInstagram(clinic.instagram || "");
            setFacebook(clinic.facebook || "");

            setPais(clinic.endereco?.pais || "");
            setEstado(clinic.endereco?.estado || "");
            setCidade(clinic.endereco?.cidade || "");
            setEndereco(clinic.endereco?.logradouro || "");
        }
    }, [clinic]);

    /* SUBMIT */
    function handleSubmit(e) {
        e.preventDefault();

        const updatedClinic = {
            id: clinic.id,
            name: name_clinic,
            cnpj: CNPJ,
            razao_social,
            resumo,
            whatsapp,
            telefone,
            instagram,
            facebook,
            endereco: {
                pais,
                estado,
                cidade,
                logradouro: endereco
            }
        };

        console.log("Dados atualizados:", updatedClinic);

        // Aqui você pode enviar para API futuramente
    }

    return (
        <>
            <Section type_styles="owner" />
            
            <main className="owner register">
                <p>
                    <Link className="text75" to={`/owner/view-clinic/${id}`}>← Voltar para home</Link>
                </p>

                <div className="camp-clinic camp-register">
                    <div>
                        <h1>Clínica</h1>
                        <p className="text75">
                            Olá, é muito importante que você adicione todos as informações da sua clínica para melhorar a comunicação com seus pacientes.
                        </p>

                        <form onSubmit={handleSubmit}>

                            {/* DADOS BÁSICOS */}
                            <div className="forms-section">
                                <p className="sec-title">Dados Básicos</p>
                                
                                <div className="field">
                                    <label>Nome da Clínica *</label>
                                    <input
                                        type="text"
                                        value={name_clinic}
                                        onChange={(e) => setNameClinic(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex-inpus">
                                    <div className="field">
                                        <label>CNPJ *</label>
                                        <input
                                            type="text"
                                            value={CNPJ}
                                            onChange={(e) => setCNPJ(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="field">
                                        <label>Razão Social</label>
                                        <input
                                            type="text"
                                            value={razao_social}
                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="field">
                                    <label>Resumo da Clínica</label>
                                    <textarea
                                        value={resumo}
                                        onChange={(e) => setResumo(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* REDES SOCIAIS */}
                            <div className="forms-section">
                                <p className="sec-title">Redes Sociais</p>
                                
                                <div className="flex-inpus">
                                    <div className="field">
                                        <label>Whatsapp *</label>
                                        <input
                                            type="text"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="field">
                                        <label>Telefone</label>
                                        <input
                                            type="text"
                                            value={telefone}
                                            onChange={(e) => setTelefone(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex-inpus">
                                    <div className="field">
                                        <label>Instagram</label>
                                        <input
                                            type="text"
                                            value={instagram}
                                            onChange={(e) => setInstagram(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="field">
                                        <label>Facebook</label>
                                        <input
                                            type="text"
                                            value={facebook}
                                            onChange={(e) => setFacebook(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ENDEREÇO */}
                            <div className="forms-section">
                                <p className="sec-title">Endereço</p>

                                <div className="field">
                                    <label>País</label>
                                    <input
                                        type="text"
                                        value={pais}
                                        onChange={(e) => setPais(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex-inpus">
                                    <div className="field">
                                        <label>Estado</label>
                                        <input
                                            type="text"
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="field">
                                        <label>Cidade</label>
                                        <input
                                            type="text"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label>Endereço Completo</label>
                                    <input
                                        type="text"
                                        value={endereco}
                                        onChange={(e) => setEndereco(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "end" }}>
                                <button type="submit" className="submit">
                                    <h1>Salvar</h1>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>

            <Footer 
                type_styles="owner" 
                text={`Gestão
Eficiência
Resultados
Crescimento`} 
            />
        </>
    );
}

/* STANDARD EXPORT */
export default EditClinic;