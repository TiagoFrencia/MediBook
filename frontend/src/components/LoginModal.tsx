import { useState } from 'react';
import AuthService from '../services/AuthService';

const DEMO_ADMIN = { username: 'admin@medibook.com', password: '123456' };
const DEMO_PATIENT = { username: 'paciente@medibook.com', password: '123456' };

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await AuthService.login({ username, password });
            onLoginSuccess();
            onClose();
        } catch (err) {
            setError('Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Iniciar Sesión (Admin)</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </div>

                    {/* Sección de Credenciales Demo */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                                <span className="mr-2">🔐</span> Credenciales Demo
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUsername(DEMO_ADMIN.username);
                                        setPassword(DEMO_ADMIN.password);
                                    }}
                                    className="flex items-center justify-between w-full px-3 py-2 bg-white border border-blue-200 rounded text-sm text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">👨‍⚕️</span>
                                        <div className="text-left">
                                            <div className="font-medium">Rol Doctor / Admin</div>
                                            <div className="text-xs text-blue-500 opacity-75">Click para autocompletar</div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setUsername(DEMO_PATIENT.username);
                                        setPassword(DEMO_PATIENT.password);
                                    }}
                                    className="flex items-center justify-between w-full px-3 py-2 bg-white border border-blue-200 rounded text-sm text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">🤒</span>
                                        <div className="text-left">
                                            <div className="font-medium">Rol Paciente</div>
                                            <div className="text-xs text-blue-500 opacity-75">Click para autocompletar</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
