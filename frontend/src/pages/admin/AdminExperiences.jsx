import React, { useState, useEffect, useCallback } from "react";
import AdminCRUDPage from "../../components/admin/AdminCRUDPage";
import { experiencesAPI } from "../../services/api";
import toast from "react-hot-toast";

const TECH_OPTIONS = [
  "React","Node.js","Python","AWS","Docker","Kubernetes","MongoDB","PostgreSQL",
  "TypeScript","GraphQL","Redis","Terraform","Jenkins","Go","Java","Spring Boot",
];

const ExperienceForm = ({ initialData, onSuccess }) => {
  const [form, setForm] = useState({
    companyName: "", jobRole: "", jobType: "Full-time", location: "",
    startDate: "", endDate: "", isCurrent: false, companyLogo: "",
    responsibilities: [""], achievements: [], technologiesUsed: [],
    order: 0, isPublished: true,
    ...(initialData || {}),
    startDate: initialData?.startDate ? initialData.startDate.slice(0, 10) : (initialData?.timeline?.startDate ? initialData.timeline.startDate.slice(0,10) : ""),
    endDate: initialData?.endDate ? initialData.endDate.slice(0, 10) : (initialData?.timeline?.endDate ? initialData.timeline.endDate.slice(0,10) : ""),
  });
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addTech = (tech) => {
    const current = form.technologiesUsed || [];
    if (!current.includes(tech)) set('technologiesUsed', [...current, tech]);
  };
  const removeTech = (tech) => set('technologiesUsed', (form.technologiesUsed || []).filter((t) => t !== tech));

  const handleResponsibility = (i, val) => {
    const arr = [...(form.responsibilities || [])];
    arr[i] = val;
    set('responsibilities', arr);
  };
  const addResponsibility = () => set('responsibilities', [...(form.responsibilities || []), ""]);
  const removeResponsibility = (i) => set('responsibilities', (form.responsibilities || []).filter((_, idx) => idx !== i));

  const handleAchievement = (i, val) => {
    const arr = [...(form.achievements || [])];
    arr[i] = val;
    set('achievements', arr);
  };
  const addAchievement = () => set('achievements', [...(form.achievements || []), ""]);
  const removeAchievement = (i) => set('achievements', (form.achievements || []).filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (initialData?._id) {
        await experiencesAPI.update(initialData._id, payload);
        toast.success('Experience updated!');
      } else {
        await experiencesAPI.create(payload);
        toast.success('Experience created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Company Name *</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.companyName || ""}
            onChange={(e) => set('companyName', e.target.value)}
            placeholder="e.g. Google"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Job Role *</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.jobRole || ""}
            onChange={(e) => set('jobRole', e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Job Type</label>
          <select
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.jobType || "Full-time"}
            onChange={(e) => set('jobType', e.target.value)}
          >
            {["Full-time","Part-time","Contract","Internship","Freelance"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Location</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.location || ""}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. San Francisco, CA"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Start Date *</label>
          <input
            type="date"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.startDate ? form.startDate.slice(0, 10) : ""}
            onChange={(e) => set('startDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">End Date</label>
          <input
            type="date"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.endDate ? form.endDate.slice(0, 10) : ""}
            onChange={(e) => set('endDate', e.target.value)}
            disabled={form.isCurrent}
          />
          <label className="flex items-center gap-2 mt-1 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isCurrent || false}
              onChange={(e) => {
                set('isCurrent', e.target.checked);
                if (e.target.checked) set('endDate', '');
              }}
              className="accent-primary-500"
            />
            Currently working here
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Company Logo URL</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={form.companyLogo || ""}
          onChange={(e) => set('companyLogo', e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* Responsibilities */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">Responsibilities</label>
          <button
            type="button"
            onClick={addResponsibility}
            className="text-xs text-primary-400 hover:text-primary-300"
          >+ Add</button>
        </div>
        {(form.responsibilities || []).map((r, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none text-sm"
              value={r}
              onChange={(e) => handleResponsibility(i, e.target.value)}
              placeholder={`Responsibility ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => removeResponsibility(i)}
              className="text-red-400 hover:text-red-300 px-2"
            >✕</button>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">Achievements</label>
          <button
            type="button"
            onClick={addAchievement}
            className="text-xs text-primary-400 hover:text-primary-300"
          >+ Add</button>
        </div>
        {(form.achievements || []).map((a, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none text-sm"
              value={a}
              onChange={(e) => handleAchievement(i, e.target.value)}
              placeholder={`Achievement ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => removeAchievement(i)}
              className="text-red-400 hover:text-red-300 px-2"
            >✕</button>
          </div>
        ))}
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Technologies Used</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(form.technologiesUsed || []).map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full text-xs"
            >
              {t}
              <button type="button" onClick={() => removeTech(t)} className="hover:text-white">✕</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {TECH_OPTIONS.filter((t) => !(form.technologiesUsed || []).includes(t)).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => addTech(t)}
              className="text-xs bg-dark-700 text-gray-400 hover:bg-dark-600 px-2 py-1 rounded-full"
            >{t}</button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none text-sm"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); if (techInput.trim()) { addTech(techInput.trim()); setTechInput(""); } }
            }}
            placeholder="Custom technology (press Enter)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Display Order</label>
          <input
            type="number"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.order ?? 0}
            onChange={(e) => set('order', Number(e.target.value))}
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished ?? true}
              onChange={(e) => set('isPublished', e.target.checked)}
              className="accent-primary-500"
            />
            Published
          </label>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
        {loading ? 'Saving...' : (initialData ? 'Update Experience' : 'Create Experience')}
      </button>
    </form>
  );
};

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await experiencesAPI.getAllAdmin?.() ?? await experiencesAPI.getAll();
      // support different response shapes
      setExperiences(res.data?.experiences ?? res.data?.data ?? []);
    } catch (err) {
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await experiencesAPI.delete(id);
    setExperiences(p => p.filter(x => x._id !== id));
  };

  const columns = [
    { key: "companyName", label: "Company" },
    { key: "jobRole", label: "Role" },
    { key: "jobType", label: "Type" },
    {
      key: "startDate",
      label: "Duration",
      render: (row) => {
        const start = row.startDate ? new Date(row.startDate).getFullYear() : "?";
        const end = row.isCurrent ? "Present" : row.endDate ? new Date(row.endDate).getFullYear() : "?";
        return `${start} – ${end}`;
      },
    },
    {
      key: "isPublished",
      label: "Status",
      render: (row) => (
        <span className={`text-xs px-2 py-1 rounded-full ${row.isPublished ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
          {row.isPublished ? "Published" : "Draft"}
        </span>
      ),
    },
  ];

  const FormWithRefresh = (props) => (
    <ExperienceForm {...props} onSuccess={() => { props.onSuccess(); load(); }} />
  );

  return (
    <AdminCRUDPage
      title="Experience"
      addButtonLabel="Add Experience"
      items={experiences}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      FormComponent={FormWithRefresh}
      formTitle="Add Experience"
    />
  );
}
