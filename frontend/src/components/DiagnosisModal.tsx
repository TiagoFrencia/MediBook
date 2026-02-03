import { useState, useEffect } from 'react';

interface Appointment {
    id: number;
    patientName: string;
    diagnosis?: string;
    treatment?: string;
}

interface DiagnosisModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onSave: (id: number, diagnosis: string, treatment: string) => void;
}

export const DiagnosisModal = ({ isOpen, onClose, appointment, onSave }: DiagnosisModalProps) => {
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (appointment) {
            setDiagnosis(appointment.diagnosis || '');
            setTreatment(appointment.treatment || '');
        }
    }, [appointment]);

    if (!isOpen || !appointment) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(appointment.id, diagnosis, treatment);
            onClose();
        } catch (error) {
            // Error handling is done in parent or service usually, but we could add state here
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Historia Clínica - {appointment.patientName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Diagnóstico
                            </label>
                            <textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                                placeholder="Escribe el diagnóstico del paciente..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tratamiento / Receta
                            </label>
                            <textarea
                                value={treatment}
                                onChange={(e) => setTreatment(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                                placeholder="Detalla el tratamiento a seguir..."
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${saving ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {saving ? 'Guardando...' : 'Guardar Historia'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
