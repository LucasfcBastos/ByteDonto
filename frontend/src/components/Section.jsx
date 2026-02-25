/* IMPORTS OF COMPONENTS */
import ButtonsCamps from "./buttons/ButtonsCamps";
import '../styles/Section.css'

/* MAIN COMPONENT */
function Section() {
    return (
        <>
            <section>
                <h1 id="logo">BYTE DONTO</h1>
                <div>
                    <ButtonsCamps type={"LOGIN"} />
                    <ButtonsCamps type={"CADASTRO"} />
                </div>
            </section>
        </>
    );
}

/* STANDARD EXPORT */
export default Section;