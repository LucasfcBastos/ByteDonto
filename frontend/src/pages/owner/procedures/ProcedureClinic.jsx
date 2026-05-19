import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiGetClinics } from "../../../services/api";
import { useOwnerSidebar } from "../../../hooks/useSidebar";

import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import CampNotList from "../../../components/camp/NotList";
import CampList from "../../../components/camp/ListClinic";
import IMG from "../../../assets/img/icon01.png";

import "../../../styles/clinic.css";
import "../../../styles/Input.css";

function ProcedureClinic() {
    const { token } = useAuth();
    const [clinicas, setClinicas] = useState([]);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(true);

    const opc_bar = useOwnerSidebar("procedures");

    useEffect(() => {
        if (!token) return;

        apiGetClinics(token)
            .then((data) => setClinicas(data || []))
            .catch((err) => console.error("Erro ao carregar clínicas", err))
            .finally(() => setLoading(false));
    }, [token]);

    const clinicasFiltradas = clinicas.filter((c) =>
        c.name?.toLowerCase().includes(busca.toLowerCase()) ||
        c.cnpj?.includes(busca)
    );

    return (
        <>
            <Section type_styles="owner" />
            <SideBar opc={opc_bar} styles="owner" />

            <main className="mainBar owner">
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "28px",
                            color: "var(--PrimaryColorsTheme)",
                        }}
                    >
                        Procedimentos
                    </h1>
                    <p className="text75">
                        Selecione uma clínica para gerenciar seus procedimentos.
                    </p>
                </div>

                <div style={{ marginTop: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Buscar clínica por nome ou CNPJ..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        style={{
                            padding: "14px 16px",
                            borderRadius: "12px",
                            border: "1px solid var(--LineColor)",
                            width: "100%",
                            maxWidth: "400px",
                        }}
                    />
                </div>

                <div className="camp-clinic camp-list" style={{ marginTop: "1rem" }}>
                    <h2 style={{ margin: "0 0 1rem 0", fontSize: "20px" }}>
                        Clínicas
                    </h2>

                    {loading ? (
                        <p className="text75">Carregando clínicas...</p>
                    ) : clinicasFiltradas.length === 0 ? (
                        <CampNotList
                            img={IMG}
                            text_p="Nenhuma clínica encontrada"
                            text_l="Você ainda não possui clínicas vinculadas."
                        />
                    ) : (
                        clinicasFiltradas.map((item) => (
                            <CampList
                                key={item.id}
                                clinic_url={`/owner/procedures/${item.id}`}
                                clinic_id={item.id}
                                clinic_logo={item.logo}
                                clinic_img={IMG}
                                clinic_name={item.name}
                                clinic_cnpj={item.cnpj}
                                clinic_phone={item.whatsapp}
                            />
                        ))
                    )}
                </div>
            </main>
        </>
    );
}

export default ProcedureClinic;
