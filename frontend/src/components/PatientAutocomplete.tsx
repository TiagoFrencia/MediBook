import { useState, useEffect, useRef } from 'react';
import { searchPatients } from '../services/PatientService';
import type { Patient } from '../types/Patient';

interface PatientAutocompleteProps {
    onSelect: (patient: Patient) => void;
}

export const PatientAutocomplete = ({ onSelect }: PatientAutocompleteProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const patients = await searchPatients(query);
                    setResults(patients);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Error searching patients:', error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (patient: Patient) => {
        setQuery(`${patient.firstName} ${patient.lastName}`);
        setShowDropdown(false);
        onSelect(patient);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar Paciente
            </label>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre o DNI del paciente..."
            />

            {showDropdown && (results.length > 0 || isLoading) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {isLoading ? (
                        <div className="px-4 py-2 text-gray-500">Buscando...</div>
                    ) : (
                        <ul>
                            {results.map((patient) => (
                                <li
                                    key={patient.id}
                                    onClick={() => handleSelect(patient)}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                                >
                                    <div className="font-medium text-gray-900">
                                        {patient.firstName} {patient.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {patient.email} - {patient.dni || 'Sin DNI'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {showDropdown && !isLoading && results.length === 0 && query.trim().length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-4 py-2 text-gray-500">
                    No se encontraron pacientes
                </div>
            )}
        </div>
    );
};
