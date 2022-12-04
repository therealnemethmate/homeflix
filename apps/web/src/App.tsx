import Login from './components/login/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import { ProtectedRoute } from './hooks/protectedRoute';
import { AuthProvider } from './hooks/auth';
import Torrents from './components/torrents/Torrent';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={
                    <Navigate to="/torrent" />
                } />
                <Route path='/login' element={
                    <AuthProvider>
                        <Login />
                    </AuthProvider>
                } />
                <Route path='/torrent' element={
                    <AuthProvider>
                        <ProtectedRoute>
                            <Torrents/>
                        </ProtectedRoute>
                    </AuthProvider>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
