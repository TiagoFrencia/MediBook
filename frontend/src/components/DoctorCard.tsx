import type { Doctor } from '../types/Doctor';

interface DoctorCardProps {
    doctor: Doctor;
    onBook: (doctor: Doctor) => void;
}


export const DoctorCard = ({ doctor, onBook }: DoctorCardProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md hover:scale-[1.02] transition-all duration-300 border border-slate-100">
            <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                    {doctor.firstName[0]}
                    {doctor.lastName[0]}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">
                        Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                        {doctor.specialty}
                    </p>
                </div>
            </div>

            {doctor.bio && (
                <p className="text-slate-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {doctor.bio}
                </p>
            )}

            <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Consulta</span>
                    <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-sm inline-block self-start">
                        ${doctor.consultationPrice}
                    </span>
                </div>
            </div>

            <button
                onClick={() => onBook(doctor)}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all font-semibold shadow-md hover:shadow-lg active:scale-95"
            >
                Reservar Cita
            </button>
        </div>
    );
};
