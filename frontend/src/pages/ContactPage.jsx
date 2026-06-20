import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { contactsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', phone: '', company: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await contactsAPI.submit(form);
      setSent(true);
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '', phone: '', company: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'alex@portfolio.com', href: 'mailto:alex@portfolio.com' },
    { icon: '📍', label: 'Location', value: 'San Francisco, CA' },
    { icon: '💼', label: 'LinkedIn', value: '/in/alexjohnson', href: 'https://linkedin.com' },
  ];

  return (
    <div className="section-padding pt-28" ref={ref}>
      <div className="container-max">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="tag mb-4 inline-block">Get in Touch</span>
          <h1 className="section-title gradient-text">Let's Work Together</h1>
          <p className="section-subtitle">Have a project in mind? I'd love to hear about it.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-white font-bold text-xl mb-6">Contact Information</h3>
              <div className="space-y-5">
                {contactInfo.map(info => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-xl">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-dark-500 text-xs">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-white hover:text-primary-400 transition-colors font-medium">{info.value}</a>
                      ) : (
                        <p className="text-white font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-white font-bold mb-4">Availability</h3>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="text-white font-medium">Available for new projects</p>
                  <p className="text-dark-400 text-sm">Typical response time: within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-primary-500/10 to-accent-violet/10 border-primary-500/20">
              <p className="text-dark-300 italic text-sm leading-relaxed">
                "Whether it's a startup MVP, an enterprise solution, or a complex AI system — I bring the same level of dedication and craftsmanship to every project."
              </p>
            </div>
          </motion.div>

          {/* Form side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {sent ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card text-center py-16">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-white font-bold text-2xl mb-2">Message Sent!</h3>
                <p className="text-dark-400 mb-6">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-outline">Send Another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="card space-y-5">
                <h3 className="text-white font-bold text-xl mb-2">Send a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-dark-400 text-xs font-medium block mb-1.5">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      placeholder="John Doe"
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="text-dark-400 text-xs font-medium block mb-1.5">Email *</label>
                    <input name="email" value={form.email} onChange={handleChange} required type="email"
                      placeholder="john@example.com"
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-sm transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-dark-400 text-xs font-medium block mb-1.5">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="text-dark-400 text-xs font-medium block mb-1.5">Company</label>
                    <input name="company" value={form.company} onChange={handleChange}
                      placeholder="Your company"
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-sm transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-dark-400 text-xs font-medium block mb-1.5">Subject *</label>
                  <input name="subject" value={form.subject} onChange={handleChange} required
                    placeholder="Project inquiry / Collaboration / etc."
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-sm transition-colors" />
                </div>

                <div>
                  <label className="text-dark-400 text-xs font-medium block mb-1.5">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="Tell me about your project, timeline, and budget..."
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-sm transition-colors resize-none" />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : 'Send Message →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
