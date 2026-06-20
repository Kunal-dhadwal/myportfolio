import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI } from '../services/api';
import { portfolioActions } from '../store';

const CATEGORIES = ['All', 'AI', 'Web Development', 'Full Stack', 'DevOps', 'Mobile', 'Open Source', 'Other'];

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="card group"
    >
      {/* Image carousel */}
      {project.images?.length > 0 && (
        <div className="relative overflow-hidden rounded-xl mb-4 aspect-video">
          <img
            src={project.images[imgIdx]?.url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {project.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {project.images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-primary-400' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              project.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-dark-700 text-dark-300'
            }`}>
              {project.status}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <span className="tag">{project.category}</span>
        {project.subCategory && <span className="text-dark-500 text-xs">/ {project.subCategory}</span>}
        {project.featured && <span className="text-amber-400 text-sm">★</span>}
      </div>

      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-primary-400 transition-colors">
        {project.title}
      </h3>

      <p className={`text-dark-400 text-sm mb-4 ${expanded ? '' : 'line-clamp-2'}`}>
        {project.description}
      </p>

      {project.description.length > 150 && (
        <button onClick={() => setExpanded(!expanded)} className="text-primary-400 text-xs mb-3">
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack?.map(tech => (
          <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-dark-800 text-dark-300 border border-dark-700">
            {tech}
          </span>
        ))}
      </div>

      {/* Timeline */}
      {project.timeline?.startDate && (
        <p className="text-dark-500 text-xs mb-4">
          {new Date(project.timeline.startDate).getFullYear()}
          {project.timeline.endDate && ` – ${new Date(project.timeline.endDate).getFullYear()}`}
        </p>
      )}

      {/* Links */}
      <div className="flex items-center gap-4 pt-3 border-t border-dark-800">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-dark-400 hover:text-white text-sm transition-colors">
            <span>⌥</span> GitHub
          </a>
        )}
        {project.liveDemoUrl && (
          <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm transition-colors">
            <span>↗</span> Live Demo
          </a>
        )}
        {project.videoUrl && (
          <a href={project.videoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-accent-cyan hover:text-white text-sm transition-colors">
            <span>▶</span> Video
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { groupedProjects } = useSelector(s => s.portfolio);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await projectsAPI.getAll();
        setAllProjects(res.data.projects);
        dispatch(portfolioActions.setProjects(res.data.projects));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dispatch]);

  const filtered = allProjects.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="section-padding pt-28">
      <div className="container-max">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="tag mb-4 inline-block">Portfolio</span>
          <h1 className="section-title gradient-text">My Projects</h1>
          <p className="section-subtitle">A collection of projects across AI, web development, DevOps, and more</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-colors"
          />
        </motion.div>

        {/* Category filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white border border-dark-700'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1 text-xs opacity-60">
                  ({allProjects.filter(p => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <p className="text-dark-500 text-sm mb-6">{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</p>
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project, i) => (
                  <ProjectCard key={project._id} project={project} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="text-dark-500 text-lg">No projects found</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
