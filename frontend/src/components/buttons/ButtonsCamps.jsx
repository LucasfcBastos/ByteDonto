/* IMPORTS OF COMPONENTS */
import '../../styles/Buttons.css'

/* MAIN COMPONENT */
function ButtonsCamps({ type }) {
    return (
        <>
            <button className='camp'>
                <h1>{type}</h1>
            </button>
        </>
    );

}

/* STANDARD EXPORT */
export default ButtonsCamps;