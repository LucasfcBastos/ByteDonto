/* IMPORTS OF COMPONENTS */
import { Link, useParams, Navigate } from "react-router-dom";
import Data from '../../data/api_clinic'
import Section from "../../components/section/SectionAuth"
import Footer from "../../components/footer/FooterAuth"
import Card from "../../components/card/CardInfo"
import IMG from "../../assets/img/icon01.png"
import ButtonP from "../../components/buttons/ButtonsRediText"
import '../../styles/clinic.css';

/* MAIN COMPONENT */
function ViewClinic() {

    const { id } = useParams();

    const clinic = Data.find(
        (item) => item.id === Number(id)
    );
    
    if (!clinic) {
        return <Navigate to="/" replace />;
    }
    
    return (
        <>
            <Section type_styles="owner" />
            <div className="owner view-header">
                <div className="info">
                    <div className="circle">
                        <img src={clinic.logo ? clinic.logo : IMG} />
                    </div>
                    <div className="text">
                        <h1>{clinic.name}</h1>
                        <div>
                            <p>{clinic.cnpj} | {clinic.whatsapp}</p>
                            <Link className="text75" to="/owner/clinic">Editar Clínica</Link>
                        </div>
                    </div>
                </div>
            </div>
            <main className="owner register">
                <div className="camp-clinic camp-view">
                    <div>
                        <h1>Informações gerais</h1>
                        <p className="text75">Tempo:</p>
                        <select style={{ margin: "1.5em 0em"}}>
                            <option>Hoje</option>
                            <option>Nesta semana</option>
                            <option>Neste mês</option>
                            <option>Este ano</option>
                        </select>
                        <div className="cards">
                            <Card title="Nº Pacientes Cadastrados" date="0" />
                            <Card title="Nº Consultas Cadastradas" date="0" />
                            <Card title="Nº de Consultas Finalizadas" date="0" />
                        </div>
                    </div>
                    <div>
                        <h1>Membros da equipe</h1>
                        <div className="cards">
                            <Card title="Nº de Especialista Ativos" date="0" />
                            <Card title="Nº de Atendimento Ativos" date="0" />
                        </div>
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-end", margin: "1.5em 0em 0em 0em"}}>
                            <ButtonP text={"Convidar Membro"} url={"/"} />
                        </div>
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
