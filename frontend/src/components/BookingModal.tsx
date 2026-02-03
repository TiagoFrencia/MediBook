import { useState, useEffect } from 'react';
import { Calendar, Clock, X, User, CheckCircle, AlertCircle } from 'lucide-react';
import { getDoctors } from '../services/DoctorService';
import { bookMe, getTakenSlots } from '../services/AppointmentService';
import type { Doctor } from '../types/Doctor';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

/**
 * Modal para la reserva de nuevos turnos.
 * Gestiona la selección de doctores, fechas y horarios disponibles,
 * validando que no se solapen con turnos ocupados y respetando el horario laboral.
 * 
 * @param isOpen - Controla la visibilidad del modal.
 * @param onClose - Función para cerrar el modal.
 * @param onSuccess - Callback a ejecutar cuando la reserva es exitosa.
 */
export const BookingModal = ({ isOpen, onClose, onSuccess }: BookingModalProps) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        time: ''
    });

    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadDoctors();
        }
    }, [isOpen]);

    useEffect(() => {
        const updateSlots = async () => {
            if (formData.date && formData.doctorId) {
                try {
                    // 1. Obtener Slots Ocupados
                    const taken = await getTakenSlots(Number(formData.doctorId), formData.date);
                    // El backend puede devolver "10:00:00", normalizamos a "10:00"
                    const takenFormatted = taken.map((t: string) => t.substring(0, 5));

                    // 2. Generar Slots Laborales del Doctor
                    const selectedDoc = doctors.find(d => d.id === Number(formData.doctorId));
                    // Si workStart viene como "08:00:00", tomamos "08:00", sino default
                    const start = selectedDoc?.workStart ? selectedDoc.workStart.substring(0, 5) : "09:00";
                    const end = selectedDoc?.workEnd ? selectedDoc.workEnd.substring(0, 5) : "18:00";

                    const allWorkSlots = generateTimeSlots(start, end);

                    // 3. Filtrar disponibles
                    const available = allWorkSlots.filter(slot => !takenFormatted.includes(slot));
                    setAvailableSlots(available);

                } catch (err) {
                    console.error("Failed to fetch taken slots", err);
                    // Fallback a horario estándar si falla
                    setAvailableSlots(generateTimeSlots("09:00", "18:00"));
                }
            } else {
                setAvailableSlots([]);
            }
        };

        updateSlots();
    }, [formData.date, formData.doctorId, doctors]);

    const generateTimeSlots = (startStr: string, endStr: string) => {
        const slots = [];
        const [startHour, startMinute] = startStr.split(':').map(Number);
        const [endHour, endMinute] = endStr.split(':').map(Number);

        // Usamos una fecha base arbitraria para manipular horas
        const current = new Date();
        current.setHours(startHour, startMinute, 0, 0);

        const end = new Date();
        end.setHours(endHour, endMinute, 0, 0);

        // Generamos slots de 30 minutos mientras sea MENOR que la hora de fin
        // Ejemplo: Si termina 14:00, el último slot posible es 13:30 (asumiendo turno de 30m)
        while (current < end) {
            const hour = current.getHours().toString().padStart(2, '0');
            const minute = current.getMinutes().toString().padStart(2, '0');
            slots.push(`${hour}:${minute}`);
            current.setMinutes(current.getMinutes() + 30);
        }

        return slots;
    };

    const loadDoctors = async () => {
        try {
            const data = await getDoctors();
            setDoctors(data);
        } catch (err) {
            console.error('Failed to load doctors', err);
            setError('No se pudieron cargar los doctores disponibles.');
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value;
        if (!dateValue) {
            setFormData({ ...formData, date: '', time: '' });
            return;
        }

        const dateObj = new Date(dateValue + 'T00:00:00');
        const day = dateObj.getDay();

        if (day === 0 || day === 6) { // 0=Domingo, 6=Sábado
            setError("No atendemos los fines de semana. Por favor selecciona de Lunes a Viernes.");
            setFormData({ ...formData, date: '', time: '' });
            return;
        }

        setFormData({ ...formData, date: dateValue, time: '' });
        setError(null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Concatenate date and time for backend: YYYY-MM-DDTHH:mm:ss
            const finalDateTime = `${formData.date}T${formData.time}:00`;

            await bookMe({
                doctorId: Number(formData.doctorId),
                dateTime: finalDateTime
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Error booking:", err);
            const serverMessage = typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message || "Ocurrió un error al procesar la reserva.";

            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal Positioning */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Modal Content */}
                <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">

                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800" id="modal-title">
                                    Reservar Nuevo Turno
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-6">
                        <div className="space-y-6">

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Doctor Selector */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Seleccionar Especialista
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                                        value={formData.doctorId}
                                        onChange={(e) => {
                                            setFormData({ ...formData, doctorId: e.target.value });
                                            setError(null);
                                        }}
                                    >
                                        <option value="">Elegir un doctor...</option>
                                        {doctors.map((doc) => (
                                            <option key={doc.id} value={doc.id}>
                                                Dr. {doc.firstName} {doc.lastName} — {doc.specialty}
                                            </option>
                                        ))}
                                    </select>
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Fecha
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        required
                                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={formData.date}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={handleDateChange}
                                    />
                                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Time Slot Picker */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Horario
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        disabled={!formData.date || availableSlots.length === 0}
                                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={formData.time}
                                        onChange={(e) => {
                                            setFormData({ ...formData, time: e.target.value });
                                            setError(null);
                                        }}
                                    >
                                        <option value="">
                                            {!formData.date
                                                ? "Primero selecciona una fecha"
                                                : availableSlots.length === 0
                                                    ? "Agenda completa para este día"
                                                    : "Seleccione un horario..."}
                                        </option>
                                        {availableSlots.map((slot) => (
                                            <option key={slot} value={slot}>
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                    <Clock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Horarios calculados según disponibilidad del doctor.
                                </p>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <button
                                type="button"
                                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Confirmar Reserva
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
