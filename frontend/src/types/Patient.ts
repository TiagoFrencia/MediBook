export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dni?: string;
    birthDate?: string;
    allergies?: string;
    bloodType?: string;
}
