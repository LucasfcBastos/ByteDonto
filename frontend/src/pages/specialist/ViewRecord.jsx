import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Section from "../../components/section/SectionAuth";
import SideBar from "../../components/bar/SideBar";
import IMG from "../../assets/img/icon01.png";

export default function SpecialistViewRecord() {
    const { token } = useAuth();
    const [searchParams] = useSearchParams();
    const pacienteId = searchParams.get("id");

    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("historico");

    const opc_bar = [
        { id: 1, icon: IMG, name: "Minha Agenda", url: "/specialist/dashboard", style: "" },
        { id: 2, icon: IMG, name: "Pacientes e Prontuários", url: "/specialist/patients", style: "select" },
    ];

    useEffect(() => {
        if (!pacienteId) {
            setLoading(false);
            return;
        }

        const fetchPaciente = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/pacientes/${pacienteId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPaciente(data);
                } else {
                    console.error("Falha ao buscar paciente");
                }
            } catch (error) {
                console.error("Erro", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaciente();
    }, [pacienteId, token]);

    const calcIdade = (dataString) => {
        if (!dataString) return "";
        const dataNascimento = new Date(dataString);
        const diffMS = Date.now() - dataNascimento.getTime();
        const ageDT = new Date(diffMS); 
        return Math.abs(ageDT.getUTCFullYear() - 1970);
    };

    if (loading) {
        return (
            <>
                <Section type_styles="specialist" />
                <SideBar opc={opc_bar} styles="specialist" />
                <main className="mainBar specialist"><p>Carregando prontuário...</p></main>
            </>
        );
    }

    if (!paciente) {
        return (
            <>
                <Section type_styles="specialist" />
                <SideBar opc={opc_bar} styles="specialist" />
                <main className="mainBar specialist"><p>Prontuário não encontrado. Retorne à listagem.</p></main>
            </>
        );
    }

    const anamnese = paciente.anamnese || {};

    return (
        <>
            <Section type_styles="specialist" />
            <SideBar opc={opc_bar} styles="specialist" />
            
            <main className="mainBar specialist">
                {/* CABEÇALHO CLÍNICO DO DENTISTA */}
                <div style={{background: 'var(--PrimaryColorsTheme)', borderRadius: '24px', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)'}}>
                    <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
                        <div style={{width: '90px', height: '90px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'}}>
                            {paciente.genero === "Feminino" ? "👩🏽" : "👨🏻"}
                        </div>
                        <div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <h1 style={{margin: '0', fontSize: '28px'}}>{paciente.nome}</h1>
                                <span style={{background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600}}>Tratamento</span>
                            </div>
                            <div style={{display: 'flex', gap: '2rem', marginTop: '1rem', fontFamily: 'var(--font-secondary)'}}>
                                <span><strong style={{opacity: 0.8}}>Convênio/Origem:</strong> Particular</span>
                                <span><strong style={{opacity: 0.8}}>Nascimento:</strong> {paciente.data_nascimento} ({calcIdade(paciente.data_nascimento)} anos)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTROLE DE ABAS DO DENTISTA */}
                <ul className="tabs-bar specialist" style={{marginBottom: '2rem'}}>
                    <li className={activeTab === "historico" ? "select" : ""} onClick={() => setActiveTab("historico")}>Evolução Prontuário</li>
                    <li className={activeTab === "anamnese" ? "select" : ""} onClick={() => setActiveTab("anamnese")}>Ficha Médica Base</li>
                    <li className={activeTab === "arquivos" ? "select" : ""} onClick={() => setActiveTab("arquivos")}>Imagens e Raio-X</li>
                </ul>

                {/* ABA 1: EVOLUÇÃO (Com botão de editar para o doutor) */}
                {activeTab === "historico" && (
                    <div className="forms-section" style={{animation: 'fadeIn 0.3s', padding: 0}}>
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', padding: '0 2rem'}}>
                            <button className="submit" style={{background: 'var(--PrimaryColorsTheme)', color: 'white', padding: '12px 24px', borderRadius: '12px'}}>+ Adicionar Registro Clínico Anterior</button>
                        </div>
                        
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', padding: '0 2rem 2rem 2rem'}}>
                            <div>
                                <h3 style={{color: 'var(--TextColor)', margin: '0 0 1.5rem 0'}}>Timeline de Tratamentos</h3>
                                <p style={{color: 'var(--TextColor75)'}}>Nenhum registro clínico foi feito pelo Especialista ainda.</p>
                            </div>

                            <div>
                                <h3 style={{color: 'var(--TextColor)', margin: '0 0 1.5rem 0'}}>Avisos Críticos</h3>
                                {anamnese.alergias ? (
                                    <div style={{background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', color: '#991B1B'}}>
                                        <strong>Alergia Medica:</strong>
                                        <p style={{margin: '4px 0 0 0', fontSize: '14px'}}>{anamnese.alergias}</p>
                                    </div>
                                ) : null}

                                {anamnese.condicoes ? (
                                    <div style={{background: '#FFFBEB', border: '1px solid #FCD34D', padding: '1rem', borderRadius: '12px', color: '#92400E'}}>
                                        <strong>Doença Sistêmica:</strong>
                                        <p style={{margin: '4px 0 0 0', fontSize: '14px'}}>{anamnese.condicoes}</p>
                                    </div>
                                ) : null}

                                {(!anamnese.alergias && !anamnese.condicoes) && (
                                    <p style={{fontSize: '13px', color: 'var(--TextColor75)'}}>Ficha verde. Nenhum alerta.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* ABA 2 e 3 simplificadas */}
                {activeTab === "anamnese" && (
                     <div className="forms-section" style={{animation: 'fadeIn 0.3s'}}>
                        <h3 style={{color: 'var(--PrimaryColorsTheme)', margin: '0 0 1.5rem 0'}}>Anamnese (Editável pelo Especialista)</h3>
                        <p className="text75" style={{marginBottom: '2rem'}}>Somente a equipe médica pode alterar esses campos fundamentais.</p>
                        
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
                            <div>
                                <p style={{fontWeight: 700, margin: '0 0 8px 0', color: 'var(--TextColor75)'}}>Condições Sistêmicas (Doenças)?</p>
                                <textarea style={{width: '100%', marginBottom: '24px'}} rows="2" defaultValue={anamnese.condicoes || ""}></textarea>

                                <p style={{fontWeight: 700, margin: '0 0 8px 0', color: 'var(--TextColor75)'}}>Medicações em Uso Contínuo?</p>
                                <textarea style={{width: '100%', marginBottom: '24px'}} rows="2" defaultValue={anamnese.medicacoes || ""}></textarea>
                            </div>
                            <div>
                                <p style={{fontWeight: 700, margin: '0 0 8px 0', color: 'var(--TextColor75)'}}>Alergias a Medicamentos/Outros?</p>
                                <textarea style={{width: '100%', marginBottom: '24px'}} rows="2" defaultValue={anamnese.alergias || ""}></textarea>

                                <p style={{fontWeight: 700, margin: '0 0 8px 0', color: 'var(--TextColor75)'}}>Cirurgias Prévias</p>
                                <textarea style={{width: '100%', marginBottom: '24px'}} rows="2" defaultValue={anamnese.cirurgias || ""}></textarea>
                            </div>
                        </div>

                        <button className="submit" style={{marginTop: '1rem'}}>Atualizar Ficha Médica</button>
                    </div>
                )}
                
                {activeTab === "arquivos" && (
                    <div className="forms-section" style={{animation: 'fadeIn 0.3s'}}>
                        <h3 style={{color: 'var(--PrimaryColorsTheme)', margin: '0 0 1.5rem 0'}}>Acervo de Imagens</h3>
                        <div style={{width: '200px', height: '200px', border: '2px dashed var(--LineColor)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--TextColor75)'}}>
                            + Upar Panorâmica
                        </div>
                    </div>
                )}

            </main>
        </>
    );
}
