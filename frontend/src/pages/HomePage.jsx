import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { profileAPI, skillsAPI, experiencesAPI, educationAPI } from '../services/api';
import { portfolioActions } from '../store';

// ─── Particle Background ─────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
      });
      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="particles-canvas" />;
}

// ─── Hero Section ────────────────────────────────────────────
function HeroSection({ profile }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const typingSequence = profile?.typingTexts?.length
    ? profile.typingTexts.flatMap(t => [t, 1000])
    : ['Full Stack Developer', 1000, 'AI Engineer', 1000, 'DevOps Enthusiast', 1000, 'React Developer', 1000, 'Node.js Developer', 1000, 'Python Developer', 1000];
  console.log(typingSequence);
  
    return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      <ParticleCanvas />
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-violet/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-3xl" />

      <motion.div style={{ y }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/30 text-primary-300 text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {profile?.isAvailableForWork ? 'Available for work' : 'Currently employed'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 font-display"
        >
          Hi, I'm{' '}
          <span className="gradient-text block sm:inline">
            {profile?.name || 'Kunal Dhadwal'}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl sm:text-3xl text-dark-300 mb-4 h-10"
        >
          {typingSequence?.length > 0 && (
            <TypeAnimation
              key={JSON.stringify(typingSequence)}
              sequence={typingSequence}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-primary-400 font-semibold"
            />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-dark-400 text-lg max-w-2xl mx-auto mb-10"
        >
          {profile?.tagline || 'Building the future, one line of code at a time.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/projects" className="btn-primary">
            View Projects →
          </Link>
          {profile?.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Download Resume ↓
            </a>
          )}
          <Link to="/contact" className="btn-outline">
            Contact Me
          </Link>
        </motion.div>

        {/* Social links */}
        {profile?.socialLinks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-4 mt-10"
          >
            {Object.entries(profile.socialLinks).filter(([, v]) => v).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass border border-primary-500/20 flex items-center justify-center text-dark-400 hover:text-primary-400 hover:border-primary-400/40 transition-all duration-200 hover:scale-110 capitalize text-xs font-medium"
              >
                {platform.slice(0, 2).toUpperCase()}
              </a>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-500"
      >
        <span className="text-xs">Scroll</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-primary-500 to-transparent" />
      </motion.div>
    </section>
  );
}

// ─── About Section ───────────────────────────────────────────
function AboutSection({ profile, skills, skillsGrouped }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">About Me</span>
          <h2 className="section-title gradient-text">The Person Behind the Code</h2>
          <p className="section-subtitle">{profile?.bio || 'Passionate about building scalable, impactful software solutions.'}</p>
        </motion.div>

        {/* Skills by category */}
        <div className="space-y-10">
          {Object.entries(skillsGrouped || {}).map(([category, categorySkills], ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: ci * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill, si) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: (ci * 0.1) + (si * 0.05) }}
                    className="card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{skill.name}</span>
                      <span className="text-primary-400 text-sm font-mono">{skill.proficiency}%</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                        transition={{ duration: 1.5, delay: (ci * 0.1) + (si * 0.05) + 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Projects Preview ───────────────────────────────
function FeaturedProjects({ projects }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const featured = projects.filter(p => p.featured).slice(0, 3);

  return (
    <section className="section-padding" ref={ref}>
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="tag mb-4 inline-block">Featured Work</span>
          <h2 className="section-title gradient-text">Projects That Define Me</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="card group cursor-pointer"
            >
              {project.images?.[0]?.url && (
                <div className="overflow-hidden rounded-xl mb-4 aspect-video">
                  <img
                    src={project.images[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="tag text-xs">{project.category}</span>
                {project.status === 'in-progress' && (
                  <span className="tag text-xs" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}>
                    In Progress
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-primary-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-dark-400 text-sm mb-4 line-clamp-2">{project.shortDescription || project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack?.slice(0, 4).map(tech => (
                  <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-dark-800 text-dark-300">{tech}</span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="text-dark-400 hover:text-white text-sm transition-colors" onClick={e => e.stopPropagation()}>
                    GitHub →
                  </a>
                )}
                {project.liveDemoUrl && (
                  <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm transition-colors" onClick={e => e.stopPropagation()}>
                    Live Demo ↗
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link to="/projects" className="btn-outline">
            View All Projects →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Intro Video Section ──────────────────────────────────────
function VideoSection({ profile }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  if (!profile?.introVideoUrl) return null;

  return (
    <section className="section-padding bg-dark-900/50" ref={ref}>
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="tag mb-4 inline-block">Intro Video</span>
          <h2 className="section-title gradient-text">See Me in Action</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-primary-500/20 glow-primary"
        >
          {profile.introVideoType === 'youtube' ? (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${profile.introVideoUrl}`}
                className="w-full h-full"
                allowFullScreen
                title="Intro video"
              />
            </div>
          ) : (
            <video src={profile.introVideoUrl} controls className="w-full" />
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats Section ────────────────────────────────────────────
function StatsSection({ experiences, projects, certificates }) {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  const stats = [
    { label: 'Years of Experience', value: `${experiences?.length ? '5+' : '3+'}` },
    { label: 'Projects Completed', value: `${projects?.length || 0}+` },
    { label: 'Certifications', value: `${certificates?.length || 0}` },
    { label: 'Technologies', value: '20+' },
      ];

  return (
    <section className="py-16 border-y border-primary-500/10" ref={ref}>
      <div className="container-max px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold gradient-text font-display">{stat.value}</div>
              <div className="text-dark-400 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main HomePage ────────────────────────────────────────────
export default function HomePage() {
  const dispatch = useDispatch();
  const { profile, projects, skills, skillsGrouped, experiences, certificates } = useSelector(s => s.portfolio);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, prRes, sRes, eRes, cRes] = await Promise.all([
          profileAPI.get(),
          profileAPI.get(), // reuse; swap for projects
          skillsAPI.getAll(),
          experiencesAPI.getAll(),
          profileAPI.get(), // placeholder
        ]);
        dispatch(portfolioActions.setProfile(pRes.data.profile));
        dispatch(portfolioActions.setSkills({ skills: sRes.data.skills, grouped: sRes.data.grouped }));
        dispatch(portfolioActions.setExperiences(eRes.data.experiences));
      } catch (err) {
        console.error('Failed to fetch portfolio data:', err.message);
      }
    };

    if (!profile) fetchAll();
  }, [dispatch, profile]);

  return (
    <div>
      <HeroSection profile={profile} />
      <StatsSection experiences={experiences} projects={projects} certificates={certificates} />
      <AboutSection profile={profile} skills={skills} skillsGrouped={skillsGrouped} />
      <FeaturedProjects projects={projects} />
      <VideoSection profile={profile} />
    </div>
  );
}
