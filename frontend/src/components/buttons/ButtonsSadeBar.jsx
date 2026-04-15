/* IMPORTS OF COMPONENTS */
import { useNavigate } from "react-router-dom";
import '../../styles/Buttons.css'

/* MAIN COMPONENT */
function ButtonsCamps({ icon, name, style, url }) {
    const navigate = useNavigate();

    function registration() {
        navigate(`${url}`);
    }

    return (
        <>
            <button className={`bar ${style}`} onClick={registration}>
                <img src={icon} />
                <p>{name}</p>
            </button>
        </>
    );

}

/* STANDARD EXPORT */
export default ButtonsCamps;