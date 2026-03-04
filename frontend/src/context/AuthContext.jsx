import { createContext, useContext, useState, useEffect } from "react";
import { apiMe } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    /* Verifica se o token salvo ainda é válido ao carregar */
    useEffect(() => {
        if (token) {
            apiMe(token)
                .then((data) => setUser(data))
                .catch(() => {
                    localStorage.removeItem("token");
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    function login(tokenValue, userData) {
        localStorage.setItem("token", tokenValue);
        setToken(tokenValue);
        setUser(userData);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

/* Hook de conveniência */
export function useAuth() {
    return useContext(AuthContext);
}
