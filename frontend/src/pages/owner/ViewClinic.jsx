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
