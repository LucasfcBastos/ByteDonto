/* IMPORTS OF COMPONENTS */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import ScrollToTop from "./ScrollToTop";

import LandingPage from "../pages/general/LandingPage";
import LoginPage from "../pages/general/LoginPage";
import CadastroPage from "../pages/general/CadastroPage";

import ListClinic from "../pages/owner/ListClinic";
import ViewClinic from "../pages/owner/ViewClinic";
import RegisterClinic from "../pages/owner/RegisterClinic";
import EditClinic from "../pages/owner/EditClinic";
import BindClinic from "../pages/owner/BindClinic";

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
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* ROTAS QUE VÃO SER PRIVADAS E SÓ ENTRA AUTHNTICADO COM TOKEN */}
          <Route path="/owner/clinic" element={<ListClinic />} />
          <Route path="/owner/clinic/register" element={<RegisterClinic />} />
          <Route path="/owner/view-clinic/:id" element={<ViewClinic />} />
          <Route path="/owner/edit-clinic/:id" element={<EditClinic />} />
          <Route path="/owner/bind-clinic/:id" element={<BindClinic />} />

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