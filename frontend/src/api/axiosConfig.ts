
import axios from 'axios';



import { API_BASE_URL } from '../config/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request Interceptor: Inyecta el token automáticamente
api.interceptors.request.use(
    (config) => {
        // LEER DIRECTAMENTE DEL BROWSER PARA EVITAR CICLOS
        const token = localStorage.getItem('MEDIBOOK_SECURE_TOKEN'); // Literal idéntico al de AuthService



        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Maneja errores 401 automáticamente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Eliminar token y redirigir sin usar AuthService para evitar ciclo
            localStorage.removeItem('MEDIBOOK_SECURE_TOKEN');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
