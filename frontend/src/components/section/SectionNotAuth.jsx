/* IMPORTS OF COMPONENTS */
import ButtonsCamps from "../buttons/ButtonsCamps";
import '../../styles/Section.css'

import { useNavigate } from "react-router-dom";

/* MAIN COMPONENT */
function SectionNotAuth() {
    const navigate = useNavigate();

    return (
        <>
            <section>
                <h1 id="logo">BYTE DONTO</h1>
                <div>
                    <ButtonsCamps type={"LOGIN"} url="/login" />
                    <div className="out">
                        <ButtonsCamps type={"CADASTRO"} url="/cadastro" />
                    </div>
                </div>
            </section>
        </>
    );
}

/* STANDARD EXPORT */
export default SectionNotAuth;