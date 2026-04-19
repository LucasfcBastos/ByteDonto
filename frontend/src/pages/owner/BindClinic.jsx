/* IMPORTS OF COMPONENTS */
import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Data from '../../data/api_clinic'
import Vincula from '../../data/invites'
import Section from "../../components/section/SectionAuth"
import SideBar from "../../components/bar/SideBar"
import IMG from "../../assets/img/icon01.png"
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

    const opc_bar = [
        {
            id: 1,
            icon: IMG,
            name: "Clínica",
            url: "/owner/clinic/register",
            style: "select"
        }
    ];

    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowForm(false);
    };

    return (
        <>
            <Section type_styles="owner" />
            <SideBar opc={opc_bar} styles="owner" />

            <div className="forms-hover owner" style={{ display: showForm ? "flex" : "none" }}>
                <div className="forms-card">
                    <div style={{marginBottom: "1.5rem"}}>
                        <h2 style={{margin: 0, color: 'var(--PrimaryColorsTheme)'}}>Convidar Novo Membro</h2>
                        <p className="text75" style={{margin: '0.5rem 0 0 0', fontSize: '14px'}}>Adicione um profissional habilitado à sua clínica.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="email">Email *</label>
                            <input
                                id="email"
                                type="email"
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="role">Perfil *</label>
                            <select id="role">
                                <option value="2">Especialista</option>
                                <option value="3">Recepção / Atendimento</option>
                            </select>
                        </div>
                        <div style={{display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem"}}>
                            <button type="button" className="submit" style={{background: 'var(--LineColor)', color: 'var(--TextColor)', boxShadow: 'none'}} onClick={() => setShowForm(false)}>
                                Cancelar
                            </button>
                            <button type="submit" className="submit">
                                Enviar Convite
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <main className="mainBar owner register">
                <p>
                    <Link className="text75" to={`/owner/view-clinic/${id}`}>← Voltar para {clinic.name}</Link>
                </p>
                <div className="camp-clinic camp-register">
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2em"}}>
                        <div>
                            <h1 style={{margin: '0 0 0.5rem 0'}}>Colaboradores e Convites</h1>
                            <p className="text75">Gerencie os acessos e convites da clínica {clinic.name}.</p>
                        </div>
                        <div>
                            <button className="submit" onClick={() => setShowForm(true)} style={{padding: '12px 24px', fontSize: '15px'}}>
                                + Vincular Membro
                            </button>
                        </div>
                    </div>
                    <div>
                        {
                            Vincula.length === 0 ? (
                                <div style={{textAlign: "center", padding: '3rem 1rem'}}>
                                    <p style={{fontWeight: 700, fontSize: '16px'}}>Nenhum convite enviado</p>
                                    <label className="text75" style={{display: 'block', marginTop: '0.5rem'}}>Não há colaboradores vinculados ou convites ativos para esta clínica. Envie um para começar!</label>
                                </div>
                            ) : (
                                <div className="table">
                                    <div className="table-header" style={{gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr'}}>
                                        <p className="text75">Nome / Email</p>
                                        <p className="text75">Documento / ID</p>
                                        <p className="text75">Cargo</p>
                                        <p className="text75">Status</p>
                                        <p className="text75" style={{textAlign: 'right'}}>Ações</p>
                                    </div>

                                    <div className="table-body">
                                        {Vincula.map((invite) => (
                                        <div className="table-row" key={invite.id} style={{gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr'}}>
                                            <div>
                                                <p>{invite.name}</p>
                                                <span style={{fontSize: '12px', color: 'var(--TextColor75)'}}>{invite.email}</span>
                                            </div>
                                            <p>-</p>
                                            <p>{invite.role}</p>
                                            <p style={{color: 'var(--PrimaryColors)', fontWeight: 700}}>{invite.status}</p>
                                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                                <button style={{background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'}}>
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </main>
        </>
    );
}

/* STANDARD EXPORT */
export default RegisterClinic;
