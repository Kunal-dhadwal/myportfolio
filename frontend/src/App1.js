import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { store, loadUser } from './store';
import './styles/globals.css';

// Public pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ExperiencePage from './pages/ExperiencePage';
import CertificatesPage from './pages/CertificatesPage';
import ContactPage from './pages/ContactPage';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProjects from './pages/admin/AdminProjects';
import AdminExperiences from './pages/admin/AdminExperiences';
import AdminEducation from './pages/admin/AdminEducation';
import AdminSkills from './pages/admin/AdminSkills';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminContacts from './pages/admin/AdminContacts';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';

// Layout
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import LoadingScreen from './components/common/LoadingScreen';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) dispatch(loadUser());
  }, [dispatch, token]);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="experiences" element={<AdminExperiences />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#14152c',
                color: '#e8e9f0',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#14152c' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#14152c' } },
            }}
          />
        </Router>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
