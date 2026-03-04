/* IMPORTS */
import { useAuth } from "../../context/AuthContext";
import '../../styles/Auth.css';

/* PLACEHOLDER DASHBOARD */
function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: "2em", fontFamily: "Amiko-Regular" }}>
            <h1>Dashboard</h1>
            <p>Bem-vindo, {user?.perfil?.nome || user?.email}!</p>
            <p>Perfil: {user?.perfil?.perfil}</p>
            <button
                className="auth-submit"
                style={{ maxWidth: "200px", marginTop: "1em" }}
                onClick={logout}
            >
                <h1>Sair</h1>
            </button>
        </div>
    );
}

export default DashboardPage;
