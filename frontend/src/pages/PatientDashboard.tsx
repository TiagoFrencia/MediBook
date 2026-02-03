import { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';
import { getPatientById } from '../services/PatientService';
import { BookingModal } from '../components/BookingModal';
import api from '../api/axiosConfig';
import { Calendar, Clock, User, Plus, LogOut, ChevronRight, Activity } from 'lucide-react';
/**
 * Dashboard principal del paciente.
 * Permite visualizar el historial de citas, el próximo turno y acceder al modal de reserva.
 */
export const PatientDashboard = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [nextAppointment, setNextAppointment] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load Patient Name
            const patientId = AuthService.getPatientId();
            if (patientId) {
                const patient = await getPatientById(Number(patientId));
                setPatientName(patient.firstName);
            }

            // Load Appointments
            const apptRes = await api.get('/appointments/my-appointments');
            const sortedAppointments = apptRes.data.sort((a: any, b: any) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
            setAppointments(sortedAppointments);

            // Find Next Appointment
            const now = new Date();
            const upcoming = sortedAppointments
                .filter((a: any) => new Date(a.dateTime) > now && a.status !== 'CANCELLED')
                .sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

            if (upcoming.length > 0) {
                setNextAppointment(upcoming[0]);
            }



        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        AuthService.logout();
    };



    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <Activity className="h-8 w-8 text-blue-600" />
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">MediBook</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-500 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Hola, {patientName || 'Paciente'} <span className="animate-wave inline-block">👋</span>
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">Aquí tienes el resumen de tu salud.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                    >
                        <Plus className="h-5 w-5" />
                        Reservar Nuevo Turno
                    </button>
                </div>

                {/* Next Appointment Card */}
                {nextAppointment && (
                    <div className="mb-10 animate-fade-in-up">
                        <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" /> Próximo Turno
                        </h2>
                        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                    {nextAppointment.doctorName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Dr. {nextAppointment.doctorName}</h3>
                                    <p className="text-slate-500 font-medium">{nextAppointment.specialty || 'Especialista'}</p> {/* Fallback if specialty not in DTO */}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full md:w-auto bg-slate-50 p-4 rounded-xl md:bg-transparent md:p-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Fecha</p>
                                        <p className="font-semibold text-slate-700 capitalize">{formatDate(nextAppointment.dateTime)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Hora</p>
                                        <p className="font-semibold text-slate-700">{formatTime(nextAppointment.dateTime)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointment History */}
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Tu Historial de Citas</h2>

                    {appointments.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No tienes ningun turno registrado.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {appointments.map((appt: any) => (
                                <div
                                    key={appt.id}
                                    className="bg-white rounded-xl shadow-sm p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Dr. {appt.doctorName}</p>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span>{formatDate(appt.dateTime)}</span>
                                                <span>•</span>
                                                <span>{formatTime(appt.dateTime)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${appt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                            appt.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                            {appt.status}
                                        </span>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Booking Modal */}
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        loadData();
                    }}
                />
            </main>
        </div>
    );
};
