/* IMPORTS OF COMPONENTS */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import ScrollToTop from "./ScrollToTop";
import OwnerClinicGuard from "./OwnerClinicGuard";

/* Telas Normais */

import LandingPage from "../pages/general/LandingPage";
import LoginPage from "../pages/general/LoginPage";
import CadastroPage from "../pages/general/CadastroPage";

/* Telas Owner */

/* ===== Owner Clinicas */

import OwnerListClinic from "../pages/owner/clinic/ListClinic";
import OwnerRegisterClinic from "../pages/owner/clinic/RegisterClinic";
import OwnerViewClinic from "../pages/owner/clinic/ViewClinic";
import OwnerEditClinic from "../pages/owner/clinic/EditClinic";

/* ===== Owner Time */

import OwnerTeamClinic from "../pages/owner/team/TeamClinic";
import OwnerListTeam from "../pages/owner/team/ListTeam";

/* ===== Owner Paciente */

import OwnerPacientClinic from "../pages/owner/pacients/PacientClinic";
import OwnerListPacient from "../pages/owner/pacients/ListPacient";
import OwnerRegisterPacient from "../pages/owner/pacients/RegisterPacient";
import OwnerViewPacient from "../pages/owner/pacients/ViewPacient";
import OwnerEditPacient from "../pages/owner/pacients/EditPacient";

/* ===== Owner Procedimento */

import OwnerProcedureClinic from "../pages/owner/procedures/ProcedureClinic";
import OwnerListProcedures from "../pages/owner/procedures/ListProcedures";
import OwnerRegisterProcedure from "../pages/owner/procedures/RegisterProcedure";
import OwnerEditProcedure from "../pages/owner/procedures/EditProcedure";

/* ===== Owner Financeiro */

import OwnerFinancial from "../pages/owner/financial/Financial";

/* Telas Specialist */

/* ===== Specialist Dashboard */

import SpecialistDashClinic from "../pages/specialist/dashboard/DashClinic";

/* ===== Specialist Consulta */

import SpecialistScheduleClinic from "../pages/specialist/schedule/ScheduleClinic";

/* ===== Specialist Paciente */

import SpecialistPatientClinic from "../pages/specialist/patient/PatientClinic";

import SpecialistDashboard from "../pages/specialist/Dashboard";
import SpecialistListPatients from "../pages/specialist/ListPatients";
import SpecialistViewRecord from "../pages/specialist/ViewRecord";

/* Telas Employee */

/* ===== Employee Dashboard */

import EmployeeDashClinic from "../pages/employee/dashboard/DashClinic";

/* ===== Employee Paciente */

import EmployeePatientClinic from "../pages/employee/patient/PatientClinic";

/* ===== Employee Consulta */

import EmployeeConsultationsClinic from "../pages/employee/consultations/ConsultationsClinic";

/* ===== Employee Financeiro */

import EmployeeFinancialClinic from "../pages/employee/financial/FinancialClinic";

import ReceptionDashboard from "../pages/employee/Dashboard";
import RegisterPatient from "../pages/employee/RegisterPatient";
import ListPatients from "../pages/employee/ListPatients";
import ViewPatient from "../pages/employee/ViewPatient";

/* Mapeia role para o dashboard correto para redirecionamento automático */
function dashboardByRole(papel) {
  if (papel === "Employee") return "/employee/dashboard";
  if (papel === "Specialist") return "/specialist/dashboard";
  return "/owner/clinic";
}

/* PRIVATE ROUTE — redireciona para login se não autenticado.
   Se allowedRoles for informado, redireciona para o dashboard correto
   caso o papel do usuário não coincida. */
