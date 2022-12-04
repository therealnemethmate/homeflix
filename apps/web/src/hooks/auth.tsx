import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './localStorage';
// eslint-disable-next-line func-call-spacing
type AuthContextType = { token?: string, login?: (token: string) => void, logout?: () => void };

const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [token, setToken] = useLocalStorage('$homeflix-token');
    const navigate = useNavigate();

    const login = async (token: string) => {
        setToken(token);
        navigate('/torrent');
    };

    const logout = () => {
        setToken();
        navigate('/', { replace: true });
    };

    const value = useMemo(
        () => ({ token, login, logout }),
        [token],
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
