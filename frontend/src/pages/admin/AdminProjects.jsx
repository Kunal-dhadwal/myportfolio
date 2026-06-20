import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { projectsAPI } from '../../services/api';
import AdminCRUDPage from '../../components/admin/AdminCRUDPage';

const CATEGORIES = ['AI', 'Web Development', 'Full Stack', 'DevOps', 'Mobile', 'Open Source', 'Other'];
const STATUSES = ['completed', 'in-progress', 'planned'];

function ProjectForm({ initialData, onSuccess }) {
  const [form, setForm] = useState({
    title: '', shortDescription: '', description: '',
    category: 'Web Development', subCategory: '',
    images: [], videoUrl: '', videoType: 'youtube',
    githubUrl: '', liveDemoUrl: '',
    techStack: '', // comma-separated
    startDate: '', endDate: '',
    status: 'completed', featured: false, order: 0, isPublished: true,
    ...initialData,
    techStack: initialData?.techStack?.join(', ') || '',
    startDate: initialData?.timeline?.startDate ? initialData.timeline.startDate.substring(0, 10) : '',
    endDate: initialData?.timeline?.endDate ? initialData.timeline.endDate.substring(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
        timeline: { startDate: form.startDate || undefined, endDate: form.endDate || undefined },
      };
      delete payload.startDate; delete payload.endDate;

      if (initialData?._id) {
        await projectsAPI.update(initialData._id, payload);
        toast.success('Project updated!');
      } else {
        await projectsAPI.create(payload);
        toast.success('Project created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none text-sm transition-colors";
  const labelClass = "text-dark-400 text-xs font-semibold block mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Title *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} required className={inputClass} placeholder="Project title" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Sub-Category</label>
          <input value={form.subCategory} onChange={e => set('subCategory', e.target.value)} className={inputClass} placeholder="e.g. AI Website" />
        </div>
      </div>
      <div>
        <label className={labelClass}>Short Description</label>
        <input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} className={inputClass} placeholder="One-liner summary" />
      </div>
      <div>
        <label className={labelClass}>Description *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={4} className={inputClass} placeholder="Full description..." />
      </div>
      <div>
        <label className={labelClass}>Tech Stack (comma-separated)</label>
        <input value={form.techStack} onChange={e => set('techStack', e.target.value)} className={inputClass} placeholder="React, Node.js, MongoDB" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>GitHub URL</label>
          <input value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} className={inputClass} placeholder="https://github.com/..." />
        </div>
        <div>
          <label className={labelClass}>Live Demo URL</label>
          <input value={form.liveDemoUrl} onChange={e => set('liveDemoUrl', e.target.value)} className={inputClass} placeholder="https://..." />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Video URL</label>
          <input value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} className={inputClass} placeholder="YouTube ID or URL" />
        </div>
        <div>
          <label className={labelClass}>Video Type</label>
          <select value={form.videoType} onChange={e => set('videoType', e.target.value)} className={inputClass}>
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="upload">Upload</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Start Date</label>
          <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} className={inputClass}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Order</label>
          <input type="number" value={form.order} onChange={e => set('order', +e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="rounded" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
          <input type="checkbox" checked={form.isPublished} onChange={e => set('isPublished', e.target.checked)} className="rounded" />
          Published
        </label>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
        {loading ? 'Saving...' : (initialData ? 'Update Project' : 'Create Project')}
      </button>
    </form>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await projectsAPI.getAllAdmin();
      setProjects(res.data.projects);
    } catch (err) { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await projectsAPI.delete(id);
    setProjects(p => p.filter(x => x._id !== id));
  };

  const columns = [
    { key: 'title', label: 'Title', render: p => <span className="font-medium text-white">{p.title}</span> },
    { key: 'category', label: 'Category', render: p => <span className="tag text-xs">{p.category}</span> },
    { key: 'status', label: 'Status', render: p => (
      <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
        {p.status}
      </span>
    )},
    { key: 'featured', label: 'Featured', render: p => p.featured ? <span className="text-amber-400">★</span> : <span className="text-dark-600">—</span> },
    { key: 'views', label: 'Views', render: p => <span className="text-dark-400 font-mono">{p.views}</span> },
    { key: 'isPublished', label: 'Published', render: p => (
      <span className={`w-2 h-2 rounded-full inline-block ${p.isPublished ? 'bg-emerald-400' : 'bg-dark-600'}`} />
    )},
  ];

  const FormWithRefresh = (props) => (
    <ProjectForm {...props} onSuccess={() => { props.onSuccess(); load(); }} />
  );

  return (
    <AdminCRUDPage
      title="Projects"
      addButtonLabel="Add Project"
      items={projects}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      FormComponent={FormWithRefresh}
      formTitle="Add Project"
    />
  );
}
