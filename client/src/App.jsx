import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Media from './pages/Media';
import Guide from './pages/Guide';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/welcome" element={<LandingPage />} />

          {/* Protected Routes (Wrapped in ProtectedRoute and AppLayout) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="media" element={<Media />} />
              <Route path="achievements" element={<Stats />} />
              <Route path="guide" element={<Guide />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="stats" element={<Navigate to="/achievements" replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
