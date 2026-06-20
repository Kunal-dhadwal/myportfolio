import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { contactsAPI } from "../../services/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  new: "bg-blue-500/20 text-blue-400",
  read: "bg-yellow-500/20 text-yellow-400",
  replied: "bg-green-500/20 text-green-400",
  archived: "bg-gray-500/20 text-gray-400",
};

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await contactsAPI.getAll();
      setContacts(res.data.data || []);
      setStats(res.data.stats || {});
    } catch { toast.error("Failed to load contacts"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await contactsAPI.updateStatus(id, status);
      setContacts((prev) => prev.map((c) => c._id === id ? { ...c, status } : c));
      if (selected?._id === id) setSelected((s) => ({ ...s, status }));
      toast.success("Status updated");
    } catch { toast.error("Failed to update"); }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await contactsAPI.delete(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = contacts.filter((c) => {
    const matchFilter = filter === "all" || c.status === filter;
    const matchSearch = !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const openContact = async (c) => {
    setSelected(c);
    if (c.status === "new") updateStatus(c._id, "read");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-gray-400 mt-1">Manage incoming messages from your portfolio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total || 0, color: "text-white" },
          { label: "New", value: stats.new || 0, color: "text-blue-400" },
          { label: "Replied", value: stats.replied || 0, color: "text-green-400" },
          { label: "Archived", value: stats.archived || 0, color: "text-gray-400" },
        ].map((s) => (
          <div key={s.label} className="glass-dark rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 outline-none"
          placeholder="Search by name, email or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {["all","new","read","replied","archived"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm capitalize transition ${filter === f ? "bg-primary-500 text-white" : "bg-dark-800 text-gray-400 hover:bg-dark-700"}`}
            >{f}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-320px)] min-h-[400px]">
        {/* List */}
        <div className="w-full sm:w-80 flex-shrink-0 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No messages found</div>
          ) : filtered.map((c) => (
            <motion.div
              key={c._id}
              layout
              onClick={() => openContact(c)}
              className={`p-3 rounded-xl cursor-pointer transition border ${selected?._id === c._id ? "border-primary-500 bg-primary-500/10" : "border-dark-600 bg-dark-800 hover:border-dark-500"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm truncate">{c.name}</span>
                    {c.status === "new" && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{c.email}</div>
                  <div className="text-xs text-gray-300 truncate mt-0.5">{c.subject || "No subject"}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[c.status] || STATUS_COLORS.new}`}>
                  {c.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-dark rounded-2xl p-6 h-full flex flex-col"
              >
                {/* Contact header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-primary-400 hover:underline text-sm">{selected.email}</a>
                    {selected.phone && <div className="text-gray-400 text-sm mt-0.5">{selected.phone}</div>}
                    <div className="text-gray-500 text-xs mt-1">{new Date(selected.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selected.status}
                      onChange={(e) => updateStatus(selected._id, e.target.value)}
                      className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1 text-sm text-white focus:border-primary-500 outline-none"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={() => deleteContact(selected._id)}
                      className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1 rounded-lg text-sm transition"
                    >Delete</button>
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-1">SUBJECT</div>
                  <div className="text-white font-medium">{selected.subject || "No subject"}</div>
                </div>

                {/* Message */}
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-2">MESSAGE</div>
                  <div className="bg-dark-900 rounded-xl p-4 text-gray-200 leading-relaxed whitespace-pre-wrap text-sm">
                    {selected.message}
                  </div>
                </div>

                {/* Reply button */}
                <div className="mt-4 pt-4 border-t border-dark-600">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your message"}`}
                    onClick={() => updateStatus(selected._id, "replied")}
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition w-fit"
                  >
                    📧 Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center text-gray-500"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">📬</div>
                  <div>Select a message to read</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
