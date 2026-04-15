/* IMPORTS OF COMPONENTS */
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Data from '../../data/api_clinic'
import Vincula from '../../data/invites'
import Section from "../../components/section/SectionAuth"
import Footer from "../../components/footer/FooterAuth"
import '../../styles/clinic.css';
import '../../styles/Forms.css';
import '../../styles/Table.css';

/* MAIN COMPONENT */
function RegisterClinic() {

    const [showForm, setShowForm] = useState(false);

    const { id } = useParams();

    const clinic = Data.find(
        (item) => item.id === Number(id)
    );
    
    if (!clinic) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showForm]);

    return (
        <>
            <Section type_styles="owner" />

            <div className="forms-hover owner" style={{ display: showForm ? "block" : "none" }}>
                <div className="forms-card">
                    <form>
                        <div className="field">
                            <label htmlFor="name_clinic">Email *</label>
                            <input
                                id="name_clinic"
                                type="text"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="name_clinic">Perfil *</label>
                            <select>
                                <option id="2">Especialista</option>
                                <option id="3">Atendimento</option>
                            </select>
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <button className="camp not" onClick={() => setShowForm(false)}>
                                <p>Cancelar Pedido</p>
                            </button>
                            <button className="camp">
                                <p>Convidar Membro</p>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <main className="owner register">
                <p>
                    <Link className="text75" to={`/owner/view-clinic/${id}`}>← Voltar</Link>
                </p>
                <div className="camp-clinic camp-register">
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5em"}}>
                        <div>
                            <h1>Convites</h1>
                            <p className="text75">{clinic.name}</p>
                        </div>
                        <div>
                            <button className="camp" onClick={() => setShowForm(true)}>
                                <h1>Vincular</h1>
                            </button>
                        </div>
                    </div>
                    <div>
                        {
                            Vincula.length === 0 ? (
                                <div style={{textAlign: "center"}}>
                                    <p>Nenhum convite enviado</p>
                                    <label className="text75">Não há convites enviado para esta clínica.</label>
                                </div>
                            ) : (
                                <div className="table">
                                    <div className="table-header">
                                        <p className="text75">Nome</p>
                                        <p className="text75">Email</p>
                                        <p className="text75">Cargo</p>
                                        <p className="text75">Status</p>
                                    </div>

                                    <div className="table-body">
                                        {Vincula.map((invite) => (
                                        <div className="table-row" key={invite.id}>
                                            <p>{invite.name}</p>
                                            <p>{invite.email}</p>
                                            <p>{invite.role}</p>
                                            <p>{invite.status}</p>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
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
