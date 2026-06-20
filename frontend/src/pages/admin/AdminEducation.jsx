import React from "react";
import AdminCRUDPage from "../../components/admin/AdminCRUDPage";
import { educationAPI } from "../../services/api";

const EducationForm = ({ data, onChange }) => {
  const handleSubject = (i, val) => {
    const arr = [...(data.subjects || [])];
    arr[i] = val;
    onChange("subjects", arr);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Institution *</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.institution || ""}
            onChange={(e) => onChange("institution", e.target.value)}
            placeholder="e.g. MIT"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Degree *</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.degree || ""}
            onChange={(e) => onChange("degree", e.target.value)}
            placeholder="e.g. Bachelor of Science"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Field of Study</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.fieldOfStudy || ""}
            onChange={(e) => onChange("fieldOfStudy", e.target.value)}
            placeholder="e.g. Computer Science"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Grade / GPA</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.grade || ""}
            onChange={(e) => onChange("grade", e.target.value)}
            placeholder="e.g. 3.9 / 4.0 or First Class"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Start Year *</label>
          <input
            type="number"
            min="1990"
            max="2099"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.startYear || ""}
            onChange={(e) => onChange("startYear", Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">End Year</label>
          <input
            type="number"
            min="1990"
            max="2099"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.endYear || ""}
            onChange={(e) => onChange("endYear", Number(e.target.value))}
            disabled={data.isCurrent}
          />
          <label className="flex items-center gap-2 mt-1 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={data.isCurrent || false}
              onChange={(e) => { onChange("isCurrent", e.target.checked); if (e.target.checked) onChange("endYear", null); }}
              className="accent-primary-500"
            />
            Currently studying
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Location</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={data.location || ""}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="e.g. Cambridge, MA, USA"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Institution Logo URL</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={data.institutionLogo || ""}
          onChange={(e) => onChange("institutionLogo", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea
          rows={3}
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none resize-none"
          value={data.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Brief description of your studies, notable projects, clubs..."
        />
      </div>

      {/* Subjects */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">Key Subjects</label>
          <button
            type="button"
            onClick={() => onChange("subjects", [...(data.subjects || []), ""])}
            className="text-xs text-primary-400 hover:text-primary-300"
          >+ Add</button>
        </div>
        {(data.subjects || []).map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none text-sm"
              value={s}
              onChange={(e) => handleSubject(i, e.target.value)}
              placeholder={`Subject ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => onChange("subjects", (data.subjects || []).filter((_, idx) => idx !== i))}
              className="text-red-400 hover:text-red-300 px-2"
            >✕</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Display Order</label>
          <input
            type="number"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.order ?? 0}
            onChange={(e) => onChange("order", Number(e.target.value))}
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={data.isPublished ?? true}
              onChange={(e) => onChange("isPublished", e.target.checked)}
              className="accent-primary-500"
            />
            Published
          </label>
        </div>
      </div>
    </div>
  );
};

export default function AdminEducation() {
  const columns = [
    { key: "institution", label: "Institution" },
    { key: "degree", label: "Degree" },
    { key: "fieldOfStudy", label: "Field" },
    {
      key: "startYear",
      label: "Period",
      render: (row) => `${row.startYear || "?"} – ${row.isCurrent ? "Present" : row.endYear || "?"}`,
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

  const fetchFn = async () => {
    const res = await educationAPI.getAll();
    return res.data.data || [];
  };
  const createFn = (d) => educationAPI.create(d);
  const updateFn = (id, d) => educationAPI.update(id, d);
  const deleteFn = (id) => educationAPI.delete(id);

  const defaultData = {
    institution: "", degree: "", fieldOfStudy: "", grade: "",
    startYear: new Date().getFullYear(), endYear: null, isCurrent: false,
    location: "", institutionLogo: "", description: "", subjects: [],
    order: 0, isPublished: true,
  };

  return (
    <AdminCRUDPage
      title="Education"
      columns={columns}
      fetchFn={fetchFn}
      createFn={createFn}
      updateFn={updateFn}
      deleteFn={deleteFn}
      FormComponent={EducationForm}
      defaultData={defaultData}
      searchKey="institution"
    />
  );
}
