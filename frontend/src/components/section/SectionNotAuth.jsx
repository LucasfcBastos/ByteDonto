/* IMPORTS OF COMPONENTS */
import ButtonsCamps from "../buttons/ButtonsCamps";
import '../../styles/Section.css'

/* MAIN COMPONENT */
function SectionNotAuth() {
    return (
        <>
            <section>
                <h1 id="logo">BYTE DONTO</h1>
                <div>
                    <ButtonsCamps type={"LOGIN"} url="/login" />
                    {/* 
                    IMPLEMENTAÇÃO FUTURA
                    <div className="out">
                        <ButtonsCamps type={"CADASTRO"} />
                    </div>*/}
                </div>
            </section>
        </>
    );
}

/* STANDARD EXPORT */
export default SectionNotAuth;