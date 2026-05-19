import { useState } from "react";
import { apiAceitarSolicitacao, apiRecusarSolicitacao } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function InviteNotification({ solicitacoes, onClose, onUpdated }) {

    const { token, refreshUser } = useAuth();
    const [processandoId, setProcessandoId] = useState(null);
    const [erro, setErro] = useState(null);

    async function handleAceitar(teamId) {
        setProcessandoId(teamId);
        setErro(null);
        try {
            await apiAceitarSolicitacao(token, teamId);
            await refreshUser();
            onUpdated();
        } catch (e) {
            setErro(e.message);
        } finally {
            setProcessandoId(null);
        }
    }

    async function handleRecusar(teamId) {
        setProcessandoId(teamId);
        setErro(null);
        try {
            await apiRecusarSolicitacao(token, teamId);
            onUpdated();
        } catch (e) {
            setErro(e.message);
        } finally {
            setProcessandoId(null);
        }
    }

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    zIndex: 49,
                }}
                onClick={onClose}
            />

            <div
                style={{
                    position: "absolute",
                    top: "4.5rem",
                    right: "3rem",
                    width: "320px",
                    background: "white",
                    border: "1px solid var(--LineColor)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    zIndex: 100,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        padding: "1rem 1.25rem",
                        borderBottom: "1px solid var(--LineColor)",
                    }}
                >
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "14px" }}>
                        Convites Pendentes
                    </p>
                </div>

                {erro && (
                    <div
                        style={{
                            background: "rgba(239,68,68,0.1)",
                            color: "#EF4444",
                            padding: "8px 1.25rem",
                            fontSize: "13px",
                        }}
                    >
                        {erro}
                    </div>
                )}

                {solicitacoes.length === 0 ? (
                    <div
                        style={{
                            padding: "1.5rem 1.25rem",
                            textAlign: "center",
                            color: "var(--TextColor75)",
                            fontSize: "13px",
                        }}
                    >
                        Nenhum convite pendente.
                    </div>
                ) : (
                    solicitacoes.map((s) => (
                        <div
                            key={s.team_id}
                            style={{
                                padding: "0.875rem 1.25rem",
                                borderBottom: "1px solid var(--LineColor)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "0.75rem",
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    flex: 1,
                                    wordBreak: "break-word",
                                }}
                            >
                                {s.clinic_name}
                            </p>

                            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                                <button
                                    onClick={() => handleAceitar(s.team_id)}
                                    disabled={processandoId === s.team_id}
                                    style={{
                                        padding: "5px 12px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "rgba(34,197,94,0.12)",
                                        color: "#16A34A",
                                        fontWeight: 700,
                                        fontSize: "12px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Aceitar
                                </button>

                                <button
                                    onClick={() => handleRecusar(s.team_id)}
                                    disabled={processandoId === s.team_id}
                                    style={{
                                        padding: "5px 12px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "rgba(239,68,68,0.1)",
                                        color: "#EF4444",
                                        fontWeight: 700,
                                        fontSize: "12px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Recusar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default InviteNotification;
