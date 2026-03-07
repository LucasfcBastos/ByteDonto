/* IMPORTS */
import { useAuth } from "../../context/AuthContext";
import Section from "../../components/section/SectionAuth"
import Footer from "../../components/footer/FooterAuth"
import '../../styles/clinic.css';

/* PLACEHOLDER DASHBOARD */
function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <>
            <Section type_styles="owner" />
            <main className="owner">
                <div>
                    <h1>Minhas Clínicas</h1>
                    <p className="text75">Gerencie as clínicas que você têm</p>
                </div>
                <div>
                    <input />
                </div>
                <div className="camp-list">
                    <p>swdjksdj</p>
                </div>
            </main>
            <Footer type_styles="owner" text={`Gestão
                Eficiência
                Resultados
                Crescimento`} />
        </>
    );
}

export default DashboardPage;
