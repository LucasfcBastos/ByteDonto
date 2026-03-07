/* IMPORTS OF COMPONENTS */
import { useNavigate } from "react-router-dom";
import '../../styles/Buttons.css'

/* MAIN COMPONENT */
function ButtonsRediText({ text, url }) {
    const navigate = useNavigate();

    function registration() {
        navigate(`${url}`);
    }

    return (
        <>
            <button className='camp' onClick={registration}>
                <p>{text}</p>
            </button>
        </>
    );

}

/* STANDARD EXPORT */
export default ButtonsRediText;