/* IMPORTS OF COMPONENTS */
import { useNavigate } from "react-router-dom";
import '../../styles/Buttons.css'

/* MAIN COMPONENT */
function ButtonsRediTitle({ text, url }) {
    const navigate = useNavigate();

    function registration() {
        navigate(`${url}`);
    }

    return (
        <>
            <button className='camp' onClick={registration}>
                <h1>{text}</h1>
            </button>
        </>
    );

}

/* STANDARD EXPORT */
export default ButtonsRediTitle;