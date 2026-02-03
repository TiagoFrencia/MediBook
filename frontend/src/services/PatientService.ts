import api from '../api/axiosConfig';
import type { Patient } from '../types/Patient';

export const getPatients = async (): Promise<Patient[]> => {
    const response = await api.get('/patients');
    return response.data;
};

export const createPatient = async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
    const response = await api.post('/patients', patient);
    return response.data;
};

export const updatePatient = async (id: number, patient: Patient): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
};

export const getPatientById = async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
};

export const searchPatients = async (query: string): Promise<Patient[]> => {
    try {
        const response = await api.get('/patients/search', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching patients:", error);
        return [];
    }
};

