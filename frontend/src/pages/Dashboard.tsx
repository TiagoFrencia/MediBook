import { useLocation } from 'react-router-dom';

export const Dashboard = () => {
    // Ideally, we would use nested routes for content, 
    // but to keep compatibility with existing components that might not be ready for full routing refactor yet,
    // we can use the path to determine what to render if we want to be strict,
    // or just render the Outlet if we define child routes in App.tsx.

    // For this refactor, I will assume we are using child routes in the main App router configuration.
    // So this component might just be a placeholder or contain dashboard-specific summary widgets if at root /dashboard.

    const location = useLocation();

    if (location.pathname === '/dashboard') {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Bienvenido al Panel de Control</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Placeholder Widgets */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">Total Pacientes</h3>
                        <p className="text-3xl font-bold text-slate-800">1,234</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">Turnos Hoy</h3>
                        <p className="text-3xl font-bold text-blue-600">42</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">Ingresos Mes</h3>
                        <p className="text-3xl font-bold text-emerald-600">$12.5k</p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
