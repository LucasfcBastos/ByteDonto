/* IMPORTS OF COMPONENTS */
import Section from "../../components/section/SectionAuth"
import ButtonH1 from "../../components/buttons/ButtonsRediTitle"
import Footer from "../../components/footer/FooterAuth"
import CampNotList from "../../components/camp/NotList"
import CampList from "../../components/camp/ListClinic"
import IMG from "../../assets/img/icon01.png"
import '../../styles/clinic.css';
import '../../styles/Input.css';

/* MAIN COMPONENT */
function ViewClinic() {
    return (
        <>
            <Section type_styles="owner" />
            <main className="owner">
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
                    {/*
                    SE CASO O USUARIO NÃO TENHA NENHUM REGISTRO DE CLÍNICA [
                    <CampNotList
                        img={IMG}
                        text_p="Nenhuma clínica foi registrada"
                        text_l="Você ainda não cadastrou nenhuma clínica. Comece cadastrando seu primeira clínica!"
                        text_btn="Cadastrar sua Primeira Clínicas"
                        utl_btn="/owner/clinic/register"
                    />
                    ] CASO TENHA [
                        <CampList
                            clinic_logo="api_clinic.logo"
                            clinic_img={IMG}
                            clinic_name={api_clinic.name}
                            clinic_cnpj={api_clinic.cnpj}
                            clinic_phone={api_clinic.phone}
                        />
                    ]
                    */}
                    <CampList
                        clinic_logo=""
                        clinic_img={IMG}
                        clinic_name={"C.0.E - Centro Odontológico Especializado"}
                        clinic_cnpj={"52.754.562/0001-24"}
                        clinic_phone={"+55 (62) 96666-7777"}
                    />
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
