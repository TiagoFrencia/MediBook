import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { Stethoscope, Lock, User } from 'lucide-react';

const DEMO_ADMIN = { username: 'admin@medibook.com', password: '123456' };
const DEMO_PATIENT = { username: 'paciente@medibook.com', password: '123456' };

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await AuthService.login({ username, password });

            // Role-based redirect
            const role = AuthService.getRole();
            if (role === 'PATIENT') {
                navigate('/patient-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side - Image & Quote */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 justify-center items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40 grayscale mix-blend-multiply" />

                <div className="relative z-20 max-w-lg px-12 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                        Gestión Médica <br />
                        <span className="text-blue-400">Inteligente y Humana</span>
                    </h2>
                    <p className="text-slate-300 text-lg leading-relaxed font-light">
                        "La tecnología al servicio de la salud, optimizando tiempos para lo que realmente importa: el paciente."
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8 animate-fadeIn">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Bienvenido de nuevo
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Ingresa a tu panel de administración
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                                    Usuario
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                        placeholder="Ej. admin"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                                    Contraseña
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg shadow-blue-600/30 overflow-hidden ${loading ? 'opacity-70 cursor-wait' : ''
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Ingresando...</span>
                                    </div>
                                ) : (
                                    'Ingresar al Sistema'
                                )}
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

                        <div className="text-center mt-4 space-y-2">
                            <p className="text-sm text-slate-600">
                                ¿No tienes cuenta?{' '}
                                <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Regístrate como paciente
                                </a>
                            </p>
                            <a href="/" className="block text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
                                ← Volver al sitio público
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
