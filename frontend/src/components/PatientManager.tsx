import { useState, useEffect } from 'react';
import type { Patient } from '../types/Patient';
import { getPatients, updatePatient } from '../services/PatientService';

export const PatientManager = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleEdit = (patient: Patient) => {
        setEditingPatient(patient);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPatient) return;

        try {
            await updatePatient(editingPatient.id, editingPatient);
            setEditingPatient(null);
            fetchPatients();
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Error al actualizar paciente');
        }
    };

    const filteredPatients = patients.filter(p =>
        (p.firstName + ' ' + p.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.dni && p.dni.includes(searchTerm)) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Gestión de Pacientes</h2>

            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nombre, DNI o email..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-lg shadow-sm transition-shadow hover:shadow-md"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-slate-600 animate-pulse">Cargando pacientes...</div>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">DNI</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                                        {patient.firstName} {patient.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">{patient.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">{patient.phone || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">{patient.dni || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleEdit(patient)}
                                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                        <h3 className="text-lg font-bold mb-4">Editar Paciente</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        value={editingPatient.firstName}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, firstName: e.target.value })}
                                        className="mt-1 w-full border rounded-md px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Apellido</label>
                                    <input
                                        type="text"
                                        value={editingPatient.lastName}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, lastName: e.target.value })}
                                        className="mt-1 w-full border rounded-md px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={editingPatient.email}
                                    onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                                    className="mt-1 w-full border rounded-md px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input
                                        type="text"
                                        value={editingPatient.phone || ''}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                                        className="mt-1 w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                                    <input
                                        type="text"
                                        value={editingPatient.dni || ''}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, dni: e.target.value })}
                                        className="mt-1 w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Alergias</label>
                                <textarea
                                    value={editingPatient.allergies || ''}
                                    onChange={(e) => setEditingPatient({ ...editingPatient, allergies: e.target.value })}
                                    className="mt-1 w-full border rounded-md px-3 py-2"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingPatient(null)}
                                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
