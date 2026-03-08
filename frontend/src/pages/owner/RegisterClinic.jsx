/* IMPORTS OF COMPONENTS */
import { useState } from "react";
import { Link } from "react-router-dom";
import Section from "../../components/section/SectionAuth"
import Footer from "../../components/footer/FooterAuth"
import '../../styles/clinic.css';
import '../../styles/Forms.css';

/* MAIN COMPONENT */
function RegisterClinic() {
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
    const [esdereco, setEndereco] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { access_token } = await apiLogin(email, password);
            const perfil = await apiMe(access_token);
            login(access_token, perfil);
            navigate("/owner/clinic");
        } catch (err) {
            setError(err.message || "Email ou senha incorretos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Section type_styles="owner" />
            
            <main className="owner register">
                <p>
                    <Link className="text75" to="/owner/clinic">← Voltar para home</Link>
                </p>
                <div className="camp-clinic camp-register">
                    <div>
                        <h1>Clínica</h1>
                        <p className="text75">Olá, é muito importante que você adicione todos as informações da sua clínica para que melhorar a comunicação com seus pacientes.</p>

                        <form onSubmit={handleSubmit}>

                            <div className="forms-section">
                                <p className="sec-title">Dados Basícos</p>
                                
                                <div className="field">
                                    <label htmlFor="name_clinic">Nome da Clínica *</label>
                                    <input
                                        id="name_clinic"
                                        type="text"
                                        value={name_clinic}
                                        onChange={(e) => setNameClinic(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex-inpus">
                                    <div className="field">
                                        <label htmlFor="CNPJ">CNPJ *</label>
                                        <input
                                            id="CNPJ"
                                            type="text"
                                            value={CNPJ}
                                            onChange={(e) => setCNPJ(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="field">
                                        <label htmlFor="razao_social">Razão Social</label>
                                        <input
                                            id="razao_social"
                                            type="text"
                                            value={razao_social}
                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="field">
                                    <label htmlFor="resumo">Resumo da Clínica</label>
                                    <textarea
                                        id="resumo"
                                        type="text"
                                        value={resumo}
                                        onChange={(e) => setResumo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="forms-section">
                                <p className="sec-title">Redes Sociais</p>
                                
                                <div className="flex-inpus">
                                    <div className="field">
                                        <label htmlFor="whatsapp">Whatsapp da Clínica *</label>
                                        <input
                                            id="whatsapp"
                                            type="text"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="field">
                                        <label htmlFor="telefone">Telefone da Clínica</label>
                                        <input
                                            id="telefone"
                                            type="text"
                                            value={telefone}
                                            onChange={(e) => setTelefone(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex-inpus">
                                    <div className="field">
                                        <label htmlFor="instagram">Instagram da Clínica</label>
                                        <input
                                            id="instagram"
                                            type="text"
                                            value={instagram}
                                            onChange={(e) => setInstagram(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="field">
                                        <label htmlFor="facebook">Facebook da Clínica</label>
                                        <input
                                            id="facebook"
                                            type="text"
                                            value={facebook}
                                            onChange={(e) => setFacebook(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="forms-section">
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
                                    <label htmlFor="esdereco">Endereço Completo</label>
                                    <input
                                        id="esdereco"
                                        type="text"
                                        value={esdereco}
                                        onChange={(e) => setEndereco(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "end" }}>
                                <button
                                    type="submit"
                                    className="submit"
                                >
                                    <h1>Salvar</h1>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer type_styles="owner" text={`Gestão
                Eficiência
                Resultados
                Crescimento`} />
        </>
    );
}

/* STANDARD EXPORT */
export default RegisterClinic;
