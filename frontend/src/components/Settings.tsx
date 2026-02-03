import { Building, Bell } from 'lucide-react';

export const Settings = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Configuración del Sistema</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Perfil de Clínica Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Building className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Perfil de Clínica</h3>
                            <p className="text-sm text-slate-500">Gestionar información general</p>
                        </div>
                    </div>
                </div>

                {/* Notificaciones Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Notificaciones</h3>
                            <p className="text-sm text-slate-500">Preferencias de alertas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
