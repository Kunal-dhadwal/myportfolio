import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { certificatesAPI } from '../services/api';
import { portfolioActions } from '../store';

function CertCard({ cert, index }) {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateY: 10 }}
      animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card group overflow-hidden"
    >
      {/* Certificate Image */}
      {cert.image ? (
        <div className="overflow-hidden rounded-xl mb-4 aspect-[4/3] bg-dark-800">
          <img src={cert.image} alt={cert.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
      ) : (
        <div className="rounded-xl mb-4 aspect-[4/3] bg-gradient-to-br from-primary-500/10 to-accent-violet/10 border border-primary-500/20 flex items-center justify-center">
          <span className="text-5xl">🏆</span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        {cert.organizationLogo && (
          <img src={cert.organizationLogo} alt={cert.organization} className="w-8 h-8 rounded-lg object-contain" />
        )}
        <div>
          <h3 className="text-white font-bold leading-tight group-hover:text-primary-400 transition-colors">{cert.name}</h3>
          <p className="text-primary-400 text-sm font-medium">{cert.organization}</p>
        </div>
      </div>

      {cert.description && <p className="text-dark-400 text-sm mb-3 line-clamp-2">{cert.description}</p>}

      <div className="flex items-center justify-between text-xs text-dark-500 mb-3">
        <span>{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}</span>
        {!cert.doesNotExpire && cert.expiryDate && (
          <span>Expires: {new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        )}
        {cert.doesNotExpire && <span className="text-emerald-400">No Expiry</span>}
      </div>

      {cert.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {cert.skills.slice(0, 4).map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-dark-800 text-dark-400">{s}</span>
          ))}
        </div>
      )}

      {cert.verificationUrl && (
        <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
          ✓ Verify Certificate ↗
        </a>
      )}
      {cert.credentialId && (
        <p className="text-dark-600 text-xs mt-1 font-mono">ID: {cert.credentialId}</p>
      )}
    </motion.div>
  );
}

export default function CertificatesPage() {
  const dispatch = useDispatch();
  const { certificates } = useSelector(s => s.portfolio);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await certificatesAPI.getAll();
        dispatch(portfolioActions.setCertificates(res.data.certificates));
      } catch (err) { console.error(err); }
    };
    if (!certificates?.length) load();
  }, [dispatch, certificates]);

  return (
    <div className="section-padding pt-28">
      <div className="container-max">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="tag mb-4 inline-block">Credentials</span>
          <h1 className="section-title gradient-text">Certifications</h1>
          <p className="section-subtitle">Professional certifications validating my expertise</p>
        </motion.div>

        {certificates?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <CertCard key={cert._id} cert={cert} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-dark-500">
            <div className="text-6xl mb-4">🏆</div>
            <p>Certificates coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
