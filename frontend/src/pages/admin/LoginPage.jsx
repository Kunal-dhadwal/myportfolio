import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginAdmin, clearError } from '../../store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(s => s.auth);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, []);  // eslint-disable-line

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await dispatch(loginAdmin(form)).unwrap();
      toast.success('Welcome back!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 bg-grid">
      {/* Background orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="glass-dark rounded-2xl p-8 border border-primary-500/20 shadow-2xl shadow-primary-900/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/40 animate-glow">
              AJ
            </div>
            <h1 className="text-2xl font-bold text-white font-display">Admin Login</h1>
            <p className="text-dark-400 text-sm mt-1">Portfolio Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-dark-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                placeholder="admin@portfolio.com"
                className="w-full bg-dark-800/80 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-dark-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="w-full bg-dark-800/80 border border-dark-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors text-xs"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-800 text-center">
            <Link to="/" className="text-dark-500 hover:text-primary-400 text-sm transition-colors">
              ← Back to Portfolio
            </Link>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 rounded-xl bg-dark-800/50 border border-dark-700">
            <p className="text-dark-500 text-xs text-center">
              Demo: admin@portfolio.com / Admin@123456
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
