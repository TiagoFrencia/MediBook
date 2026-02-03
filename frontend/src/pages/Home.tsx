import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CalendarClock,
    ShieldCheck,
    Stethoscope,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Mail,
    Headphones
} from 'lucide-react';

/**
 * Página de inicio (Landing Page).
 * Muestra la propuesta de valor, beneficios y acceso a la plataforma.
 */
export const Home = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navbar */}
            <nav className="w-full py-4 px-6 flex justify-between items-center bg-white/80 backdrop-blur-md fixed top-0 z-50 shadow-sm border-b border-slate-100/50">
                {/* Logo */}
                <div className="flex items-center gap-2.5 group cursor-pointer">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
                        <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-extrabold text-slate-800 tracking-tight">
                        Medi<span className="text-blue-600">Book</span>
                    </span>
                </div>

                {/* Nav Links (Hidden on mobile) */}
                <div className="hidden md:flex items-center gap-10">
                    {['Funcionalidades', 'Testimonios', 'Planes'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="hidden md:flex items-center justify-center px-5 py-2.5 text-sm font-bold text-blue-600 bg-transparent border-2 border-blue-100 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-all hover:shadow-md"
                    >
                        Acceso Profesionales
                    </Link>
                    <Link
                        to="/login"
                        className="flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30"
                    >
                        Ingresar
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">

                {/* Decorative Elements */}
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl opacity-40 mix-blend-multiply pointer-events-none animate-blob"></div>
                <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-teal-300/20 rounded-full blur-3xl opacity-40 mix-blend-multiply pointer-events-none animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Text Content */}
                    <div className="text-center lg:text-left relative">
                        {/* Text Decoration Glow */}
                        <div className="absolute -inset-10 bg-white/40 blur-3xl -z-10 rounded-full opacity-60"></div>

                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
                            Tu Salud, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Simplificada.</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Gestiona tus citas médicas, accede a tu historial clínico y conecta con los mejores especialistas. Todo en una sola plataforma segura.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-600/40 transform hover:-translate-y-1 gap-2"
                            >
                                Sacar un Turno Ahora <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                            >
                                Más Información
                            </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Placeholders for partner logos if needed, usually looks pro */}
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-400 flex items-center gap-1">
                                    <ShieldCheck className="w-5 h-5" /> 100% Seguro
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-400 flex items-center gap-1">
                                    <Stethoscope className="w-5 h-5" /> Expertos Verificados
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="hidden lg:block relative">
                        {/* Image background decoration */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 rounded-full blur-3xl -z-10"></div>

                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm transform rotate-2 hover:rotate-0 transition-all duration-700 ease-out-expo">
                            <img
                                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop"
                                alt="Medical Professional"
                                className="w-full h-auto object-cover"
                            />
                            {/* Floating Card */}
                            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow max-w-xs">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <CalendarClock className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Próximo Turno</p>
                                    <p className="text-sm font-bold text-slate-900">Mañana, 09:30 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Beneficios</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            ¿Por qué elegir MediBook?
                        </h2>
                        <p className="max-w-2xl mx-auto text-xl text-slate-600">
                            Descubre cómo estamos transformando la atención médica con tecnología simple y potente.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <CalendarClock className="w-8 h-8 text-blue-600" />,
                                title: "Agenda 24/7",
                                desc: "Reserva cuando quieras, desde donde quieras. Sin restricciones de horario ni esperas telefónicas.",
                                color: "blue"
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-teal-600" />,
                                title: "Datos Seguros",
                                desc: "Tu historial médico protegido con encriptación de grado bancario y máxima privacidad garantizada.",
                                color: "teal"
                            },
                            {
                                icon: <Stethoscope className="w-8 h-8 text-indigo-600" />,
                                title: "Amplia Red",
                                desc: "Accede a una red curada de especialistas verificados y calificados para tu total tranquilidad.",
                                color: "indigo"
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-slate-50 p-10 rounded-3xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-2xl transition-all group duration-300">
                                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Corporate Footer */}
            <footer className="bg-slate-900 text-slate-300 pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Stethoscope className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-bold text-white tracking-tight">MediBook</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                Cuidando tu salud desde 2026. Transformamos la experiencia médica para pacientes y profesionales.
                            </p>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Producto</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Turnos Online</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Historial Médico</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Para Médicos</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Portal Pacientes</a></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Legales</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Política de Privacidad</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Términos de Servicio</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookies</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Seguridad</a></li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Contacto</h4>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <Headphones className="w-5 h-5 text-blue-500" />
                                    <span>Soporte 24/7</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-blue-500" />
                                    <span>contacto@medibook.com</span>
                                </li>
                            </ul>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} MediBook Inc. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
