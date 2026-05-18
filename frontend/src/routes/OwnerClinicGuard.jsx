import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OwnerClinicGuard({ children }) {

    const { user } = useAuth();

    const hasClinic =
        user?.perfil?.has_clinic;

    if (!hasClinic) {

        return (
            <Navigate
                to="/owner/clinic"
                replace
            />
        );

    }

    return children;
}

export default OwnerClinicGuard;