/* IMPORTS */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Section from "../../components/section/SectionAuth";
import SideBar from "../../components/bar/SideBar";
import Card from "../../components/card/CardInfo";
import IMG from "../../assets/img/icon01.png";

/* MAIN COMPONENT */
function SpecialistDashboard() {
    const { token } = useAuth();
    const [pacientes, setPacientes] = useState([]);
    
    // Modal de Finalização do Atendimento
    const [showEncerrar, setShowEncerrar] = useState(false);
    const [activePatient, setActivePatient] = useState("");

    const opc_bar = [
        { id: 1, icon: IMG, name: "Minha Agenda", url: "/specialist/dashboard", style: "select" },
        { id: 2, icon: IMG, name: "Pacientes", url: "/specialist/patients", style: "" },
        { id: 3, icon: IMG, name: "Prontuários", url: "/specialist/records", style: "" }
    ];

    // Buscar lista de pacientes para simular pacientes agendados
    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/pacientes/", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPacientes(data);
                }
            } catch (error) {
                console.error("Erro no fetch", error);
            }
        };
        fetchPacientes();
    }, [token]);

    // Estado do Calendário Funcional
    const [selectedDate, setSelectedDate] = useState("14");
    const weekDays = [
        { day: "Seg", date: "12" },
        { day: "Ter", date: "13" },
        { day: "Qua", date: "14" },
        { day: "Qui", date: "15" },
        { day: "Sex", date: "16" },
        { day: "Sáb", date: "17" },
    ];

    return (
        <>
            <Section type_styles="specialist" />
            <SideBar opc={opc_bar} styles="specialist" />
            
            <main className="mainBar specialist" style={{position: 'relative'}}>
                
                {/* ---------- MODAL: ENCERRAR ATENDIMENTO ---------- */}
                {showEncerrar && (
                    <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{background: 'white', padding: '3rem', borderRadius: '32px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'fadeIn 0.2s', border: '1px solid rgba(226, 232, 240, 0.8)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem'}}>
                                <div>
                                    <span style={{background: 'rgba(37, 99, 235, 0.1)', color: 'var(--PrimaryColorsTheme)', padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, marginBottom: '12px', display: 'inline-block'}}>ENCERRAR CONSULTA</span>
                                    <h2 style={{color: 'var(--TextColor)', margin: 0, fontSize: '28px'}}>Resumo do Atendimento</h2>
                                    <p style={{color: 'var(--TextColor75)', margin: '8px 0 0 0'}}>Paciente: <strong style={{color: 'var(--PrimaryColorsTheme)'}}>{activePatient}</strong></p>
                                </div>
                                <button onClick={() => setShowEncerrar(false)} style={{background: 'var(--LineColor)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', color: 'var(--TextColor)', display:'flex', alignItems:'center', justifyContent: 'center', fontSize: '18px', transition: 'all 0.2s'}}>✕</button>
                            </div>

                            <div className="forms-section" style={{padding: 0}}>
                                <div className="field" style={{marginBottom: '1rem'}}>
                                    <label>Procedimentos Realizados Hoje *</label>
                                    <input type="text" placeholder="Ex: Avaliação de Rotina, Limpeza (Profilaxia)..." style={{width: '100%'}} />
                                </div>

                                <div className="field" style={{marginBottom: '1rem'}}>
                                    <label>Evolução Clínica (Anotações do Prontuário Central) *</label>
                                    <textarea rows="3" placeholder="Descreva tecnicamente o que foi feito na boca do paciente hoje, materiais usados e observações médicas..." style={{width: '100%'}}></textarea>
                                </div>

                                <div className="field" style={{marginBottom: '0'}}>
                                    <label>Status do Tratamento</label>
                                    <select style={{width: '100%'}}>
                                        <option>Tratamento em Andamento (Agendar Retorno)</option>
                                        <option>Alta Médica (Tratamento Finalizado)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--LineColor)', paddingTop: '2rem', marginTop: '2.5rem'}}>
                                <button onClick={() => setShowEncerrar(false)} className="submit" style={{padding: '16px 24px', background: 'var(--BackColor)', color: 'var(--TextColor)', boxShadow: 'none'}}>Continuar Atendendo</button>
                                <button className="submit" onClick={() => setShowEncerrar(false)} style={{padding: '16px 40px', background: 'var(--PrimaryColorsTheme)', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'}}>Salvar no Prontuário</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* ------------------------------------------------ */}

                <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem"}}>
                    <div>
                        <h1 style={{margin: '0 0 0.5rem 0', color: 'var(--PrimaryColorsTheme)', fontSize: '28px'}}>Painel do Especialista</h1>
                        <p className="text75">Bem-vindo(a) ao seu consultório virtual. Veja sua agenda e próximos pacientes.</p>
                    </div>
                </div>

                <div className="camp-clinic camp-view" style={{marginBottom: "2rem"}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem"}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <h2 style={{margin: 0}}>Resumo Semanal</h2>
                            <button style={{background: 'transparent', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--TextColor75)'}}>
                                🗓️ Abril 2026 ▾
                            </button>
                        </div>
                    </div>
                    
                    {/* CALENDAR STRIP FUNCIONAL */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
                        <button style={{border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', padding: '0.5rem', color: 'var(--TextColor75)', transition: 'all 0.2s', borderRadius: '50%'}}>❮</button>
                        <div className="calendar-strip" style={{marginBottom: 0, paddingBottom: '0.5rem', flex: 1, overflowX: 'hidden'}}>
                            {weekDays.map((d, index) => (
                                <div 
                                    key={index} 
                                    className={`calendar-day ${d.date === selectedDate ? 'active' : ''}`}
                                    onClick={() => setSelectedDate(d.date)}
                                >
                                    <p>{d.day}</p>
                                    <h3>{d.date}</h3>
                                </div>
                            ))}
                        </div>
                        <button style={{border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', padding: '0.5rem', color: 'var(--TextColor75)', transition: 'all 0.2s', borderRadius: '50%'}}>❯</button>
                    </div>

                    <div className="cards">
                        <Card title="Agendados Hoje" date={pacientes.length || "0"} />
                        <Card title="Avaliações" date="1" />
                        <div style={{background: 'var(--PrimaryColorsBack)', border: '1px solid var(--PrimaryColorsTheme)', borderRadius: '16px', padding: '1.5rem', flex: 1}}>
                            <p style={{margin: '0 0 4px 0', fontSize: '13px', color: 'var(--PrimaryColorsTheme)', fontWeight: 700}}>Faturamento Bruto Projetado (Mês)</p>
                            <h2 style={{margin: 0, fontSize: '28px', color: 'var(--PrimaryColorsTheme)'}}>R$ 0,00</h2>
                            <p style={{margin: '8px 0 0 0', fontSize: '12px', color: 'var(--TextColor75)'}}>Valor alimentado pela Recepção conforme procedimentos.</p>
                        </div>
                    </div>
                </div>

                <div className="camp-clinic" style={{padding: '2.5rem'}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem"}}>
                        <h2 style={{margin: 0}}>Agenda de Pacientes (Ao Vivo)</h2>
                        <span style={{background: 'rgba(37, 99, 235, 0.1)', color: 'var(--PrimaryColorsTheme)', padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700}}>Dia {selectedDate}/04</span>
                    </div>

                    {selectedDate === "14" ? (
                        <div className="table">
                            <div className="table-header" style={{gridTemplateColumns: '1fr 2fr 1.5fr 1fr 1fr'}}>
                                <p className="text75">Horário</p>
                                <p className="text75">Paciente</p>
                                <p className="text75">Procedimento</p>
                                <p className="text75">Status</p>
                                <p className="text75" style={{textAlign: 'right'}}>Ação</p>
                            </div>
                            <div className="table-body">
                                {pacientes.length === 0 ? (
                                    <div style={{padding: '2rem', textAlign: 'center', color: 'var(--TextColor75)'}}>Nenhum paciente designado na agenda ainda.</div>
                                ) : (
                                    pacientes.map((p, idx) => (
                                        <div key={p.id} className="table-row" style={{gridTemplateColumns: '1fr 2fr 1.5fr 1fr 1fr', borderBottom: idx === pacientes.length - 1 ? 'none' : '1px solid var(--LineColor)'}}>
                                            <p style={{fontFamily: 'var(--font-secondary)', fontWeight: 600, fontSize: '16px'}}>{14 + idx}:00</p>
                                            <div><p style={{fontWeight: 700}}>{p.nome}</p><span style={{fontSize: '12px', color:'var(--TextColor75)'}}>{p.cpf || "Avaliação"}</span></div>
                                            <p>Acompanhamento Clínico</p>
                                            <p style={{color: 'var(--PrimaryColorsTheme)', fontWeight: 700}}>Recepção Liberou</p>
                                            <div style={{textAlign: 'right'}}>
                                                <button onClick={() => {setActivePatient(p.nome); setShowEncerrar(true);}} className="submit" style={{padding: '6px 16px', fontSize: '13px', borderRadius: '8px'}}>Encerrar</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{textAlign: 'center', padding: '4rem', color: 'var(--TextColor75)'}}>
                            <p style={{fontSize: '48px', margin: '0 0 1rem 0'}}>📅</p>
                            <h3>Nenhum atendimento para o dia {selectedDate}.</h3>
                            <p>Aproveite o dia livre ou solicite que a recepção encaixe novos pacientes.</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default SpecialistDashboard;
