import React, { useState, useEffect, useCallback } from "react";
import AdminCRUDPage from "../../components/admin/AdminCRUDPage";
import { certificatesAPI } from "../../services/api";
import toast from "react-hot-toast";

const CertificateForm = ({ initialData, onSuccess }) => {
  const [form, setForm] = useState({
    name: "", organization: "", issueDate: "", expiryDate: "", noExpiry: false,
    credentialId: "", verificationUrl: "", imageUrl: "", organizationLogo: "",
    description: "", skills: [], order: 0, isFeatured: false, isPublished: true,
    ...(initialData || {}),
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val && !(form.skills || []).includes(val)) {
        set('skills', [...(form.skills || []), val]);
        e.target.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (initialData?._id) {
        await certificatesAPI.update(initialData._id, payload);
        toast.success('Certificate updated!');
      } else {
        await certificatesAPI.create(payload);
        toast.success('Certificate created!');
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
      <div>
        <label className="block text-sm text-gray-400 mb-1">Certificate Name *</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={form.name || ""}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. AWS Certified Solutions Architect"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Organization *</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.organization || ""}
            onChange={(e) => set('organization', e.target.value)}
            placeholder="e.g. Amazon Web Services"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Issue Date</label>
          <input
            type="date"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.issueDate ? form.issueDate.slice(0, 10) : ""}
            onChange={(e) => set('issueDate', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
          <input
            type="date"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.expiryDate ? form.expiryDate.slice(0, 10) : ""}
            onChange={(e) => set('expiryDate', e.target.value)}
            disabled={form.noExpiry}
          />
          <label className="flex items-center gap-2 mt-1 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={form.noExpiry || false}
              onChange={(e) => { set('noExpiry', e.target.checked); if (e.target.checked) set('expiryDate', ''); }}
              className="accent-primary-500"
            />
            No expiry
          </label>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Credential ID</label>
          <input
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
            value={form.credentialId || ""}
            onChange={(e) => set('credentialId', e.target.value)}
            placeholder="e.g. ABC-12345"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Verification URL</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={form.verificationUrl || ""}
          onChange={(e) => set('verificationUrl', e.target.value)}
          placeholder="https://verify.credly.com/..."
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Certificate Image URL</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={form.imageUrl || ""}
          onChange={(e) => set('imageUrl', e.target.value)}
          placeholder="https://... (Cloudinary URL)"
        />
        {form.imageUrl && (
          <img src={form.imageUrl} alt="cert preview" className="mt-2 h-24 rounded-lg object-cover" />
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Organization Logo URL</label>
        <input
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
          value={form.organizationLogo || ""}
          onChange={(e) => set('organizationLogo', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea
          rows={3}
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none resize-none"
          value={form.description || ""}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Brief description of what this certification covers..."
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Skills Covered</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(form.skills || []).map((s) => (
            <span key={s} className="flex items-center gap-1 bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full text-xs">
              {s}
              <button type="button" onClick={() => set('skills', (form.skills || []).filter((x) => x !== s))} className="hover:text-white">✕</button>
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
            value={form.order ?? 0}
            onChange={(e) => set('order', Number(e.target.value))}
          />
        </div>
        <div className="flex items-end pb-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured || false} onChange={(e) => set('isFeatured', e.target.checked)} className="accent-primary-500" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={form.isPublished ?? true} onChange={(e) => set('isPublished', e.target.checked)} className="accent-primary-500" />
            Published
          </label>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
        {loading ? 'Saving...' : (initialData ? 'Update Certificate' : 'Create Certificate')}
      </button>
    </form>
  );
};

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await certificatesAPI.getAllAdmin?.() ?? await certificatesAPI.getAll();
      setCertificates(res.data?.certificates ?? res.data?.data ?? res.data?.certificate ?? []);
    } catch (err) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await certificatesAPI.delete(id);
    setCertificates(p => p.filter(x => x._id !== id));
  };

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

  const FormWithRefresh = (props) => (
    <CertificateForm {...props} onSuccess={() => { props.onSuccess(); load(); }} />
  );

  return (
    <AdminCRUDPage
      title="Certificates"
      addButtonLabel="Add Certificate"
      items={certificates}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      FormComponent={FormWithRefresh}
      formTitle="Add Certificate"
    />
  );
}
