import api from '../api/axiosConfig';

const BASE_URL = '/appointments';

export const createAppointment = async (appointmentData: any) => {
    try {
        const response = await api.post(BASE_URL, appointmentData);
        return response.data;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
};

export const bookMe = async (appointmentData: { doctorId: number; dateTime: string }) => {
    try {
        const response = await api.post(`${BASE_URL}/book-me`, appointmentData);
        return response.data;
    } catch (error) {
        console.error('Error booking appointment:', error);
        throw error;
    }
};

export const getAppointments = async () => {
    try {
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
};

export const updateStatus = async (id: number, status: string) => {
    try {
        const response = await api.patch(`${BASE_URL}/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
};

export const saveDiagnosis = async (id: number, diagnosis: string, treatment: string) => {
    try {
        const response = await api.patch(`${BASE_URL}/${id}/diagnosis`, {
            diagnosis,
            treatment
        });
        return response.data;
    } catch (error) {
        console.error('Error saving diagnosis:', error);
        throw error;
    }
};

export const getPatientHistory = async (email: string) => {
    try {
        const response = await api.get(`${BASE_URL}/patient/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching patient history:', error);
        throw error;
    }
};

export const downloadPrescription = async (id: number) => {
    try {
        const response = await api.get(`${BASE_URL}/${id}/pdf`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error downloading prescription:', error);
        throw error;
    }
};

export const getTakenSlots = async (doctorId: number, date: string) => {
    try {
        const response = await api.get(`${BASE_URL}/taken-slots`, {
            params: { doctorId, date }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching taken slots:', error);
        throw error;
    }
};

