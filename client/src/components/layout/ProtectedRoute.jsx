import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-[#050508] flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/welcome" replace />;
    }

    return <Outlet />;
}
