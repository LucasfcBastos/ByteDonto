/* IMPORTS */
import { useState } from "react";
import { Link } from "react-router-dom";
import Section from "../../components/section/SectionAuth";
import SideBar from "../../components/bar/SideBar";
import Card from "../../components/card/CardInfo";
import IMG from "../../assets/img/icon01.png";

/* MAIN COMPONENT */
function ReceptionDashboard() {

    // Controles de Modal de Agendamento
    const [showAgendamento, setShowAgendamento] = useState(false);

    // Sistema de Auto-Suggest (Busca de Pacientes Inteligente)
    const mockPatients = [
        { id: 1, name: "Maria Fernanda da Silva", doc: "123.456.789-00" },
        { id: 2, name: "Carlos Drumond", doc: "098.765.432-11" },
        { id: 3, name: "Júlia Almeida", doc: "111.222.333-44" },
        { id: 4, name: "Pedro Henrique", doc: "888.777.666-55" }
    ];
    
    const [searchName, setSearchName] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [quickSearch, setQuickSearch] = useState("");

    const filteredPatients = searchName.length > 1 && !selectedPatient 
        ? mockPatients.filter(p => p.name.toLowerCase().includes(searchName.toLowerCase()) || p.doc.includes(searchName)) 
        : [];
        
    const filteredQuick = quickSearch.length > 1 
        ? mockPatients.filter(p => p.name.toLowerCase().includes(quickSearch.toLowerCase()) || p.doc.includes(quickSearch))
        : [];

    // Menu da recepção
    const opc_bar = [
        { id: 1, icon: IMG, name: "Painel Principal", url: "/reception/dashboard", style: "select" },
        { id: 3, icon: IMG, name: "Pacientes", url: "/reception/patients", style: "" }
    ];

    return (
        <>
            <Section type_styles="reception" />
            <SideBar opc={opc_bar} styles="reception" />
            
            <main className="mainBar reception" style={{position: 'relative'}}>
                
                {/* ---------- MODAL PREMIUM DE AGENDAMENTO RÁPIDO ---------- */}
                {showAgendamento && (
                    <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{background: 'white', padding: '3rem', borderRadius: '32px', width: '100%', maxWidth: '750px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'fadeIn 0.2s', border: '1px solid rgba(226, 232, 240, 0.8)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem'}}>
                                <div>
                                    <span style={{background: 'var(--PrimaryColorsBack)', color: 'var(--PrimaryColorsTheme)', padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, marginBottom: '12px', display: 'inline-block'}}>NOVO EVENTO</span>
                                    <h2 style={{color: 'var(--TextColor)', margin: 0, fontSize: '32px'}}>Agendar Consulta</h2>
                                    <p style={{color: 'var(--TextColor75)', margin: '8px 0 0 0'}}>Selecione paciente, profissional e horário.</p>
                                </div>
                                <button onClick={() => setShowAgendamento(false)} style={{background: 'var(--LineColor)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', color: 'var(--TextColor)', display:'flex', alignItems:'center', justifyContent: 'center', fontSize: '18px', transition: 'all 0.2s'}}>✕</button>
                            </div>

                            {/* FORMULÁRIO PADRONIZADO RECEPTION */}
                            <div className="forms-section" style={{padding: 0}}>
                                <div className="field" style={{marginBottom: '1rem', position: 'relative'}}>
                                    <label>Buscar Paciente Cadastrado *</label>
                                    <input 
                                        type="text" 
                                        placeholder="🔍 Digite Nome, CPF ou Telefone..." 
                                        style={{width: '100%'}} 
                                        value={selectedPatient ? selectedPatient.name : searchName}
                                        onChange={(e) => {
                                            setSearchName(e.target.value);
                                            setSelectedPatient(null);
                                        }}
                                    />
                                    
                                    {/* DROPDOWN DE RESULTADOS (AUTOCOMPLETE) */}
                                    {filteredPatients.length > 0 && (
                                        <ul style={{position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: '1px solid var(--LineColor)', borderRadius: '12px', listStyle: 'none', padding: '0.5rem', margin: '4px 0 0 0', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 10, maxHeight: '200px', overflowY: 'auto'}}>
                                            {filteredPatients.map(p => (
                                                <li 
                                                    key={p.id} 
                                                    onClick={() => {
                                                        setSelectedPatient(p);
                                                        setSearchName("");
                                                    }}
                                                    style={{padding: '12px', borderRadius: '8px', cursor: 'pointer', borderBottom: '1px solid var(--LineColor)'}}
                                                >
                                                    <p style={{fontFamily: 'var(--font-primary)', fontWeight: 700, margin: 0, color: 'var(--PrimaryColorsTheme)'}}>{p.name}</p>
                                                    <span style={{fontFamily: 'var(--font-secondary)', fontSize: '12px', color: 'var(--TextColor75)'}}>CPF: {p.doc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <Link to="/reception/patient/register" style={{color: 'var(--PrimaryColorsTheme)', fontSize: '13px', textDecoration: 'underline', marginTop: '12px', display: 'inline-block', fontWeight: 'bold'}}>
                                        + Paciente não encontrado? (Cadastrar)
                                    </Link>
                                </div>
                                
                                <div className="flex-inpus">
                                    <div className="field">
                                        <label>Especialista Alocado *</label>
                                        <select style={{width: '100%'}}>
                                            <option value="">Selecione...</option>
                                            <option>Dr. Lucas (Clínico Geral)</option>
                                            <option>Dra. Ana (Ortodontia)</option>
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label>Tipo de Atendimento</label>
                                        <select style={{width: '100%'}}>
                                            <option value="">Selecione...</option>
                                            <option>Primeira Avaliação</option>
                                            <option>Retorno Mensal</option>
                                            <option>Procedimento/Cirurgia</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex-inpus">
                                    <div className="field">
                                        <label>Data Prevista *</label>
                                        <input type="date" style={{width: '100%'}} />
                                    </div>
                                    <div className="field">
                                        <label>Horário *</label>
                                        <input type="time" style={{width: '100%'}} />
                                    </div>
                                </div>

                                <div className="field" style={{marginBottom: '0'}}>
                                    <label>Motivo da Consulta (Breve)</label>
                                    <input type="text" placeholder="Ex: Avaliação de dor, manutenção do aparelho..." style={{width: '100%'}} />
                                </div>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--LineColor)', paddingTop: '2rem', marginTop: '2.5rem'}}>
                                <button onClick={() => setShowAgendamento(false)} className="submit" style={{padding: '16px 24px', background: 'var(--BackColor)', color: 'var(--TextColor)', boxShadow: 'none'}}>Cancelar</button>
                                <button className="submit" style={{padding: '16px 40px', background: 'var(--PrimaryColorsTheme)', boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)'}}>Confirmar na Agenda</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* ------------------------------------------------ */}

                <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem"}}>
                    <div>
                        <h1 style={{margin: '0 0 0.5rem 0', color: 'var(--PrimaryColorsTheme)', fontSize: '28px'}}>Atendimento & Recepção</h1>
                        <p className="text75">Gerencie os agendamentos e controle os pacientes na sala de espera.</p>
                    </div>
                    <div>
                        <button onClick={() => setShowAgendamento(true)} style={{background: 'var(--PrimaryColorsTheme)', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)', border: 'none', cursor: 'pointer'}}>
                            <span style={{fontSize:'20px'}}>+</span> Agendar Nova Consulta
                        </button>
                    </div>
                </div>

                {/* BUSCA RÁPIDA */}
                <div className="camp-clinic camp-register" style={{marginBottom: "2rem", padding: "1.5rem 2.5rem"}}>
                    <div style={{display:'flex', gap: '1rem', alignItems: 'flex-end'}}>
                        <div className="field" style={{flex: 1, margin: 0, position: 'relative'}}>
                            <label style={{color: 'var(--PrimaryColorsTheme)'}}>Busca Rápida de Paciente</label>
                            <input 
                                type="text" 
                                placeholder="Digite o nome, CPF ou Telefone do paciente..." 
                                style={{margin: 0, width: '100%', maxWidth: 'none'}} 
                                value={quickSearch}
                                onChange={(e) => setQuickSearch(e.target.value)}
                            />

                            {/* DROPDOWN DE RESULTADOS DA BUSCA RÁPIDA */}
                            {filteredQuick.length > 0 && (
                                <ul style={{position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: '1px solid var(--LineColor)', borderRadius: '12px', listStyle: 'none', padding: '0.5rem', margin: '4px 0 0 0', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 10}}>
                                    {filteredQuick.map(p => (
                                        <li 
                                            key={p.id} 
                                            onClick={() => setQuickSearch(p.name)}
                                            style={{padding: '12px', borderRadius: '8px', cursor: 'pointer', borderBottom: '1px solid var(--LineColor)'}}
                                        >
                                            <p style={{fontFamily: 'var(--font-primary)', fontWeight: 700, margin: 0, color: 'var(--PrimaryColorsTheme)'}}>{p.name}</p>
                                            <span style={{fontFamily: 'var(--font-secondary)', fontSize: '12px', color: 'var(--TextColor75)'}}>CPF: {p.doc}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Link to="/reception/patients" className="submit" style={{padding: '16px 32px', textAlign: 'center'}}>Acessar Ficha</Link>
                    </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem'}}>
                    {/* AGENDA GERAL */}
                    <div className="camp-clinic" style={{padding: '2.5rem'}}>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem"}}>
                            <h2 style={{margin: 0}}>Agenda Médica Geral</h2>
                            <button style={{background: 'transparent', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--TextColor75)'}}>
                                Hoje ▾
                            </button>
                        </div>

                        <div className="table">
                            <div className="table-header" style={{gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1.3fr'}}>
                                <p className="text75">Horário</p>
                                <p className="text75">Doutor(a)</p>
                                <p className="text75">Paciente</p>
                                <p className="text75">Status</p>
                                <p className="text75" style={{textAlign: 'right'}}>Ação</p>
                            </div>
                            <div className="table-body">
                                <div className="table-row" style={{gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1.3fr'}}>
                                    <p style={{fontFamily: 'var(--font-secondary)', fontWeight: 600, fontSize: '15px'}}>14:30</p>
                                    <p style={{fontWeight: 700}}>Dr. Lucas</p>
                                    <div><p style={{fontWeight: 500}}>Carlos Drumond</p></div>
                                    <p style={{color: '#EAB308', fontWeight: 700}}>Atrasado</p>
                                    <div style={{textAlign: 'right'}}><button className="submit" style={{padding: '6px 12px', fontSize: '12px', borderRadius: '8px'}}>Confirmar Chegada</button></div>
                                </div>
                                <div className="table-row" style={{gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1.3fr', borderBottom: 'none'}}>
                                    <p style={{fontFamily: 'var(--font-secondary)', fontWeight: 600, fontSize: '15px'}}>15:00</p>
                                    <p style={{fontWeight: 700}}>Dra. Ana</p>
                                    <div><p style={{fontWeight: 500}}>Júlia Almeida</p></div>
                                    <p style={{color: '#22C55E', fontWeight: 700}}>Em Andamento</p>
                                    <div style={{textAlign: 'right'}}><button className="submit" style={{padding: '6px 12px', fontSize: '12px', background: 'var(--LineColor)', color: 'var(--TextColor)', boxShadow:'none', borderRadius: '8px'}}>Ficha do Paciente</button></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PACIENTES NA SALA DE ESPERA */}
                    <div className="camp-clinic" style={{padding: '2.5rem', background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.03), rgba(255,255,255,1))', borderColor: 'rgba(22, 163, 74, 0.2)'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                            <h2 style={{margin: '0', color: 'var(--PrimaryColorsTheme)'}}>Sala de Espera</h2>
                            <span style={{background: 'var(--PrimaryColorsTheme)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px'}}>2</span>
                        </div>
                        
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <div style={{background: 'white', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    <div>
                                        <p style={{fontFamily: 'var(--font-primary)', fontWeight: 700, margin: 0, color: 'var(--TextColor)'}}>Pedro Henrique</p>
                                        <p style={{fontSize: '13px', color: 'var(--TextColor75)', margin: '4px 0 0 0'}}>Aguardando Dr. Lucas</p>
                                    </div>
                                    <span style={{fontFamily: 'var(--font-secondary)', fontSize: '12px', fontWeight: 700, color: '#EAB308', background: 'rgba(234, 179, 8, 0.1)', padding: '4px 8px', borderRadius: '8px'}}>15 min</span>
                                </div>
                            </div>
                            
                            <div style={{background: 'white', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    <div>
                                        <p style={{fontFamily: 'var(--font-primary)', fontWeight: 700, margin: 0, color: 'var(--TextColor)'}}>Maria Fernanda</p>
                                        <p style={{fontSize: '13px', color: 'var(--TextColor75)', margin: '4px 0 0 0'}}>Aguardando Triagem</p>
                                    </div>
                                    <span style={{fontFamily: 'var(--font-secondary)', fontSize: '12px', fontWeight: 700, color: 'var(--PrimaryColorsTheme)', background: 'rgba(22, 163, 74, 0.1)', padding: '4px 8px', borderRadius: '8px'}}>0 min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
}

export default ReceptionDashboard;
