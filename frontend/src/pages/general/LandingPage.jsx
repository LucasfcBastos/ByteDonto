/* IMPORTS OF COMPONENTS */
import Section from "../../components/section/SectionNotAuth";
import Button from "../../components/buttons/ButtonsRediBorder";
import Footer from "../../components/footer/FooterNotAuth";
import '../../styles/LandingPage.css'

/* MAIN COMPONENT */
function LandingPage() {
    return (
        <>
            <Section />
            <div className="start">
                <div className="centralize">
                    <span>
                        O MELHOR SOFTWARE DE GESTÃO DE <a>CLÍNICAS</a> É COMUNICAÇÃO DE PACIENTE QUE VOCÊ VAI ENCONTRAR
                    </span>

                    <h1 className="text75">
                        A plataforma completa para gestão odontologica. Gerencie sua clínica enquanto a IA melhora o relacionamento entre paciente e clínica.
                    </h1>

                    <Button text={"Vamos Começar"} url="/cadastro" />
                </div>
            </div>
            <Footer />
        </>
    );
}

/* STANDARD EXPORT */
export default LandingPage;