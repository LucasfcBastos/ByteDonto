/* IMPORTS OF COMPONENTS */
import { useNavigate } from "react-router-dom";
import '../../styles/Buttons.css'

/* MAIN COMPONENT */
function ButtonsCamps({ type, url }) {
    const navigate = useNavigate();

    function registration() {
        if (url) navigate(url);
    }

    return (
        <>
            <button className='camp' onClick={registration}>
                <h1>{type}</h1>
            </button>
        </>
    );

}

/* STANDARD EXPORT */
export default ButtonsCamps;