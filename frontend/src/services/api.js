/* API BASE URL — troca para a URL do Render quando fizer o deploy */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* --- AUTH --- */
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

/* --- CONSULTAS --- */
export async function apiGetConsultas(token) {
    const res = await fetch(`${API_URL}/api/consultas/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar consultas");
    return data;
}
