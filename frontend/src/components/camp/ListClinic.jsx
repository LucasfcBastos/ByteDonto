/* IMPORTS OF COMPONENTS */
import { Link } from "react-router-dom";
import '../../styles/List.css'

/* MAIN COMPONENT */
function ListClinic({ clinic_id, clinic_logo, clinic_img, clinic_name, clinic_cnpj, clinic_phone  }) {
    return (
        <>
            <Link className="list" to={`/owner/view-clinic/${clinic_id}`}>
                <div className='circle'>
                    <img src={clinic_logo ? clinic_logo : clinic_img} />
                </div>
                <div>
                    <p>{clinic_name}</p>
                    <p>{clinic_cnpj} | {clinic_phone}</p>
                </div>
            </Link>
        </>
    );
}

export default ListClinic;