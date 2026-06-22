import React, { useState, useEffect, useCallback } from "react";
import AdminCRUDPage from "../../components/admin/AdminCRUDPage";
import { skillsAPI } from "../../services/api";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Frontend","Backend","Database","DevOps","Cloud","Mobile","AI/ML",
  "Design","Testing","Other",
];

const ICONS = ["⚛️","🟢","🐍","☕","🦀","🐹","💎","📱","🎨","🔧","⚙️","🗄️","☁️","🐳","🔒","📊"];

const SkillForm = ({ initialData, onSuccess }) => {
  const [form, setForm] = useState({
    name: "", category: "Frontend", proficiency: 80,
    icon: "", iconUrl: "", color: "#6366f1",
    yearsOfExperience: 1, order: 0, isFeatured: false,
    ...(initialData || {}),
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (initialData?._id) {
        await skillsAPI.update(initialData._id, payload);
        toast.success('Skill updated!');
      } else {
        await skillsAPI.create(payload);
        toast.success('Skill created!');
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
          <label className="block text-sm text-gray-400 mb-1">Skill Name *</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.name || ""}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. React.js"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category *</label>
          <select
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.category || "Frontend"}
            onChange={(e) => set('category', e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Proficiency: <span className="text-primary-400 font-semibold">{form.proficiency ?? 80}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          className="w-full accent-primary-500"
          value={form.proficiency ?? 80}
          onChange={(e) => set('proficiency', Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Beginner</span><span>Intermediate</span><span>Expert</span>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Icon (emoji or URL)</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={form.icon || ""}
          onChange={(e) => set('icon', e.target.value)}
          placeholder="Paste URL or pick emoji below"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => set('icon', ic)}
              className={`text-xl p-1 rounded hover:bg-dark-600 transition ${form.icon === ic ? "bg-dark-600 ring-1 ring-primary-500" : ""}`}
            >{ic}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Icon URL (SVG / CDN)</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none text-sm"
          value={form.iconUrl || ""}
          onChange={(e) => set('iconUrl', e.target.value)}
          placeholder="https://cdn.simpleicons.org/react/61DAFB"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Years of Experience</label>
        <input
          type="number"
          min="0"
          max="50"
          step="0.5"
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={form.yearsOfExperience || ""}
          onChange={(e) => set('yearsOfExperience', Number(e.target.value))}
          placeholder="e.g. 3"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Color (hex)</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            className="w-12 h-10 rounded cursor-pointer bg-transparent border-none"
            value={form.color || "#6366f1"}
            onChange={(e) => set('color', e.target.value)}
          />
          <input
            className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.color || "#6366f1"}
            onChange={(e) => set('color', e.target.value)}
            placeholder="#6366f1"
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
              checked={form.isFeatured || false}
              onChange={(e) => set('isFeatured', e.target.checked)}
              className="accent-primary-500"
            />
            Featured on homepage
          </label>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
        {loading ? 'Saving...' : (initialData ? 'Update Skill' : 'Create Skill')}
      </button>
    </form>
  );
};

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await skillsAPI.getAllAdmin?.() ?? await skillsAPI.getAll();
      setSkills(res.data?.skills ?? res.data?.data?.skills ?? res.data?.data ?? []);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await skillsAPI.delete(id);
    setSkills(p => p.filter(x => x._id !== id));
  };

  const columns = [
    {
      key: "icon",
      label: "Icon",
      render: (row) => (
        <span className="text-2xl">{row.icon?.startsWith("http") ? (
          <img src={row.icon} alt="" className="w-7 h-7 object-contain" />
        ) : row.icon || "🔧"}</span>
      ),
    },
    { key: "name", label: "Skill" },
    { key: "category", label: "Category" },
    {
      key: "proficiency",
      label: "Proficiency",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-dark-700 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-primary-500" style={{ width: `${row.proficiency}%` }} />
          </div>
          <span className="text-xs text-gray-400">{row.proficiency}%</span>
        </div>
      ),
    },
    {
      key: "isFeatured",
      label: "Featured",
      render: (row) => row.isFeatured ? (
        <span className="text-yellow-400 text-xs">⭐ Yes</span>
      ) : <span className="text-gray-600 text-xs">No</span>,
    },
  ];

  const FormWithRefresh = (props) => (
    <SkillForm {...props} onSuccess={() => { props.onSuccess(); load(); }} />
  );

  return (
    <AdminCRUDPage
      title="Skills"
      addButtonLabel="Add Skill"
      items={skills}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      FormComponent={FormWithRefresh}
      formTitle="Add Skill"
    />
  );
}