function PrivateRoute({ children, allowedRoles }) {
  const { token, user, loading } = useAuth();
  if (loading) return null;
  if (!token) return <Navigate to="/" replace />;

  if (allowedRoles && user?.perfil?.roles) {
    const papel = user.perfil.roles;
    if (!allowedRoles.includes(papel)) {
      return <Navigate to={dashboardByRole(papel)} replace />;
    }
  }

  return children;
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
          <Route path="/login/:type" element={<LoginPage />} />
          <Route path="/cadastro/:type" element={<CadastroPage />} />

          {/* ROTAS DO PROPRIETÁRIO */}
          <Route path="/owner/clinic" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerListClinic /></PrivateRoute>} />
          <Route path="/owner/clinic/register" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerRegisterClinic /></PrivateRoute>} />
          <Route path="/owner/view-clinic/:id" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerViewClinic /></OwnerClinicGuard></PrivateRoute>} />
          <Route path="/owner/edit-clinic/:id" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerEditClinic /></OwnerClinicGuard></PrivateRoute>} />

          <Route path="/owner/team" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerTeamClinic /></OwnerClinicGuard></PrivateRoute>} />
          <Route path="/owner/team/:id_clinic" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerListTeam /></OwnerClinicGuard></PrivateRoute>} />

          <Route path="/owner/pacients" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerPacientClinic /></OwnerClinicGuard></PrivateRoute>} />
          <Route path="/owner/pacients/:id_clinic" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerListPacient /></OwnerClinicGuard></PrivateRoute>} />
          <Route path="/owner/pacients/:id_clinic/register" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerRegisterPacient /></OwnerClinicGuard></PrivateRoute>} />
          <Route path="/owner/pacients/:id_clinic/view-pacient/:id_pacient" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerViewPacient /></OwnerClinicGuard></PrivateRoute>} />
          <Route path="/owner/pacients/:id_clinic/edit-pacient/:id_pacient" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerEditPacient /></OwnerClinicGuard></PrivateRoute>} />

          <Route path="/owner/procedures" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerProcedureClinic /></OwnerClinicGuard></PrivateRoute>} />
          <Route path="/owner/procedures/:id_clinic" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerListProcedures /></OwnerClinicGuard></PrivateRoute>} />
          <Route path="/owner/procedures/:id_clinic/register" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerRegisterProcedure /></OwnerClinicGuard></PrivateRoute>} />
          <Route path="/owner/procedures/:id_clinic/edit/:id_procedure" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerEditProcedure /></OwnerClinicGuard></PrivateRoute>} />

          <Route path="/owner/financial" element={<PrivateRoute allowedRoles={["Owner"]}><OwnerClinicGuard><OwnerFinancial role="owner" /></OwnerClinicGuard></PrivateRoute>} />

          {/* ROTAS DO ESPECIALISTA (DENTISTA) */}
          <Route path="/specialist/dashboard" element={<PrivateRoute allowedRoles={["Specialist"]}><SpecialistDashClinic /></PrivateRoute>} />
          
          <Route path="/specialist/schedule" element={<PrivateRoute allowedRoles={["Specialist"]}><SpecialistScheduleClinic /></PrivateRoute>} />
          
          <Route path="/specialist/patients" element={<PrivateRoute allowedRoles={["Specialist"]}><SpecialistPatientClinic /></PrivateRoute>} />

          {/*=================================================================================================*/}

          <Route path="/specialist/records" element={<PrivateRoute allowedRoles={["Specialist"]}><SpecialistListPatients /></PrivateRoute>} />
          <Route path="/specialist/patient/view" element={<PrivateRoute allowedRoles={["Specialist"]}><SpecialistViewRecord /></PrivateRoute>} />

          {/* ROTAS DA RECEPÇÃO */}
          <Route path="/employee/dashboard" element={<PrivateRoute allowedRoles={["Employee"]}><EmployeeDashClinic /></PrivateRoute>} />
          
          <Route path="/employee/pacients" element={<PrivateRoute allowedRoles={["Employee"]}><EmployeePatientClinic /></PrivateRoute>} />
          
          <Route path="/employee/consultations" element={<PrivateRoute allowedRoles={["Employee"]}><EmployeeConsultationsClinic /></PrivateRoute>} />

          <Route path="/employee/financial" element={<PrivateRoute allowedRoles={["Employee"]}><EmployeeFinancialClinic /></PrivateRoute>} />

          {/*=================================================================================================*/}

          <Route path="/employee/pacients/:id_clinic" element={<PrivateRoute allowedRoles={["Employee"]}><OwnerListPacient /></PrivateRoute>} />
          <Route path="/employee/pacients/:id_clinic/register" element={<PrivateRoute allowedRoles={["Employee"]}><OwnerRegisterPacient /></PrivateRoute>} />
          <Route path="/employee/pacients/:id_clinic/view-pacient/:id_pacient" element={<PrivateRoute allowedRoles={["Employee"]}><OwnerViewPacient /></PrivateRoute>} />
          <Route path="/employee/pacients/:id_clinic/edit-pacient/:id_pacient" element={<PrivateRoute allowedRoles={["Employee"]}><OwnerEditPacient /></PrivateRoute>} />

          <Route path="/employee/patient/register" element={<PrivateRoute allowedRoles={["Employee"]}><RegisterPatient /></PrivateRoute>} />
          <Route path="/employee/patients" element={<PrivateRoute allowedRoles={["Employee"]}><ListPatients /></PrivateRoute>} />
          <Route path="/employee/patient/view" element={<PrivateRoute allowedRoles={["Employee"]}><ViewPatient /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}