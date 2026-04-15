/* IMPORTS OF COMPONENTS */
import Section from "../../components/section/SectionAuth"
import ButtonH1 from "../../components/buttons/ButtonsRediTitle"
import SideBar from "../../components/bar/SideBar"
import Footer from "../../components/footer/FooterAuth"
import CampNotList from "../../components/camp/NotList"
import CampList from "../../components/camp/ListClinic"
import IMG from "../../assets/img/icon01.png"
import '../../styles/clinic.css';
import '../../styles/Input.css';

/* MAIN COMPONENT */
function ListClinic() {
    const api_clinic = [
    /*
    */
    {
        id: 1,
        logo: "",
        name: "C.0.E - Centro Odontológico Especializado",
        cnpj: "52.754.562/0001-24",
        phone: "+55 (62) 96666-7777",
    }
    ];

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
                <div style={{ display: "flex", justifyContent: "space-between"}}>
                    <div>
                        <h1>Minhas Clínicas</h1>
                        <p className="text75">Gerencie as clínicas que você têm</p>
                    </div>
                    <ButtonH1 text={"Registrar"} url="/owner/clinic/register" />
                </div>
                <div>
                    <input placeholder="Buscar clínica por nome ou cnpj..." />
                </div>
                <div className="camp-clinic camp-list">
                    <h1>Clínicas Registrados</h1>
                    {
                        api_clinic.length === 0 ? (
                            <CampNotList
                                img={IMG}
                                text_p="Nenhuma clínica foi registrada"
                                text_l="Você ainda não cadastrou nenhuma clínica. Comece cadastrando sua primeira clínica!"
                                text_btn="Cadastrar sua Primeira Clínica"
                                utl_btn="/owner/clinic/register"
                            />
                        ) : (
                            api_clinic.map((api_clinic) => (
                                <CampList
                                    key={api_clinic.id}
                                    clinic_logo={api_clinic.logo}
                                    clinic_img={IMG}
                                    clinic_name={api_clinic.name}
                                    clinic_cnpj={api_clinic.cnpj}
                                    clinic_phone={api_clinic.phone}
                                />
                            ))
                        )
                    }
                </div>
            </main>
            <Footer type_styles="mainBar owner" text={`Gestão
                Eficiência
                Resultados
                Crescimento`} />
        </>
    );
}

/* STANDARD EXPORT */
export default ListClinic;
