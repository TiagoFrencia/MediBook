import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/auth`;
const AUTH_KEY = 'MEDIBOOK_SECURE_TOKEN';

/**
 * Servicio de autenticación.
 * Gestiona el login, registro y almacenamiento de tokens y roles.
 */
export default class AuthService {

    static async login(credentials: any) {
        const response = await axios.post(`${API_URL}/login`, credentials);
        if (response.data.token) {
            localStorage.setItem(AUTH_KEY, response.data.token);
            if (response.data.role) localStorage.setItem('MEDIBOOK_ROLE', response.data.role);
            if (response.data.patientId) localStorage.setItem('MEDIBOOK_PATIENT_ID', response.data.patientId.toString());
        }
        return response.data;
    }

    static async register(data: any) {
        return axios.post(`${API_URL}/register`, data);
    }

    static getToken(): string | null {
        return localStorage.getItem(AUTH_KEY);
    }

    static getRole(): string | null {
        return localStorage.getItem('MEDIBOOK_ROLE');
    }

    static getPatientId(): string | null {
        return localStorage.getItem('MEDIBOOK_PATIENT_ID');
    }

    static logout() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem('MEDIBOOK_ROLE');
        localStorage.removeItem('MEDIBOOK_PATIENT_ID');
        window.location.href = '/login';
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
