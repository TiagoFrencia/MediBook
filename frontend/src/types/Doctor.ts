export interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialty: string;
    email: string;
    bio?: string;
    consultationPrice: number;
    workStart?: string;
    workEnd?: string;
}
