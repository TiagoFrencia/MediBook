import { useEffect, useState } from 'react';
import { getAppointments, updateStatus, saveDiagnosis, downloadPrescription } from '../services/AppointmentService';
import { DiagnosisModal } from './DiagnosisModal';
import { PatientHistoryModal } from './PatientHistoryModal';

interface Appointment {
    id: number;
    dateTime: string;
    patientName: string;
    patientEmail: string | null;
    doctorName: string;
    status: string;
    diagnosis?: string;
    treatment?: string;
}

export const AppointmentList = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);

    // History Modal State
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyPatientEmail, setHistoryPatientEmail] = useState<string | null>(null);
    const [historyPatientName, setHistoryPatientName] = useState('');

    const fetchAppointments = async () => {
        try {
            const data = await getAppointments();
            setAppointments(data);
        } catch (err) {
            setError('No se pudieron cargar las citas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await updateStatus(id, status);
            fetchAppointments(); // Reload list to reflect changes
        } catch (error) {
            alert('Error al actualizar el estado de la cita.');
        }
    };

    const handleOpenDiagnosis = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsDiagnosisModalOpen(true);
    };

    const handleViewPatientHistory = (email: string | null, name: string) => {
        if (!email) {
            alert('Este paciente no tiene email registrado.');
            return;
        }
        setHistoryPatientEmail(email);
        setHistoryPatientName(name);
        setIsHistoryModalOpen(true);
    };

    const handleSaveHistory = async (id: number, diagnosis: string, treatment: string) => {
        try {
            await saveDiagnosis(id, diagnosis, treatment);
            fetchAppointments(); // Reload to get updated data
        } catch (error) {
            alert('Error al guardar la historia clínica.');
            throw error; // Let modal handle it or rethrow
        }
    };

    const handleDownloadPrescription = async (id: number) => {
        try {
            const blob = await downloadPrescription(id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receta_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            alert('Error al descargar la receta.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600 animate-pulse">Cargando citas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                <p className="text-sm text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100 font-bold tracking-wider">
                    <tr>
                        <th scope="col" className="px-6 py-4 rounded-tl-lg">Fecha y Hora</th>
                        <th scope="col" className="px-6 py-4">Paciente</th>
                        <th scope="col" className="px-6 py-4">Email</th>
                        <th scope="col" className="px-6 py-4">Doctor</th>
                        <th scope="col" className="px-6 py-4">Estado</th>
                        <th scope="col" className="px-6 py-4 rounded-tr-lg">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {appointments.length === 0 ? (
                        <tr className="bg-white">
                            <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No hay citas agendadas.</td>
                        </tr>
                    ) : (
                        appointments.map((appointment) => {
                            const date = new Date(appointment.dateTime);
                            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            const isFinalStatus = appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED';

                            return (
                                <tr key={appointment.id} className="bg-white hover:bg-slate-50 transition-colors duration-150">
                                    <td className="px-6 py-4 font-medium text-slate-900">{formattedDate}</td>
                                    <td
                                        className="px-6 py-4 font-medium text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap transition-colors"
                                        onClick={() => handleViewPatientHistory(appointment.patientEmail, appointment.patientName)}
                                        title="Ver historial médico"
                                    >
                                        {appointment.patientName}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{appointment.patientEmail || '-'}</td>
                                    <td className="px-6 py-4 text-slate-700 font-medium">{appointment.doctorName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
                                            ${appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                    appointment.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1">
                                            {!isFinalStatus && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appointment.id, 'CANCELLED')}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                        title="Cancelar Cita"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                                                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
                                                        title="Completar Cita"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                            {appointment.status === 'COMPLETED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleOpenDiagnosis(appointment)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                                        title="Historia Clínica"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadPrescription(appointment.id)}
                                                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
                                                        title="Descargar Receta"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>

            <DiagnosisModal
                isOpen={isDiagnosisModalOpen}
                onClose={() => setIsDiagnosisModalOpen(false)}
                appointment={selectedAppointment}
                onSave={handleSaveHistory}
            />

            <PatientHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                patientEmail={historyPatientEmail}
                patientName={historyPatientName}
            />
        </div>
    );
};
