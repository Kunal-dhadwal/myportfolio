import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { analyticsAPI } from '../../services/api';

function StatCard({ label, value, icon, color, to, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
    >
      <Link to={to} className="card flex items-center gap-4 hover:border-primary-500/40">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          {icon}
        </div>
        <div>
          <p className="text-dark-400 text-sm">{label}</p>
          <p className="text-white text-2xl font-bold">{value ?? '—'}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useSelector(s => s.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getDashboard()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { label: 'Projects', value: data.stats.projects, icon: '🚀', color: '#6366f1', to: '/admin/projects' },
    { label: 'Experiences', value: data.stats.experiences, icon: '💼', color: '#8b5cf6', to: '/admin/experiences' },
    { label: 'Education', value: data.stats.education, icon: '🎓', color: '#06b6d4', to: '/admin/education' },
    { label: 'Skills', value: data.stats.skills, icon: '⚡', color: '#f59e0b', to: '/admin/skills' },
    { label: 'Certificates', value: data.stats.certificates, icon: '🏆', color: '#10b981', to: '/admin/certificates' },
    { label: 'Messages', value: data.stats.contacts, icon: '✉️', color: '#ec4899', to: '/admin/contacts' },
  ] : [];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white font-display">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-dark-400 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : (
        <>
          {/* New contacts alert */}
          {data?.stats.newContacts > 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 rounded-xl bg-primary-500/10 border border-primary-500/30 flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <p className="text-white font-semibold">{data.stats.newContacts} new message{data.stats.newContacts !== 1 ? 's' : ''}</p>
                <Link to="/admin/contacts" className="text-primary-400 text-sm hover:underline">View messages →</Link>
              </div>
            </motion.div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {stats.map((stat, i) => <StatCard key={stat.label} {...stat} index={i} />)}
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top projects */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold">Top Projects by Views</h2>
                <Link to="/admin/projects" className="text-primary-400 text-sm">View all →</Link>
              </div>
              <div className="space-y-3">
                {data?.topProjects?.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-3">
                    <span className="text-dark-600 font-mono text-sm w-4">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{p.title}</p>
                      <p className="text-dark-500 text-xs">{p.category}</p>
                    </div>
                    <span className="text-dark-400 text-sm font-mono">{p.views} views</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent contacts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold">Recent Messages</h2>
                <Link to="/admin/contacts" className="text-primary-400 text-sm">View all →</Link>
              </div>
              <div className="space-y-3">
                {data?.recentContacts?.map(c => (
                  <div key={c._id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-bold shrink-0">
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{c.name}</p>
                      <p className="text-dark-500 text-xs truncate">{c.subject}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      c.status === 'new' ? 'bg-primary-500/20 text-primary-400' :
                      c.status === 'replied' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-dark-700 text-dark-400'
                    }`}>{c.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Projects by category */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
              <h2 className="text-white font-bold mb-4">Projects by Category</h2>
              <div className="space-y-3">
                {data?.projectsByCategory?.map(c => (
                  <div key={c._id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-dark-300">{c._id}</span>
                        <span className="text-dark-400">{c.count}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(c.count / (data.stats.projects || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card">
              <h2 className="text-white font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Project', to: '/admin/projects', icon: '🚀' },
                  { label: 'Edit Profile', to: '/admin/profile', icon: '👤' },
                  { label: 'Add Certificate', to: '/admin/certificates', icon: '🏆' },
                  { label: 'Add Skill', to: '/admin/skills', icon: '⚡' },
                ].map(action => (
                  <Link key={action.label} to={action.to}
                    className="flex items-center gap-2 p-3 rounded-xl bg-dark-800 hover:bg-primary-500/10 border border-dark-700 hover:border-primary-500/30 transition-all text-dark-300 hover:text-white text-sm">
                    <span>{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
