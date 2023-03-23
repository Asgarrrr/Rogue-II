import { useLocation, Navigate } from "react-router-dom";
import { useAuthState } from "../context/auth";

export default function RequireAuth({ children }) {

    const { authenticated, loading } = useAuthState();
    const location = useLocation();

    if ( loading ) { return null; }

    if ( !authenticated )
        return <Navigate to="/login" state={{ from: location }} replace />;

    return children;

}