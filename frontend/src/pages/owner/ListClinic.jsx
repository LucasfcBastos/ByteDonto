/* IMPORTS OF COMPONENTS */
import ApiClinic from "../../data/api_clinic"
import Section from "../../components/section/SectionAuth"
import ButtonH1 from "../../components/buttons/ButtonsRediTitle"
import SideBar from "../../components/bar/SideBar"
import CampNotList from "../../components/camp/NotList"
import CampList from "../../components/camp/ListClinic"
import IMG from "../../assets/img/icon01.png"
import '../../styles/clinic.css';
import '../../styles/Input.css';

/* MAIN COMPONENT */
function ListClinic() {

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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                    <div>
                        <h1 style={{margin: 0, fontSize: '28px', color: 'var(--PrimaryColorsTheme)'}}>Minhas Clínicas</h1>
                        <p className="text75">Gerencie as clínicas cadastradas em sua conta</p>
                    </div>
                    <ButtonH1 text={"Registrar Nova Clínica"} url="/owner/clinic/register" />
                </div>
                <div style={{marginTop: '1rem'}}>
                    <input 
                        type="text" 
                        placeholder="Buscar clínica por nome ou CNPJ..." 
                        style={{padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--LineColor)', width: '100%', maxWidth: '400px'}}
                    />
                </div>
                <div className="camp-clinic camp-list" style={{marginTop: '1rem'}}>
                    <h2 style={{margin: '0 0 1rem 0', fontSize: '20px'}}>Clínicas Registradas</h2>
                    {
                        ApiClinic.length === 0 ? (
                            <CampNotList
                                img={IMG}
                                text_p="Nenhuma clínica foi registrada"
                                text_l="Você ainda não cadastrou nenhuma clínica. Comece cadastrando sua primeira clínica!"
                                text_btn="Cadastrar sua Primeira Clínica"
                                utl_btn="/owner/clinic/register"
                            />
                        ) : (
                            ApiClinic.map((item) => (
                                <CampList
                                    key={item.id}
                                    clinic_id={item.id}
                                    clinic_logo={item.logo}
                                    clinic_img={IMG}
                                    clinic_name={item.name}
                                    clinic_cnpj={item.cnpj}
                                    clinic_phone={item.whatsapp}
                                />
                            ))
                        )
                    }
                </div>
            </main>
        </>
    );
}

/* STANDARD EXPORT */
export default ListClinic;
