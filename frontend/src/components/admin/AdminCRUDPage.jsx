import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminCRUDPage({
  title,
  columns = [],
  items = [],
  loading = false,
  onDelete,
  FormComponent,
  defaultData = {},
  searchKey = 'name',
}) {
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(defaultData);

  const handleAdd = () => {
    setEditing(null);
    setFormData({ ...defaultData });
    setShowForm(true);
  };
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleEdit = (item) => {
    setEditing(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditing(null);
    setFormData(defaultData);
  };

  const handleDelete = async (item) => {
    const label =
      item.title ||
      item.name ||
      item.companyName ||
      item.institution ||
      'this item';

    if (!window.confirm(`Delete "${label}"?`)) return;

    try {
      setDeleting(item._id);

      if (onDelete) {
        await onDelete(item._id);
      }

      toast.success('Deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = items.filter((item) => {
    if (!searchKey) return true;

    const searchText = (
      item?.[searchKey] ||
      item?.title ||
      item?.name ||
      ''
    )
      .toString()
      .toLowerCase();

    return searchText.includes(
      (window.__crudSearch || '').toLowerCase()
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-dark-500 text-sm mt-0.5">
            {items.length} total
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="btn-primary text-sm py-2 px-4"
        >
          + Add {title.replace(/s$/, '')}
        </button>
      </motion.div>

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
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left text-dark-500 text-xs font-semibold uppercase tracking-wider px-4 py-3"
                    >
                      {col.label}
                    </th>
                  ))}

                  <th className="text-right text-dark-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
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
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-4 py-3 text-sm text-dark-200"
                        >
                          {col.render
                            ? col.render(item)
                            : item[col.key] ?? '—'}
                        </td>
                      ))}

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1 rounded-lg text-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deleting === item._id}
                            className="px-3 py-1 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                          >
                            {deleting === item._id
                              ? 'Deleting...'
                              : 'Delete'}
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
                No items yet. Click "Add" to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Drawer */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 z-40"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-dark-900 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {editing
                      ? `Edit ${title}`
                      : `Add ${title}`}
                  </h2>

                  <button
                    onClick={handleClose}
                    className="text-white text-xl"
                  >
                    ×
                  </button>
                </div>

                {FormComponent && (
                  <FormComponent
                    initialData={formData}
                    onSuccess={() => {
                      handleClose();
                    }}
                    onChange={handleChange}
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