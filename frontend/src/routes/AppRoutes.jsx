/* IMPORTS OF COMPONENTS */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LandingPage from "../pages/general/LandingPage";
import LoginPage from "../pages/general/LoginPage";
import CadastroPage from "../pages/general/CadastroPage";

import ViewClinic from "../pages/owner/ViewClinic";
import RegisterClinic from "../pages/owner/RegisterClinic.jsx";

import DashboardPage from "../pages/dashboard/DashboardPage";

/* PRIVATE ROUTE — redireciona para login se não autenticado */
function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" replace />;
}

/* MAIN COMPONENT */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* ROTAS QUE VÃO SER PRIVADAS E SÓ ENTRA AUTHNTICADO COM TOKEN */}
          <Route path="/owner/clinic" element={<ViewClinic />} />
          <Route path="/owner/clinic/register" element={<RegisterClinic />} />

          {/* Private routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}