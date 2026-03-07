/* IMPORTS OF COMPONENTS */
import { useAuth } from "../../context/AuthContext";
import '../../styles/Section.css'

/* MAIN COMPONENT */
function SectionAuth({ type_styles }) {
    const { user, logout } = useAuth();

    return (
        <>
            <section className={`${type_styles}`}>
                <h1 id="logo">BYTE DONTO</h1>
                <div>
                    <button
                        onClick={logout}
                    >
                    <h1>{user?.perfil?.perfil || "name_user"}</h1>
                </button>
                </div>
            </section>
        </>
    );
}

/* STANDARD EXPORT */
export default SectionAuth;