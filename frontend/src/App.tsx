import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { Layout } from './components/Layout';
import { AppointmentList } from './components/AppointmentList';
import { PatientManager } from './components/PatientManager';
import { Settings } from './components/Settings';
import AuthService from './services/AuthService';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'PATIENT') {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (userRole === 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient Routes */}
      <Route
        path="/patient-dashboard"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/appointments" element={<AppointmentList />} />
        <Route path="/dashboard/patients" element={<PatientManager />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch all - redirect based on role or to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
