import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
    apiGetProcedimentos,
    apiGetClinic,
    apiAlterarStatusProcedimento,
    apiDeletarProcedimento,
} from "../../../services/api";
import { formatCurrency } from "../../../utils/formatters";
import Section from "../../../components/section/SectionAuth";
import SideBar from "../../../components/bar/SideBar";
import AlertConfirmAction from "../../../components/alerts/AlertConfirmAction";
import AlertError from "../../../components/alerts/AlertError";
import { useOwnerSidebar } from "../../../hooks/useSidebar";
import "../../../styles/clinic.css";
import "../../../styles/Table.css";

function ListProcedures() {
    const { token } = useAuth();
    const { id_clinic } = useParams();

    const [procedimentos, setProcedimentos] = useState([]);
    const [clinica, setClinica] = useState(null);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [atualizandoId, setAtualizandoId] = useState(null);
    const [confirmStatus, setConfirmStatus] = useState(null);
    const [confirmDeletar, setConfirmDeletar] = useState(null);
    const [erroAlert, setErroAlert] = useState(null);

    const opc_bar = useOwnerSidebar("procedures");

    const carregarProcedimentos = useCallback(async () => {
        if (!token || !id_clinic) return;
        setLoading(true);
        setErro(null);
        try {
            const data = await apiGetProcedimentos(token, id_clinic);
            setProcedimentos(data);
        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, id_clinic]);

    useEffect(() => {
        carregarProcedimentos();
    }, [carregarProcedimentos]);

    useEffect(() => {
        if (!token || !id_clinic) return;
        apiGetClinic(token, id_clinic)
            .then(setClinica)
            .catch((err) => console.error("Erro ao carregar clínica", err));
    }, [token, id_clinic]);

    function handleAlterarStatus(procedimento) {
        setConfirmStatus(procedimento);
    }

    async function handleAlterarStatusConfirmado() {
        const procedimento = confirmStatus;
        const novoStatus = procedimento.status === "Ativo" ? "Inativo" : "Ativo";
        setConfirmStatus(null);
        setAtualizandoId(procedimento.id);
        try {
            await apiAlterarStatusProcedimento(token, procedimento.id, novoStatus);
            await carregarProcedimentos();
        } catch (err) {
            setErroAlert(err.message);
        } finally {
            setAtualizandoId(null);
        }
    }

    function handleDeletar(procedimento) {
        setConfirmDeletar(procedimento);
    }

    async function handleDeletarConfirmado() {
        const procedimento = confirmDeletar;
        setConfirmDeletar(null);
        setAtualizandoId(procedimento.id);
        try {
            await apiDeletarProcedimento(token, procedimento.id);
            await carregarProcedimentos();
        } catch (err) {
            setErroAlert(err.message);
        } finally {
            setAtualizandoId(null);
        }
    }

    const filtrados = procedimentos.filter((p) =>
        p.name?.toLowerCase().includes(busca.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(busca.toLowerCase()))
    );

    const totalAtivos = procedimentos.filter((p) => p.status === "Ativo").length;
    const totalInativos = procedimentos.filter((p) => p.status !== "Ativo").length;

    return (
        <>
            <Section type_styles="owner" />
            <SideBar opc={opc_bar} styles="owner" />

            {confirmStatus && (
                <AlertConfirmAction
                    styles="owner"
                    title={confirmStatus.status === "Ativo" ? "Inativar Procedimento" : "Reativar Procedimento"}
                    text={`Deseja ${confirmStatus.status === "Ativo" ? "inativar" : "reativar"} o procedimento "${confirmStatus.name}"?`}
                    confirmText={confirmStatus.status === "Ativo" ? "Inativar" : "Reativar"}
                    cancelText="Cancelar"
                    onConfirm={handleAlterarStatusConfirmado}
                    onCancel={() => setConfirmStatus(null)}
                />
            )}

            {confirmDeletar && (
                <AlertConfirmAction
                    styles="owner"
                    title="Excluir Procedimento"
                    text={`Deseja remover permanentemente o procedimento "${confirmDeletar.name}"? Esta ação não pode ser desfeita.`}
                    confirmText="Excluir"
                    cancelText="Cancelar"
                    onConfirm={handleDeletarConfirmado}
                    onCancel={() => setConfirmDeletar(null)}
                />
            )}

            {erroAlert && (
                <AlertError
                    styles="owner"
                    text={erroAlert}
                    onClose={() => setErroAlert(null)}
                />
            )}

            <main className="mainBar owner register">

                {/* MÉTRICAS */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                    }}
                >
                    {[
                        { emoji: "🦷", valor: procedimentos.length, label: "Total de Procedimentos" },
                        { emoji: "✅", valor: totalAtivos, label: "Procedimentos Ativos" },
                        { emoji: "⏸️", valor: totalInativos, label: "Procedimentos Inativos" },
                    ].map((m) => (
                        <div
                            key={m.label}
                            style={{
                                background: "white",
                                borderRadius: "16px",
                                border: "1px solid var(--LineColor)",
                                padding: "1.5rem",
                            }}
                        >
                            <span style={{ fontSize: "28px", display: "block", marginBottom: "0.75rem" }}>
                                {m.emoji}
                            </span>
                            <p style={{ margin: 0, fontSize: "28px", fontWeight: 800 }}>
                                {m.valor}
                            </p>
                            <p className="text75" style={{ marginTop: "0.5rem", fontSize: "13px" }}>
                                {m.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CARD PRINCIPAL */}
                <div className="camp-clinic camp-register">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "2rem",
                        }}
                    >
                        <div>
                            <h1 style={{ margin: "0 0 0.5rem 0" }}>Procedimentos</h1>
                            <p className="text75">
                                Gerencie os procedimentos da clínica {clinica?.name}
                            </p>
                        </div>

                        <Link
                            to={`/owner/procedures/${id_clinic}/register`}
                            className="submit"
                        >
                            + Novo Procedimento
                        </Link>
                    </div>

                    {/* BUSCA */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou descrição..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            style={{ width: "100%", maxWidth: "400px" }}
                        />
                    </div>

                    {loading ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>
                            Carregando procedimentos...
                        </div>
                    ) : erro ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "#EF4444" }}>
                            {erro}
                        </div>
                    ) : filtrados.length === 0 ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--TextColor75)" }}>
                            {busca
                                ? "Nenhum procedimento encontrado para esta busca."
                                : "Nenhum procedimento cadastrado. Crie o primeiro!"}
                        </div>
                    ) : (
                        <div className="table">
                            <div
                                className="table-header"
                                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}
                            >
                                <p className="text75">Nome</p>
                                <p className="text75">Valor</p>
                                <p className="text75">Tempo Médio</p>
                                <p className="text75">Status</p>
                                <p className="text75" style={{ textAlign: "right" }}>
                                    Ações
                                </p>
                            </div>

                            <div className="table-body">
                                {filtrados.map((p, idx) => (
                                    <div
                                        key={p.id}
                                        className="table-row"
                                        style={{
                                            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                                            borderBottom:
                                                idx === filtrados.length - 1
                                                    ? "none"
                                                    : "1px solid var(--LineColor)",
                                        }}
                                    >
                                        <div>
                                            <p style={{ fontWeight: 700 }}>{p.name}</p>
                                            {p.description && (
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "var(--TextColor75)",
                                                    }}
                                                >
                                                    {p.description}
                                                </span>
                                            )}
                                        </div>

                                        <p>{formatCurrency(p.standard_value)}</p>

                                        <p>{p.average_time || "—"}</p>

                                        <div>
                                            <span
                                                style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "20px",
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    background:
                                                        p.status === "Ativo"
                                                            ? "rgba(34,197,94,0.12)"
                                                            : "rgba(239,68,68,0.1)",
                                                    color:
                                                        p.status === "Ativo"
                                                            ? "#22C55E"
                                                            : "#EF4444",
                                                }}
                                            >
                                                {p.status || "Ativo"}
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                textAlign: "right",
                                                display: "flex",
                                                gap: "0.5rem",
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            <Link
                                                to={`/owner/procedures/${id_clinic}/edit/${p.id}`}
                                                className="submit"
                                                style={{
                                                    padding: "6px 14px",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                Editar
                                            </Link>

                                            <button
                                                onClick={() => handleAlterarStatus(p)}
                                                disabled={atualizandoId === p.id}
                                                className="submit"
                                                style={{
                                                    padding: "6px 14px",
                                                    fontSize: "12px",
                                                    background:
                                                        p.status === "Ativo"
                                                            ? "rgba(251,191,36,0.15)"
                                                            : "rgba(34,197,94,0.12)",
                                                    color:
                                                        p.status === "Ativo"
                                                            ? "#D97706"
                                                            : "#22C55E",
                                                    boxShadow: "none",
                                                }}
                                            >
                                                {atualizandoId === p.id
                                                    ? "..."
                                                    : p.status === "Ativo"
                                                    ? "Inativar"
                                                    : "Reativar"}
                                            </button>

                                            <button
                                                onClick={() => handleDeletar(p)}
                                                disabled={atualizandoId === p.id}
                                                className="submit"
                                                style={{
                                                    padding: "6px 14px",
                                                    fontSize: "12px",
                                                    background: "rgba(239,68,68,0.1)",
                                                    color: "#EF4444",
                                                    boxShadow: "none",
                                                }}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default ListProcedures;
