import api from '../api/axiosConfig';
import type { Doctor } from '../types/Doctor';

const BASE_URL = '/doctors';

export const getDoctors = async (): Promise<Doctor[]> => {
    const response = await api.get<Doctor[]>(BASE_URL);
    return response.data;
};
