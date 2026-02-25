/* IMPORTS OF COMPONENTS */
import Section from "../../components/Section";
import '../styles/LandingPage.css'

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

                    <h1 className="third_quartile">
                        A plataforma completa para gestão odontologica. Gerencie sua clínica enquanto a IA melhora o relacionamento entre paciente e clínica.
                    </h1>
                </div>
            </div>
        </>
    );
}

/* STANDARD EXPORT */
export default LandingPage;