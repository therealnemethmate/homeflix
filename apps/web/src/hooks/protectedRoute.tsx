import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const auth = useAuth();
    if (!auth.token) return <Navigate to="/login" />;
    return children;
};
