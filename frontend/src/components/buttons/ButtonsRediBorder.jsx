/* IMPORTS OF COMPONENTS */
import { useNavigate } from "react-router-dom";
import '../../styles/Buttons.css'

/* MAIN COMPONENT */
function ButtonsRediBorder({ text, url }) {
    const navigate = useNavigate();

    function registration() {
        if (url) navigate(url);
    }

    return (
        <>
            <button className='redi' onClick={registration}>
                <h1>{text}</h1>
            </button>
        </>
    );

}

/* STANDARD EXPORT */
export default ButtonsRediBorder;