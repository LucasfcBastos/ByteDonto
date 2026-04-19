/* IMPORTS OF COMPONENTS */
import { useAuth } from "../../context/AuthContext";
import '../../styles/Section.css'

/* MAIN COMPONENT */
function SectionAuth({ type_styles }) {
    const { user, logout } = useAuth();
    
    return (
        <section className={`premium-topbar ${type_styles}`}>
            <h1 id="logo">BYTE DONTO</h1>
            <div className="topbar-actions">
                <div className="user-profile">
                    <span className="user-name">{user?.perfil?.perfil || "Usuário"}</span>
                    <span className="user-role owner-badge">PROPRIETÁRIO</span>
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