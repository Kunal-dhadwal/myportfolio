import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/profile', label: 'Profile', icon: '👤' },
  { path: '/admin/projects', label: 'Projects', icon: '🚀' },
  { path: '/admin/experiences', label: 'Experience', icon: '💼' },
  { path: '/admin/education', label: 'Education', icon: '🎓' },
  { path: '/admin/skills', label: 'Skills', icon: '⚡' },
  { path: '/admin/certificates', label: 'Certificates', icon: '🏆' },
  { path: '/admin/contacts', label: 'Contacts', icon: '✉️' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector(s => s.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 z-40 w-64 glass-dark border-r border-primary-500/10 flex flex-col"
          >
            {/* Brand */}
            <div className="p-6 border-b border-primary-500/10">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center text-white font-bold text-sm">AJ</div>
                <div>
                  <p className="text-white font-semibold text-sm">{user?.name || 'Admin'}</p>
                  <p className="text-dark-400 text-xs">Administrator</p>
                </div>
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-primary-500/10 space-y-2">
              <Link to="/" className="nav-link">
                <span>🌐</span>
                <span className="text-sm">View Portfolio</span>
              </Link>
              <button onClick={handleLogout} className="nav-link w-full text-red-400 hover:bg-red-500/10">
                <span>🚪</span>
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-dark border-b border-primary-500/10 h-16 flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1 rounded-lg hover:bg-white/5"
          >
            {[0, 1, 2].map(i => (
              <span key={i} className="w-4 h-0.5 bg-dark-300 rounded" />
            ))}
          </button>

          <div className="flex-1">
            <h2 className="text-white font-semibold capitalize">
              {navItems.find(n => n.path === location.pathname)?.label || 'Admin Panel'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="p-6 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
