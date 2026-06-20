import React from "react";
import AdminCRUDPage from "../../components/admin/AdminCRUDPage";
import { certificatesAPI } from "../../services/api";

const CertificateForm = ({ data, onChange }) => {
  const addSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val && !(data.skills || []).includes(val)) {
        onChange("skills", [...(data.skills || []), val]);
        e.target.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Certificate Name *</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={data.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g. AWS Certified Solutions Architect"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Organization *</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.organization || ""}
            onChange={(e) => onChange("organization", e.target.value)}
            placeholder="e.g. Amazon Web Services"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Issue Date</label>
          <input
            type="date"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.issueDate ? data.issueDate.slice(0, 10) : ""}
            onChange={(e) => onChange("issueDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
          <input
            type="date"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.expiryDate ? data.expiryDate.slice(0, 10) : ""}
            onChange={(e) => onChange("expiryDate", e.target.value)}
            disabled={data.noExpiry}
          />
          <label className="flex items-center gap-2 mt-1 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={data.noExpiry || false}
              onChange={(e) => { onChange("noExpiry", e.target.checked); if (e.target.checked) onChange("expiryDate", ""); }}
              className="accent-primary-500"
            />
            No expiry
          </label>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Credential ID</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={data.credentialId || ""}
            onChange={(e) => onChange("credentialId", e.target.value)}
            placeholder="e.g. ABC-12345"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Verification URL</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={data.verificationUrl || ""}
          onChange={(e) => onChange("verificationUrl", e.target.value)}
          placeholder="https://verify.credly.com/..."
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Certificate Image URL</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={data.imageUrl || ""}
          onChange={(e) => onChange("imageUrl", e.target.value)}
          placeholder="https://... (Cloudinary URL)"
        />
        {data.imageUrl && (
          <img src={data.imageUrl} alt="cert preview" className="mt-2 h-24 rounded-lg object-cover" />
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Organization Logo URL</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={data.organizationLogo || ""}
          onChange={(e) => onChange("organizationLogo", e.target.value)}
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
          placeholder="Brief description of what this certification covers..."
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Skills Covered</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(data.skills || []).map((s) => (
            <span key={s} className="flex items-center gap-1 bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full text-xs">
              {s}
              <button type="button" onClick={() => onChange("skills", (data.skills || []).filter((x) => x !== s))} className="hover:text-white">✕</button>
            </span>
          ))}
        </div>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none text-sm"
          onKeyDown={addSkill}
          placeholder="Type a skill and press Enter"
        />
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
        <div className="flex items-end pb-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={data.isFeatured || false} onChange={(e) => onChange("isFeatured", e.target.checked)} className="accent-primary-500" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={data.isPublished ?? true} onChange={(e) => onChange("isPublished", e.target.checked)} className="accent-primary-500" />
            Published
          </label>
        </div>
      </div>
    </div>
  );
};

export default function AdminCertificates() {
  const columns = [
    {
      key: "imageUrl",
      label: "Img",
      render: (row) => row.imageUrl ? (
        <img src={row.imageUrl} alt="" className="w-12 h-8 object-cover rounded" />
      ) : <span className="text-2xl">🏆</span>,
    },
    { key: "name", label: "Certificate" },
    { key: "organization", label: "Organization" },
    {
      key: "issueDate",
      label: "Issued",
      render: (row) => row.issueDate ? new Date(row.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "—",
    },
    {
      key: "isFeatured",
      label: "Featured",
      render: (row) => row.isFeatured ? <span className="text-yellow-400 text-xs">⭐ Yes</span> : <span className="text-gray-600 text-xs">No</span>,
    },
  ];

  const fetchFn = async () => {
    const res = await certificatesAPI.getAll();
    return res.data.data || [];
  };
  const createFn = (d) => certificatesAPI.create(d);
  const updateFn = (id, d) => certificatesAPI.update(id, d);
  const deleteFn = (id) => certificatesAPI.delete(id);

  const defaultData = {
    name: "", organization: "", issueDate: "", expiryDate: "", noExpiry: false,
    credentialId: "", verificationUrl: "", imageUrl: "", organizationLogo: "",
    description: "", skills: [], order: 0, isFeatured: false, isPublished: true,
  };

  return (
    <AdminCRUDPage
      title="Certificates"
      columns={columns}
      fetchFn={fetchFn}
      createFn={createFn}
      updateFn={updateFn}
      deleteFn={deleteFn}
      FormComponent={CertificateForm}
      defaultData={defaultData}
      searchKey="name"
    />
  );
}
