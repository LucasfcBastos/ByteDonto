import { useAuth } from "../context/AuthContext";
import { usePermissao } from "./usePermissao";

import ClinicIcon from "../assets/svg/clinic.svg?react";
import TeamIcon from "../assets/svg/team.svg?react";
import FinancialIcon from "../assets/svg/financial.svg?react";
import PatientIcon from "../assets/svg/patient.svg?react";
import CalendarIcon from "../assets/svg/calendar.svg?react";
import PanelIcon from "../assets/svg/panel.svg?react";

const OWNER_ITEMS = [
    {
        id: "clinic",
        icon: ClinicIcon,
        name: "Clínica",
        url: "/owner/clinic"
    },

    {
        id: "team",
        icon: TeamIcon,
        name: "Equipe",
        url: "/owner/team"
    },

    {
        id: "patients",
        icon: PatientIcon,
        name: "Pacientes",
        url: "/owner/pacients"
    },

    {
        id: "procedures",
        icon: PanelIcon,
        name: "Procedimentos",
        url: "/owner/procedures"
    },

    {
        id: "financial",
        icon: FinancialIcon,
        name: "Financeiro",
        url: "/owner/financial"
    },
];

const OWNER_ONLY_CLINIC = [
    {
        id: "clinic",
        icon: ClinicIcon,
        name: "Clínica",
        url: "/owner/clinic"
    },
];

const EMPLOYEE_ITEMS = [
    {
        id: "dashboard",
        icon: PanelIcon,
        name: "Painel Principal",
        url: "/employee/dashboard"
    },

    {
        id: "patients",
        icon: PatientIcon,
        name: "Pacientes",
        url: "/employee/pacients"
    },

    {
        id: "consultations",
        icon: CalendarIcon,
        name: "Consulta",
        url: "/employee/consultations"
    },

    {
        id: "financial",
        icon: FinancialIcon,
        name: "Financeiro",
        url: "/employee/financial"
    },
];

const SPECIALIST_ITEMS = [
    {
        id: "dashboard",
        icon: PanelIcon,
        name: "Painel Principal",
        url: "/specialist/dashboard"
    },

    {
        id: "schedule",
        icon: CalendarIcon,
        name: "Minha Agenda",
        url: "/specialist/schedule"
    },

    {
        id: "patients",
        icon: PatientIcon,
        name: "Pacientes",
        url: "/specialist/patients"
    },
];

function item(id, name, url) {
    return {
        id,
        icon: ClinicIcon,
        name,
        url
    };
}

function withSelect(items, activeId) {
    return items.map(i => ({
        ...i,
        style: i.id === activeId
            ? "select"
            : ""
    }));
}

export function useOwnerSidebar(activeId) {

    const { user } = useAuth();

    const possuiClinica =
        user?.perfil?.has_clinic === true;

    const items = possuiClinica
        ? OWNER_ITEMS
        : OWNER_ONLY_CLINIC;

    return withSelect(items, activeId);
}

export function useSpecialistSidebar(activeId) {

    const items = SPECIALIST_ITEMS;

    return withSelect(items, activeId);
}

export function useEmployeeSidebar(activeId) {

    const items = EMPLOYEE_ITEMS;

    return withSelect(items, activeId);
}