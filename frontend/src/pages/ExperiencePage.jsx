import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { experiencesAPI, educationAPI } from '../services/api';
import { portfolioActions } from '../store';

function ExperienceCard({ exp, index }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative pl-16"
    >
      {/* Timeline dot */}
      <div className="absolute left-6 top-6 timeline-dot z-10" />

      <div className="card group">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {exp.companyLogo ? (
            <img src={exp.companyLogo} alt={exp.companyName} className="w-12 h-12 rounded-xl object-contain bg-dark-700 p-1" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-violet/20 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-lg">
              {exp.companyName[0]}
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-bold text-xl group-hover:text-primary-400 transition-colors">{exp.jobRole}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {exp.companyWebsite ? (
                    <a href={exp.companyWebsite} target="_blank" rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 font-semibold">{exp.companyName}</a>
                  ) : (
                    <span className="text-primary-400 font-semibold">{exp.companyName}</span>
                  )}
                  <span className="text-dark-600">·</span>
                  <span className="text-dark-400 text-sm">{exp.jobType}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-dark-300 text-sm font-mono">
                  {formatDate(exp.startDate)} — {exp.isCurrent ? <span className="text-emerald-400">Present</span> : formatDate(exp.endDate)}
                </div>
                {exp.totalDuration && (
                  <div className="text-dark-500 text-xs mt-0.5">{exp.totalDuration}</div>
                )}
              </div>
            </div>
            {exp.location && <p className="text-dark-500 text-sm mt-1">📍 {exp.location}</p>}
          </div>
        </div>

        {/* Responsibilities */}
        {exp.responsibilities?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-dark-300 text-xs font-semibold uppercase tracking-widest mb-2">Responsibilities</h4>
            <ul className="space-y-1.5">
              {exp.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-dark-400 text-sm">
                  <span className="text-primary-500 mt-1 shrink-0">▸</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {exp.achievements?.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
            <h4 className="text-primary-400 text-xs font-semibold uppercase tracking-widest mb-2">🏆 Achievements</h4>
            <ul className="space-y-1">
              {exp.achievements.map((a, i) => (
                <li key={i} className="text-dark-300 text-sm">✓ {a}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech stack */}
        {exp.technologiesUsed?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {exp.technologiesUsed.map(tech => (
              <span key={tech} className="tag text-xs">{tech}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EducationCard({ edu, index }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const formatDate = (d) => d ? new Date(d).getFullYear() : 'Present';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-16"
    >
      <div className="absolute left-6 top-6 w-4 h-4 rounded-full border-2 border-accent-cyan bg-dark-950 z-10" style={{ boxShadow: '0 0 15px rgba(6,182,212,0.6)' }} />
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-primary-500/20 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan font-bold">
            🎓
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-bold text-lg">{edu.degree}</h3>
                <p className="text-accent-cyan font-semibold">{edu.institution}</p>
                {edu.fieldOfStudy && <p className="text-dark-400 text-sm">{edu.fieldOfStudy}</p>}
              </div>
              <div className="text-right text-sm font-mono text-dark-400">
                {formatDate(edu.startDate)} — {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
              </div>
            </div>
            {edu.grade && <p className="text-dark-300 text-sm mt-2">GPA / Grade: <span className="text-white font-semibold">{edu.grade}</span></p>}
            {edu.achievements?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {edu.achievements.map((a, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-dark-800 text-dark-300 border border-dark-700">{a}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperiencePage() {
  const dispatch = useDispatch();
  const { experiences, education } = useSelector(s => s.portfolio);

  useEffect(() => {
    const load = async () => {
      try {
        const [eRes, edRes] = await Promise.all([
          experiencesAPI.getAll(),
          educationAPI.getAll(),
        ]);
        dispatch(portfolioActions.setExperiences(eRes.data.experiences));
        dispatch(portfolioActions.setEducation(edRes.data.education));
      } catch (err) { console.error(err); }
    };
    if (!experiences?.length) load();
  }, [dispatch, experiences]);

  return (
    <div className="section-padding pt-28">
      <div className="container-max">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="tag mb-4 inline-block">Career</span>
          <h1 className="section-title gradient-text">Experience & Education</h1>
          <p className="section-subtitle">My professional journey and academic background</p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="gradient-text">💼</span> Work Experience
          </h2>
          <div className="relative">
            <div className="timeline-line" />
            <div className="space-y-8">
              {experiences?.map((exp, i) => (
                <ExperienceCard key={exp._id} exp={exp} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Education Timeline */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span>🎓</span> Education
          </h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg, #06b6d4, transparent)' }} />
            <div className="space-y-8">
              {education?.map((edu, i) => (
                <EducationCard key={edu._id} edu={edu} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
