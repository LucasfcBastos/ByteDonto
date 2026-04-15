/* IMPORTS OF COMPONENTS */
import { Link } from "react-router-dom";
import Section from "../../components/section/SectionAuth"
import Footer from "../../components/footer/FooterAuth"
import IMG from "../../assets/img/icon01.png"
import '../../styles/clinic.css';

/* MAIN COMPONENT */
function ViewClinic() {
    const api_clinic = {
        id: 1,
        logo: "",
        name: "C.0.E - Centro Odontológico Especializado",
        cnpj: "52.754.562/0001-24",
        phone: "+55 (62) 96666-7777",
    };

    return (
        <>
            <Section type_styles="owner" />
            <div className="owner view-header">
                <div className="info">
                    <div className="circle">
                        <img src={api_clinic.logo ? api_clinic.logo : IMG} />
                    </div>
                    <div className="text">
                        <h1>{api_clinic.name}</h1>
                        <div>
                            <p>{api_clinic.cnpj} | {api_clinic.phone}</p>
                            <Link className="text75" to="/owner/clinic">Editar Clínica</Link>
                        </div>
                    </div>
                </div>
            </div>
            <main className="owner register">
                <div className="camp-clinic camp-view">
                    <div>
                        <h1>Clínica</h1>
                        <p className="text75">Olá, é muito importante que você adicione todos as informações da sua clínica para que melhorar a comunicação com seus pacientes.</p>
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
export default ViewClinic;
