import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminCRUDPage({
  title,
  columns = [],
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  FormComponent,
  defaultData = {},
  searchKey = 'name',
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);   // null = add mode, object = edit mode
  const [formData, setFormData] = useState(defaultData);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFn();
      setItems(data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { load(); }, [load]);

  // Open Add form
  const handleAdd = () => {
    setEditing(null);
    setFormData({ ...defaultData });
    setShowForm(true);
  };

  // Open Edit form
  const handleEdit = (item) => {
    setEditing(item);
    setFormData({ ...defaultData, ...item });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ ...defaultData });
  };

  // onChange handler passed to FormComponent: onChange(field, value)
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save (create or update)
  const handleSave = async () => {
    try {
      setSaving(true);
      if (editing) {
        await updateFn(editing._id, formData);
        toast.success('Updated successfully!');
      } else {
        await createFn(formData);
        toast.success('Created successfully!');
      }
      await load();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (item) => {
    const label = item.title || item.name || item.companyName || item.institution || 'this item';
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setDeleting(item._id);
    try {
      await deleteFn(item._id);
      toast.success('Deleted successfully');
      setItems(prev => prev.filter(i => i._id !== item._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = items.filter(item => {
    if (!search) return true;
    const s = search.toLowerCase();
    const primary = item[searchKey]?.toLowerCase() || '';
    const fallback = Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(s));
    return primary.includes(s) || fallback;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-dark-500 text-sm mt-0.5">{items.length} total</p>
        </div>
        <button onClick={handleAdd} className="btn-primary text-sm py-2">
          + Add {title.replace(/s$/, '')}
        </button>
      </motion.div>

      {/* Search */}
      <div className="mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full max-w-sm bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white placeholder-dark-600 focus:border-primary-500 focus:outline-none text-sm transition-colors"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-800">
                  {columns.map(col => (
                    <th key={col.key} className="text-left text-dark-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">
                      {col.label}
                    </th>
                  ))}
                  <th className="text-right text-dark-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/50">
                <AnimatePresence>
                  {filtered.map((item, i) => (
                    <motion.tr key={item._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-dark-800/40 transition-colors">
                      {columns.map(col => (
                        <td key={col.key} className="px-4 py-3 text-sm text-dark-200">
                          {col.render ? col.render(item) : (item[col.key] ?? '—')}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(item)}
                            className="px-3 py-1 rounded-lg text-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(item)} disabled={deleting === item._id}
                            className="px-3 py-1 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50">
                            {deleting === item._id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <div className="text-center py-12 text-dark-600">
                {search ? 'No results found' : 'No items yet. Click "Add" to get started.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-over form panel */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl glass-dark border-l border-primary-500/20 overflow-y-auto flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-dark-700 sticky top-0 bg-dark-900/80 backdrop-blur z-10">
                <h2 className="text-lg font-bold text-white">
                  {editing ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}
                </h2>
                <button onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-dark-800 text-dark-400 hover:text-white flex items-center justify-center transition-colors text-lg">
                  ×
                </button>
              </div>

              {/* Form content */}
              <div className="flex-1 px-6 py-5">
                {FormComponent && (
                  <FormComponent data={formData} onChange={handleChange} />
                )}
              </div>

              {/* Panel footer - Save button */}
              <div className="px-6 py-4 border-t border-dark-700 sticky bottom-0 bg-dark-900/80 backdrop-blur">
                <div className="flex gap-3">
                  <button onClick={handleClose}
                    className="flex-1 py-2.5 rounded-xl border border-dark-600 text-dark-400 hover:text-white hover:border-dark-500 transition text-sm">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-medium transition text-sm flex items-center justify-center gap-2">
                    {saving
                      ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                      : editing ? '💾 Update' : '✅ Create'
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
