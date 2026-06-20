import React, { useState, useEffect } from "react";
import AdminCRUDPage from "../../components/admin/AdminCRUDPage";
import { experiencesAPI } from "../../services/api";
import toast from "react-hot-toast";

const TECH_OPTIONS = [
  "React","Node.js","Python","AWS","Docker","Kubernetes","MongoDB","PostgreSQL",
  "TypeScript","GraphQL","Redis","Terraform","Jenkins","Go","Java","Spring Boot",
];

const ExperienceForm = ({ data, onChange }) => {
  const [techInput, setTechInput] = useState("");

  const addTech = (tech) => {
    const current = data.technologiesUsed || [];
    if (!current.includes(tech)) onChange("technologiesUsed", [...current, tech]);
  };
  const removeTech = (tech) =>
    onChange("technologiesUsed", (data.technologiesUsed || []).filter((t) => t !== tech));

  const handleResponsibility = (i, val) => {
    const arr = [...(data.responsibilities || [])];
    arr[i] = val;
    onChange("responsibilities", arr);
  };
  const addResponsibility = () =>
    onChange("responsibilities", [...(data.responsibilities || []), ""]);
  const removeResponsibility = (i) =>
    onChange("responsibilities", (data.responsibilities || []).filter((_, idx) => idx !== i));

  const handleAchievement = (i, val) => {
    const arr = [...(data.achievements || [])];
    arr[i] = val;
    onChange("achievements", arr);
  };
  const addAchievement = () =>
    onChange("achievements", [...(data.achievements || []), ""]);
  const removeAchievement = (i) =>
    onChange("achievements", (data.achievements || []).filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Company Name *</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.companyName || ""}
            onChange={(e) => onChange("companyName", e.target.value)}
            placeholder="e.g. Google"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Job Role *</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.jobRole || ""}
            onChange={(e) => onChange("jobRole", e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Job Type</label>
          <select
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.jobType || "Full-time"}
            onChange={(e) => onChange("jobType", e.target.value)}
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
            value={data.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
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
            value={data.startDate ? data.startDate.slice(0, 10) : ""}
            onChange={(e) => onChange("startDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">End Date</label>
          <input
            type="date"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.endDate ? data.endDate.slice(0, 10) : ""}
            onChange={(e) => onChange("endDate", e.target.value)}
            disabled={data.isCurrent}
          />
          <label className="flex items-center gap-2 mt-1 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={data.isCurrent || false}
              onChange={(e) => {
                onChange("isCurrent", e.target.checked);
                if (e.target.checked) onChange("endDate", "");
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
          value={data.companyLogo || ""}
          onChange={(e) => onChange("companyLogo", e.target.value)}
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
        {(data.responsibilities || []).map((r, i) => (
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
        {(data.achievements || []).map((a, i) => (
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
          {(data.technologiesUsed || []).map((t) => (
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
          {TECH_OPTIONS.filter((t) => !(data.technologiesUsed || []).includes(t)).map((t) => (
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

export default function AdminExperiences() {
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

  const fetchFn = async () => {
    const res = await experiencesAPI.getAll();
    return res.data.data || [];
  };
  const createFn = (d) => experiencesAPI.create(d);
  const updateFn = (id, d) => experiencesAPI.update(id, d);
  const deleteFn = (id) => experiencesAPI.delete(id);

  const defaultData = {
    companyName: "", jobRole: "", jobType: "Full-time", location: "",
    startDate: "", endDate: "", isCurrent: false, companyLogo: "",
    responsibilities: [""], achievements: [], technologiesUsed: [],
    order: 0, isPublished: true,
  };

  return (
    <AdminCRUDPage
      title="Experience"
      columns={columns}
      fetchFn={fetchFn}
      createFn={createFn}
      updateFn={updateFn}
      deleteFn={deleteFn}
      FormComponent={ExperienceForm}
      defaultData={defaultData}
      searchKey="companyName"
    />
  );
}
