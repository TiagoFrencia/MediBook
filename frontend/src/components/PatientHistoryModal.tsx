import { useEffect, useState } from 'react';
import { getPatientHistory, downloadPrescription } from '../services/AppointmentService';

interface PatientHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientEmail: string | null;
    patientName: string;
}

interface HistoryAppointment {
    id: number;
    dateTime: string;
    doctorName: string;
    status: string;
    diagnosis?: string;
    treatment?: string;
}

export const PatientHistoryModal = ({ isOpen, onClose, patientEmail, patientName }: PatientHistoryModalProps) => {
    const [history, setHistory] = useState<HistoryAppointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && patientEmail) {
            setLoading(true);
            setError(null);
            getPatientHistory(patientEmail)
                .then(data => setHistory(data))
                .catch(() => setError('No se pudo cargar el historial.'))
                .finally(() => setLoading(false));
        } else {
            setHistory([]);
        }
    }, [isOpen, patientEmail]);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Historial Médico: {patientName}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {loading && <p className="text-center text-gray-500 py-4">Cargando historial...</p>}

                    {error && (
                        <div className="bg-red-50 p-4 rounded-md mb-4 text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading && !error && history.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No hay historial disponible para este paciente.</p>
                    )}

                    {!loading && !error && history.length > 0 && (
                        <div className="space-y-4">
                            {history.map((appt) => {
                                const date = new Date(appt.dateTime);
                                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={appt.id} className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-600">{formattedDate}</p>
                                                <p className="font-medium text-gray-900">Dr. {appt.doctorName}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {appt.status === 'COMPLETED' && (
                                                    <button
                                                        onClick={() => handleDownloadPrescription(appt.id)}
                                                        className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-100 transition-colors"
                                                        title="Descargar Receta"
                                                    >
                                                        🖨️
                                                    </button>
                                                )}
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${appt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        appt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                            appt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                    {appt.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 border-t pt-2">
                                            {appt.status === 'COMPLETED' ? (
                                                appt.diagnosis ? (
                                                    <>
                                                        <div className="mb-2">
                                                            <span className="font-semibold text-gray-700 text-sm">Diagnóstico:</span>
                                                            <p className="text-gray-800">{appt.diagnosis}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-gray-700 text-sm">Tratamiento:</span>
                                                            <p className="text-gray-800">{appt.treatment}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-500 italic text-sm">Sin notas médicas.</p>
                                                )
                                            ) : (
                                                <p className="text-gray-400 italic text-sm">Cita no completada.</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t text-right">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
