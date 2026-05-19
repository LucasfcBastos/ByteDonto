import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import {
    apiGetEquipe,
    apiCriarMembro,
    apiRemoverMembro,
    apiGetClinic,
    apiGetMetricas,
} from "../../../services/api";

import { useOwnerSidebar } from "../../../hooks/useSidebar";

import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";

import "../../../styles/clinic.css";
import "../../../styles/Forms.css";
import "../../../styles/Table.css";

const PAPEIS = ["Specialist", "Employee"];

const METRICAS_CONFIG = [
    {
        key: "total_especialistas",
        label: "Nº Total de Especialistas",
        emoji: "🦷",
    },
    {
        key: "total_funcionarios",
        label: "Nº Total de Funcionários",
        emoji: "👨",
    },
    {
        key: "total_membros",
        label: "Nº Total de Membros",
        emoji: "👥",
    },
];

const PAPEL_LABEL = {
    Owner: {
        label: "Proprietário",
    },

    Specialist: {
        label: "Especialista",
    },

    Employee: {
        label: "Recepção",
    },
};

const FORM_INICIAL = {
    email: "",
    papel: "Specialist",
};

function MetricasSkeleton() {

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
            }}
        >

            {[1, 2, 3].map(item => (

                <div
                    key={item}
                    style={{
                        background: "white",
                        borderRadius: "16px",
                        border: "1px solid var(--LineColor)",
                        padding: "1.5rem",
                    }}
                >

                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            background: "var(--LineColor)",
                            marginBottom: "1rem",
                        }}
                    />

                    <div
                        style={{
                            width: "80px",
                            height: "28px",
                            borderRadius: "6px",
                            background: "var(--LineColor)",
                            marginBottom: "0.75rem",
                        }}
                    />

                    <div
                        style={{
                            width: "160px",
                            height: "14px",
                            borderRadius: "6px",
                            background: "var(--LineColor)",
                        }}
                    />

                </div>

            ))}

        </div>

    );

}

