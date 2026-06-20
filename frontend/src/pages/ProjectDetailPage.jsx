import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { projectsAPI } from "../services/api";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    projectsAPI.getOne(slug)
      .then((r) => setProject(r.data.data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-6xl">🔍</div>
      <h2 className="text-2xl font-bold text-white">Project not found</h2>
      <Link to="/projects" className="text-primary-400 hover:underline">← Back to Projects</Link>
    </div>
  );

  const images = project.images || [];
  const allImages = project.thumbnail ? [project.thumbnail, ...images] : images;

  return (
    <>
      <Helmet>
        <title>{project.title} – Portfolio</title>
        <meta name="description" content={project.description?.slice(0, 160)} />
      </Helmet>

      {/* Hero */}
      <section className="pt-24 pb-12 px-4">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition text-sm">
              ← Back to Projects
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="tag">{project.category}</span>
              {project.status && (
                <span className={`text-xs px-3 py-1 rounded-full border ${
                  project.status === "completed" ? "bg-green-500/10 text-green-400 border-green-500/30" :
                  project.status === "in-progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                  "bg-gray-500/10 text-gray-400 border-gray-500/30"
                }`}>{project.status}</span>
              )}
              {project.featured && (
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">⭐ Featured</span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{project.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-8">
              {project.timeline && <span>📅 {project.timeline}</span>}
              {project.views > 0 && <span>👁️ {project.views} views</span>}
              {project.likes > 0 && <span>❤️ {project.likes} likes</span>}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              {project.liveDemoUrl && (
                <a href={project.liveDemoUrl} target="_blank" rel="noreferrer"
                  className="btn-primary flex items-center gap-2">
                  🚀 Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer"
                  className="btn-outline flex items-center gap-2">
                  🐙 View Source
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery */}
      {allImages.length > 0 && (
        <section className="px-4 mb-12">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Main image */}
              <div
                className="relative rounded-2xl overflow-hidden cursor-zoom-in bg-dark-800 mb-4"
                style={{ maxHeight: 500 }}
                onClick={() => setLightbox(true)}
              >
                <img
                  src={allImages[activeImg]}
                  alt={`${project.title} screenshot ${activeImg + 1}`}
                  className="w-full object-cover"
                  style={{ maxHeight: 500 }}
                />
                <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {activeImg + 1} / {allImages.length}
                </div>
              </div>
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                        activeImg === i ? "border-primary-500" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="px-4 mb-16">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-dark rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">About this project</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{project.description}</p>
              </motion.div>

              {/* Video */}
              {project.videoUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-dark rounded-2xl p-6"
                >
                  <h2 className="text-xl font-bold text-white mb-4">📹 Demo Video</h2>
                  <div className="relative pb-[56.25%] rounded-xl overflow-hidden bg-dark-900">
                    {project.videoUrl.includes("youtube") || project.videoUrl.includes("youtu.be") ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={project.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        title="Demo video"
                      />
                    ) : (
                      <video
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                        src={project.videoUrl}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech Stack */}
              {project.techStack?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-dark rounded-2xl p-5"
                >
                  <h3 className="font-semibold text-white mb-3">🛠️ Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((t) => (
                      <span key={t} className="tag text-sm">{t}</span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-dark rounded-2xl p-5 space-y-3"
              >
                <h3 className="font-semibold text-white mb-1">📋 Project Info</h3>
                {[
                  project.timeline && ["Timeline", project.timeline],
                  project.category && ["Category", project.category],
                  project.status && ["Status", project.status],
                ].filter(Boolean).map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-white capitalize">{value}</span>
                  </div>
                ))}
              </motion.div>

              {/* Links */}
              {(project.githubUrl || project.liveDemoUrl) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-dark rounded-2xl p-5 space-y-2"
                >
                  <h3 className="font-semibold text-white mb-1">🔗 Links</h3>
                  {project.liveDemoUrl && (
                    <a href={project.liveDemoUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition">
                      🚀 Live Demo ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
                      🐙 GitHub Repository ↗
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={allImages[activeImg]}
              alt=""
              className="max-w-full max-h-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >✕</button>
            {allImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300"
                  onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + allImages.length) % allImages.length); }}
                >‹</button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300"
                  onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % allImages.length); }}
                >›</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
