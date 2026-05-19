/* API BASE URL — troca para a URL do Render quando fizer o deploy */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* --- AUTH --- */
export async function apiRegistro(nome, email, password, papel) {
    const res = await fetch(`${API_URL}/api/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password, papel }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar conta");
    return data;
}

export async function apiLogin(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao fazer login");
    return data;
}

export async function apiMe(token) {
    const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sessão expirada");
    return data;
}

/* --- PACIENTES --- */
export async function apiGetPacientes(token) {
    const res = await fetch(`${API_URL}/api/pacientes/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar pacientes");
    return data;
}

export async function apiGetPaciente(token, pacienteId) {
    const res = await fetch(`${API_URL}/api/pacientes/${pacienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar paciente");
    return data;
}

export async function apiCriarPaciente(token, pacienteData) {
    const res = await fetch(`${API_URL}/api/pacientes/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pacienteData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao cadastrar paciente");
    return data;
}

export async function apiAtualizarPaciente(token, pacienteId, pacienteData) {
    const res = await fetch(`${API_URL}/api/pacientes/${pacienteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pacienteData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao atualizar paciente");
    return data;
}

/* --- CONSULTAS --- */
export async function apiGetConsultas(token) {
    const res = await fetch(`${API_URL}/api/consultas/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar consultas");
    return data;
}

export async function apiCriarConsulta(token, consultaData) {
    const res = await fetch(`${API_URL}/api/consultas/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(consultaData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao agendar consulta");
    return data;
}

/* --- CLÍNICAS --- */
export async function apiGetClinics(token) {
    const res = await fetch(`${API_URL}/api/clinicas/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar clínicas");
    return data;
}

export async function apiCreateClinic(token, clinicData) {
    const res = await fetch(`${API_URL}/api/clinicas/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(clinicData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar clínica");
    return data;
}
export async function apiGetClinic(token, clinicaId) {
    const res = await fetch(`${API_URL}/api/clinicas/${clinicaId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar clínica");
    return data;
}

export async function apiDeleteClinic(token, clinicaId) {
    const res = await fetch(`${API_URL}/api/clinicas/${clinicaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao deletar clínica");
    return data;
}

export async function apiUpdateClinic(token, clinicaId, clinicData) {
    const res = await fetch(`${API_URL}/api/clinicas/${clinicaId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(clinicData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao atualizar clínica");
    return data;
}

/* --- EQUIPE / USUÁRIOS --- */
export async function apiGetEquipe(token, id_clinic) {
    const response = await fetch(
        `${API_URL}/api/usuarios/${id_clinic}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return data;
}

export async function apiCriarMembro(
    token,
    id_clinic,
    body
) {
    const response = await fetch(
        `${API_URL}/api/usuarios/${id_clinic}/criar`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return data;
}

export async function apiRemoverMembro(
    token,
    id_clinic,
    user_id
) {
    const response = await fetch(
        `${API_URL}/api/usuarios/${id_clinic}/${user_id}`,
        {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }
    return data;
}

/* --- FINANCEIRO --- */
export async function apiGetFinanceiro(token, status = null) {
    const url = status
        ? `${API_URL}/api/financeiro/?status_pagamento=${encodeURIComponent(status)}`
        : `${API_URL}/api/financeiro/`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar lançamentos financeiros");
    return data;
}

export async function apiCriarLancamento(token, lancamentoData) {
    const res = await fetch(`${API_URL}/api/financeiro/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lancamentoData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar lançamento");
    return data;
}

export async function apiAtualizarLancamento(token, id, lancamentoData) {
    const res = await fetch(`${API_URL}/api/financeiro/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lancamentoData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao atualizar lançamento");
    return data;
}

/* --- PLANOS DE TRATAMENTO --- */
export async function apiGetPlanos(token, pacienteId) {
    const res = await fetch(`${API_URL}/api/planos/?paciente_id=${pacienteId}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar planos");
    return data;
}

export async function apiCriarPlano(token, payload) {
    const res = await fetch(`${API_URL}/api/planos/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar plano");
    return data;
}

export async function apiAtualizarPlanoItem(token, planoId, itemId, payload) {
    const res = await fetch(`${API_URL}/api/planos/${planoId}/itens/${itemId}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao atualizar item do plano");
    return data;
}

/* --- IMAGENS --- */
export async function apiGetImagens(token, pacienteId) {
    const res = await fetch(`${API_URL}/api/imagens/?paciente_id=${pacienteId}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar imagens do paciente");
    return Array.isArray(data) ? data : [];
}

export async function apiUploadImagem(token, pacienteId, file) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("paciente_id", pacienteId);
    const res = await fetch(`${API_URL}/api/imagens/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro no upload");
    return data;
}

export async function apiDeletarImagem(token, imagemId) {
    const res = await fetch(`${API_URL}/api/imagens/${imagemId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao deletar imagem");
    return data;
}

/* --- PROCEDIMENTOS --- */
export async function apiGetProcedimentos(token, clinicId) {
    const url = clinicId
        ? `${API_URL}/api/procedimentos/?clinic_id=${clinicId}`
        : `${API_URL}/api/procedimentos/`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar procedimentos");
    return data;
}

export async function apiGetProcedimento(token, procedimentoId) {
    const res = await fetch(`${API_URL}/api/procedimentos/${procedimentoId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar procedimento");
    return data;
}

export async function apiCriarProcedimento(token, procedimentoData) {
    const res = await fetch(`${API_URL}/api/procedimentos/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(procedimentoData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar procedimento");
    return data;
}

export async function apiAtualizarProcedimento(token, procedimentoId, procedimentoData) {
    const res = await fetch(`${API_URL}/api/procedimentos/${procedimentoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(procedimentoData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao atualizar procedimento");
    return data;
}

export async function apiDeletarProcedimento(token, procedimentoId) {
    const res = await fetch(`${API_URL}/api/procedimentos/${procedimentoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao remover procedimento");
    return data;
}

export async function apiAlterarStatusProcedimento(token, procedimentoId, status) {
    const res = await fetch(`${API_URL}/api/procedimentos/${procedimentoId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao alterar status do procedimento");
    return data;
}

/* --- DASHBOARD MÉTRICAS --- */
export async function apiGetMetricas(token, clinicId = null) {
    const url = clinicId
        ? `${API_URL}/api/dashboard/metricas?clinic_id=${clinicId}`
        : `${API_URL}/api/dashboard/metricas`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar métricas");
    return data;
}
