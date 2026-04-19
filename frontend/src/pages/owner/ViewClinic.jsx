/* IMPORTS OF COMPONENTS */
import { Link, useParams, Navigate } from "react-router-dom";
import Data from '../../data/api_clinic'
import Vincula from '../../data/invites'
import Section from "../../components/section/SectionAuth"
import SideBar from "../../components/bar/SideBar"
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

    const opc_bar = [
        {
            id: 1,
            icon: IMG,
            name: "Clínica",
            url: "/owner/clinic/register",
            style: "select"
        }
    ];
    
    return (
        <>
            <Section type_styles="owner" />
            <SideBar opc={opc_bar} styles="owner" />
            
            <main className="mainBar owner">
                <Link className="view-back-link text75" to="/owner/clinic">← Voltar para Minhas Clínicas</Link>

                <div className="view-header">
                    <div className="circle">
                        <img src={clinic.logo ? clinic.logo : IMG} alt="Logo" />
                    </div>
                    <div className="text">
                        <h1>{clinic.name}</h1>
                        <p>{clinic.cnpj} | {clinic.whatsapp}</p>
                        <Link to={`/owner/edit-clinic/${id}`}>Editar Informações da Clínica</Link>
                    </div>
                </div>

                <div className="camp-clinic camp-view">
                    <div>
                        <h2>Informações Gerais</h2>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem'}}>
                            <p className="text75" style={{margin:0}}>Filtro de Tempo:</p>
                            <select style={{width:'auto'}}>
                                <option>Hoje</option>
                                <option>Nesta semana</option>
                                <option>Neste mês</option>
                                <option>Este ano</option>
                            </select>
                        </div>
                        <div className="cards">
                            <Card title="Nº Pacientes Cadastrados" date="0" />
                            <Card title="Nº Consultas Cadastradas" date="0" />
                            <Card title="Nº de Consultas Finalizadas" date="0" />
                        </div>
                    </div>

                    <div style={{marginTop: '1rem'}}>
                        <h2>Membros da Equipe</h2>
                        <div className="cards">
                            <Card title="Nº de Especialistas Ativos" date={Vincula.length} />
                            <Card title="Nº de Atendimentos Ativos" date="0" />
                        </div>
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-end", marginTop: "2rem"}}>
                            <ButtonP text={"Convidar Novo Membro"} url={`/owner/bind-clinic/${id}`} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

/* STANDARD EXPORT */
export default ViewClinic;
