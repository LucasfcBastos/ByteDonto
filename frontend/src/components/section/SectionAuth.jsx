/* IMPORTS OF COMPONENTS */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiGetSolicitacoes } from "../../services/api";
import InviteNotification from "./InviteNotification";

import Img from "../../assets/svg/bell.svg?react";

import '../../styles/Section.css';
import '../../styles/Buttons.css';

/* MAIN COMPONENT */
function SectionAuth({ type_styles }) {

    const { user, token, logout } = useAuth();

    const ROLE_LABEL = {
        "Owner":      "PROPRIETÁRIO",
        "Employee":   "FUNCIONÁRIO",
        "Specialist": "ESPECIALISTA",
    };
    const roleLabel = ROLE_LABEL[user?.perfil?.roles] || user?.perfil?.roles || "USUÁRIO";

    const [solicitacoes, setSolicitacoes] = useState([]);
    const [showNotificacoes, setShowNotificacoes] = useState(false);

    const carregarSolicitacoes = useCallback(async () => {
        if (!token) return;
        try {
            const data = await apiGetSolicitacoes(token);
            setSolicitacoes(data);
        } catch {
            setSolicitacoes([]);
        }
    }, [token]);

    useEffect(() => {
        carregarSolicitacoes();
    }, [carregarSolicitacoes]);

    return (
        <section className={`premium-topbar ${type_styles}`} style={{ position: "relative" }}>

            <h1 id="logo">
                BYTE DONTO
            </h1>

            <div className="topbar-actions">

                <div style={{ position: "relative" }}>
                    <button
                        className="notification-btn"
                        onClick={() => setShowNotificacoes(prev => !prev)}
                    >
                        <Img className="icon-notification" />
                    </button>

                    {solicitacoes.length > 0 && (
                        <span
                            style={{
                                position: "absolute",
                                top: "2px",
                                right: "2px",
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "#EF4444",
                                color: "white",
                                fontSize: "10px",
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                            }}
                        >
                            {solicitacoes.length}
                        </span>
                    )}

                    {showNotificacoes && (
                        <InviteNotification
                            solicitacoes={solicitacoes}
                            onClose={() => setShowNotificacoes(false)}
                            onUpdated={() => {
                                carregarSolicitacoes();
                                setShowNotificacoes(false);
                            }}
                        />
                    )}
                </div>

                <div className="user-profile">

                    <span className="user-name">{user?.perfil?.name || "Usuário"}</span>
                    <span className="user-role owner-badge">{roleLabel}</span>

                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                    title="Desconectar da conta"
                >
                    Sair
                </button>

            </div>

        </section>
    );
}

/* STANDARD EXPORT */
export default SectionAuth;
