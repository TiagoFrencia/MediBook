import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto animate-fadeIn">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
