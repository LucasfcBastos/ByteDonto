/* IMPORTS OF COMPONENTS */
import { Link, useParams } from "react-router-dom";
import Data from '../../data/api_clinic'
import Section from "../../components/section/SectionAuth"
import Footer from "../../components/footer/FooterAuth"
import '../../styles/clinic.css';
import '../../styles/Forms.css';

/* MAIN COMPONENT */
function RegisterClinic() {

    const { id } = useParams();

    const clinic = Data.find(
        (item) => item.id === Number(id)
    );
    
    if (!clinic) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Section type_styles="owner" />
            
            <main className="owner register">
                <p>
                    <Link className="text75" to={`/owner/view-clinic/${id}`}>← Voltar</Link>
                </p>
                <div className="camp-clinic camp-register">
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                        <h1>Convites</h1>
                        <p className="text75">{clinic.name}</p>
                    </div>
                    <div>
                        <button className="camp">
                            <h1>Vincular</h1>
                        </button>
                    </div>
                    </div>
                </div>
            </main>
            <Footer type_styles="owner" text={`Gestão
                Eficiência
                Resultados
                Crescimento`} />
        </>
    );
}

/* STANDARD EXPORT */
export default RegisterClinic;