function ListTeam() {

    const { token, refreshUser } = useAuth();
    const { id_clinic } = useParams();

    const opc_bar = useOwnerSidebar("team");

    const [equipe, setEquipe] = useState([]);
    const [clinica, setClinica] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const [metricas, setMetricas] = useState(null);
    const [loadingMetricas, setLoadingMetricas] = useState(true);

    // Modal criar
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState(FORM_INICIAL);

    const [enviando, setEnviando] = useState(false);

    const [formErro, setFormErro] = useState(null);

    const [formSucesso, setFormSucesso] = useState(null);

    // Remover
    const [removendoId, setRemovendoId] = useState(null);

    // =========================================================
    // CARREGAR EQUIPE
    // =========================================================

    const carregarEquipe = useCallback(async () => {

        if (!token || !id_clinic) return;

        setCarregando(true);
        setErro(null);

        try {

            const data = await apiGetEquipe(
                token,
                id_clinic
            );

            await refreshUser();

            setEquipe(data);

        } catch (e) {

            setErro(e.message);

        } finally {

            setCarregando(false);

        }

    }, [token, id_clinic]);

    useEffect(() => {

        carregarEquipe();

    }, [carregarEquipe]);

    // =========================================================
    // CARREGAR CLÍNICA
    // =========================================================

    useEffect(() => {

        async function carregarClinica() {

            try {

                const data = await apiGetClinic(
                    token,
                    id_clinic
                );

                await refreshUser();

                setClinica(data);

            } catch (err) {

                console.error(
                    "Erro ao carregar clínica",
                    err
                );

            }

        }

        if (token && id_clinic) {

            carregarClinica();

        }

    }, [token, id_clinic]);

    // =========================================================
    // MÉTRICAS
    // =========================================================

    const carregarMetricas = useCallback(async () => {

        if (!token || !id_clinic) return;

        try {

            setLoadingMetricas(true);

            const data = await apiGetMetricas(
                token,
                id_clinic
            );

            setMetricas(data);

        } catch (err) {

            console.error(
                "Erro ao carregar métricas",
                err
            );

        } finally {

            setLoadingMetricas(false);

        }

    }, [token, id_clinic]);

    useEffect(() => {

        carregarMetricas();

    }, [carregarMetricas]);

    // =========================================================
    // MODAL
    // =========================================================

    useEffect(() => {

        document.body.style.overflow = showForm
            ? "hidden"
            : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };

    }, [showForm]);

    // =========================================================
    // ABRIR FORM
    // =========================================================

    function abrirForm() {

        setForm(FORM_INICIAL);

        setFormErro(null);

        setFormSucesso(null);

        setShowForm(true);

    }

    // =========================================================
    // CRIAR MEMBRO
    // =========================================================

    async function handleCriar(e) {

            e.preventDefault();

            setEnviando(true);

            setFormErro(null);

            setFormSucesso(null);

            try {

                const novo = await apiCriarMembro(
                    token,
                    id_clinic,
                    form
                );

                // RECARREGA A EQUIPE
                await carregarEquipe();

                await carregarMetricas();

                await refreshUser();

                setFormSucesso(
                    `Membro adicionado com sucesso!`
                );

                setTimeout(() => {

                    setShowForm(false);

                    setFormSucesso(null);

                }, 1500);

            } catch (e) {

                setFormErro(e.message);

            } finally {

                setEnviando(false);

            }

        }

        // =========================================================
        // REMOVER MEMBRO
        // =========================================================

        async function handleRemover(user_id) {
        const confirmar = window.confirm(
            "Deseja remover este membro da clínica?"
        );

        if (!confirmar) return;

        setRemovendoId(user_id);

        try {
            await apiRemoverMembro(
                token,
                id_clinic,
                user_id
            );

            setEquipe(prev =>
                prev.filter(m => m.team_id !== user_id)
            );

            await carregarEquipe();

            await carregarMetricas();

            await refreshUser();

        } catch (e) {
            alert(e.message);
        } finally {
            setRemovendoId(null);
        }
    }

    const membrosNaoDono = equipe;

    const dono = null;

    return (
        <>
            <Section type_styles="owner" />

            <SideBar
                opc={opc_bar}
                styles="owner"
            />

            {/* ========================================================= */}
            {/* MODAL CRIAR */}
            {/* ========================================================= */}

            {showForm && (
                <div
                    className="forms-hover owner"
                    style={{ display: "flex" }}
                >
                    <div className="forms-card">

                        <div style={{ marginBottom: "1.5rem" }}>

                            <h2
                                style={{
                                    margin: 0,
                                    color: "var(--PrimaryColorsTheme)"
                                }}
                            >
                                Vincular Membro
                            </h2>

                            <p
                                className="text75"
                                style={{
                                    margin: "0.5rem 0 0 0",
                                    fontSize: "14px"
                                }}
                            >
                                Vincule um usuário já cadastrado ao sistema.
                            </p>

                        </div>

                        {formSucesso ? (

                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "2rem 0"
                                }}
                            >
                                <p style={{ fontSize: "2rem" }}>
                                    ✅
                                </p>

                                <p
                                    style={{
                                        fontWeight: 700,
                                        color: "#059669"
                                    }}
                                >
                                    {formSucesso}
                                </p>
                            </div>

                        ) : (

                            <form onSubmit={handleCriar}>

                                {formErro && (
                                    <div
                                        style={{
                                            background: "rgba(239,68,68,0.1)",
                                            color: "#EF4444",
                                            padding: "10px 14px",
                                            borderRadius: "8px",
                                            marginBottom: "1rem",
                                            fontSize: "14px"
                                        }}
                                    >
                                        {formErro}
                                    </div>
                                )}

                                <div className="field">

                                    <label htmlFor="email">
                                        E-mail *
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={e =>
                                            setForm(prev => ({
                                                ...prev,
                                                email: e.target.value
                                            }))
                                        }
                                    />

                                </div>

                                <div className="field">

                                    <label htmlFor="papel">
                                        Perfil *
                                    </label>

                                    <select
                                        id="papel"
                                        value={form.papel}
                                        onChange={e =>
                                            setForm(prev => ({
                                                ...prev,
                                                papel: e.target.value
                                            }))
                                        }
                                    >
                                        {PAPEIS.map(p => (
                                            <option
                                                key={p}
                                                value={p}
                                            >
                                                {p}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "1rem",
                                        marginTop: "2rem"
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="submit"
                                        style={{
                                            background: "var(--LineColor)",
                                            color: "var(--TextColor)",
                                            boxShadow: "none"
                                        }}
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="submit"
                                        disabled={enviando}
                                    >
                                        {enviando
                                            ? "Vinculando..."
                                            : "Vincular"}
                                    </button>

                                </div>

                            </form>

                        )}

                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MAIN */}
            {/* ========================================================= */}

            <main className="mainBar owner register">

                {/* MÉTRICAS */}

                {loadingMetricas ? (

                    <MetricasSkeleton />

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "1rem",
                            marginBottom: "1.5rem"
                        }}
                    >
                        {METRICAS_CONFIG.map((m) => {

                            const valor = metricas
                                ? metricas[m.key]
                                : null;

                            return (

                                <div
                                    key={m.key}
                                    style={{
                                        background: "white",
                                        borderRadius: "16px",
                                        border: "1px solid var(--LineColor)",
                                        padding: "1.5rem"
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "28px",
                                            display: "block",
                                            marginBottom: "0.75rem"
                                        }}
                                    >
                                        {m.emoji}
                                    </span>

                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "28px",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {valor ?? "—"}
                                    </p>

                                    <p
                                        className="text75"
                                        style={{
                                            marginTop: "0.5rem",
                                            fontSize: "13px"
                                        }}
                                    >
                                        {m.label}
                                    </p>

                                </div>

                            );

                        })}
                    </div>

                )}

                {/* CARD */}

                <div className="camp-clinic camp-register">

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "2em"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: "0 0 0.5rem 0"
                                }}
                            >
                                Colaboradores
                            </h1>

                            <p className="text75">
                                Gerencie os membros da clínica {clinica?.name}
                            </p>

                        </div>

                        <button
                            className="submit"
                            onClick={abrirForm}
                        >
                            + Adicionar Membro
                        </button>

                    </div>

                    {carregando ? (

                        <div
                            style={{
                                padding: "2rem",
                                textAlign: "center",
                                color: "var(--TextColor75)"
                            }}
                        >
                            Carregando equipe...
                        </div>

                    ) : erro ? (

                        <div
                            style={{
                                padding: "2rem",
                                textAlign: "center",
                                color: "#EF4444"
                            }}
                        >
                            {erro}
                        </div>

                    ) : membrosNaoDono.length === 0 ? (

                        <div
                            style={{
                                padding: "2rem",
                                textAlign: "center",
                                color: "var(--TextColor75)"
                            }}
                        >
                            Nenhum membro encontrado.
                        </div>

                    ) : (

                        <div
                            className="table"
                            style={{ marginTop: "2rem" }}
                        >

                            <div
                                className="table-header"
                                style={{
                                    gridTemplateColumns:
                                        "1.5fr 1fr 1fr 1fr"
                                }}
                            >
                                <p className="text75">
                                    Email
                                </p>

                                <p className="text75">
                                    Cargo
                                </p>

                                <p className="text75">
                                    Status
                                </p>

                                <p
                                    className="text75"
                                    style={{ textAlign: "right" }}
                                >
                                    Ação
                                </p>
                            </div>

                            <div className="table-body">

                                {membrosNaoDono.map((membro, idx) => {

                                    const cargoInfo =
                                        PAPEL_LABEL[membro.roles];

                                    return (

                                        <div
                                            key={membro.team_id}
                                            className="table-row"
                                            style={{
                                                gridTemplateColumns:
                                                    "1.5fr 1fr 1fr 1fr",

                                                borderBottom:
                                                    idx === membrosNaoDono.length - 1
                                                        ? "none"
                                                        : "1px solid var(--LineColor)"
                                            }}
                                        >

                                            {/* EMAIL */}

                                            <div>

                                                <p>
                                                    {membro.email}
                                                </p>

                                            </div>

                                            {/* CARGO */}

                                            <div>

                                                <p>
                                                    {cargoInfo?.label || "Sem cargo"}
                                                </p>

                                            </div>

                                            {/* STATUS */}

                                            <div>

                                                <p>
                                                    {membro.status === "active"
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </p>

                                            </div>

                                            {/* AÇÕES */}

                                            <div
                                                style={{
                                                    textAlign: "right"
                                                }}
                                            >

                                                <button
                                                    onClick={() =>
                                                        handleRemover(
                                                            membro.team_id
                                                        )
                                                    }

                                                    disabled={
                                                        removendoId === membro.team_id
                                                    }

                                                    className="submit"

                                                    style={{
                                                        padding:
                                                            "6px 16px",

                                                        fontSize:
                                                            "13px",

                                                        background:
                                                            "rgba(239,68,68,0.1)",

                                                        color:
                                                            "#EF4444",

                                                        boxShadow:
                                                            "none"
                                                    }}
                                                >
                                                    {removendoId === membro.team_id
                                                        ? "Removendo..."
                                                        : "Remover"}
                                                </button>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}

export default ListTeam;