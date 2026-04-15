/* IMPORTS OF COMPONENTS */
import '../../styles/List.css'

/* MAIN COMPONENT */
function ListClinic({ clinic_logo, clinic_img, clinic_name, clinic_cnpj, clinic_phone  }) {
    return (
        <>
            <div className="list">
                <div className='circle'>
                    <img src={clinic_logo ? clinic_logo : clinic_img} />
                </div>
                <div>
                    <p>{clinic_name}</p>
                    <p>{clinic_cnpj} | {clinic_phone}</p>
                </div>
            </div>
        </>
    );
}

export default ListClinic;