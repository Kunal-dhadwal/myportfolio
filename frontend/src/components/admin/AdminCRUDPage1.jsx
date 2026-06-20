import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

/**
 * Generic admin CRUD page.
 * Props:
 *   title, addButtonLabel, items, loading,
 *   columns: [{ key, label, render? }]
 *   onAdd, onEdit, onDelete
 *   FormComponent: renders add/edit form
 */
export default function AdminCRUDPage({
  title, addButtonLabel = 'Add New',
  items = [], loading,
  columns = [],
  onDelete,
  FormComponent,
  formTitle = 'Add / Edit',
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');

  const handleAdd = () => { setEditing(null); setShowForm(true); };
  const handleEdit = (item) => { setEditing(item); setShowForm(true); };
  const handleClose = () => { setShowForm(false); setEditing(null); };
  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title || item.name || item.companyName || item.institution}"? This cannot be undone.`)) return;
    setDeleting(item._id);
    try {
      await onDelete(item._id);
      toast.success('Deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = items.filter(item => {
    if (!search) return true;
    const s = search.toLowerCase();
    return Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(s));
  });

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-dark-500 text-sm mt-0.5">{items.length} total</p>
        </div>
        <button onClick={handleAdd} className="btn-primary text-sm py-2">
          + {addButtonLabel}
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
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : (
        <div className="card overflow-hidden p-0">
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
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-dark-800/40 transition-colors"
                    >
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
            {filtered.length === 0 && (
              <div className="text-center py-12 text-dark-600">
                {search ? 'No results found' : 'No items yet. Click "Add New" to get started.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-over form */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl glass-dark border-l border-primary-500/20 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">{editing ? `Edit ${title.slice(0, -1)}` : formTitle}</h2>
                  <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-dark-800 text-dark-400 hover:text-white flex items-center justify-center transition-colors">×</button>
                </div>
                {FormComponent && (
                  <FormComponent
                    initialData={editing}
                    onSuccess={() => { handleClose(); }}
                    onClose={handleClose}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
