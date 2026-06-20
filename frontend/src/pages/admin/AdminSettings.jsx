import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { authAPI } from "../../services/api";
import { useDispatch } from "react-redux";
import { logout } from "../../store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    authAPI.getLogs()
      .then((r) => setLogs(r.data.data || []))
      .catch(() => {})
      .finally(() => setLogsLoading(false));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (pwForm.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    try {
      setPwLoading(true);
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally { setPwLoading(false); }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  const PwInput = ({ id, label, showKey }) => (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type={showPw[showKey] ? "text" : "password"}
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 pr-10 text-white focus:border-primary-500 outline-none"
          value={pwForm[id]}
          onChange={(e) => setPwForm((p) => ({ ...p, [id]: e.target.value }))}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPw((p) => ({ ...p, [showKey]: !p[showKey] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >{showPw[showKey] ? "🙈" : "👁️"}</button>
      </div>
    </div>
  );

  const getActionColor = (action) => {
    if (action?.includes("login")) return "text-green-400";
    if (action?.includes("logout")) return "text-yellow-400";
    if (action?.includes("delete") || action?.includes("fail")) return "text-red-400";
    return "text-blue-400";
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account security and preferences</p>
      </div>

      {/* Change Password */}
      <div className="glass-dark rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-dark-600">
          🔒 Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <PwInput id="currentPassword" label="Current Password" showKey="current" />
          <PwInput id="newPassword" label="New Password" showKey="new" />
          <PwInput id="confirmPassword" label="Confirm New Password" showKey="confirm" />
          <div className="bg-dark-900 rounded-lg p-3 text-xs text-gray-400 space-y-1">
            <p>Password requirements:</p>
            <p className={pwForm.newPassword.length >= 6 ? "text-green-400" : ""}>✓ At least 6 characters</p>
            <p className={pwForm.newPassword && pwForm.newPassword === pwForm.confirmPassword ? "text-green-400" : ""}>✓ Passwords match</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={pwLoading}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white px-5 py-2 rounded-xl font-medium transition"
          >
            {pwLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            Update Password
          </motion.button>
        </form>
      </div>

      {/* Session */}
      <div className="glass-dark rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-dark-600">
          🚪 Session
        </h3>
        <p className="text-gray-400 text-sm mb-4">You are currently logged in as admin. Logging out will clear your session.</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-5 py-2 rounded-xl font-medium transition"
        >
          🚪 Sign Out
        </button>
      </div>

      {/* Activity Logs */}
      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-dark-600">
          📋 Activity Logs
        </h3>
        {logsLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No activity logs yet.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-dark-900 rounded-lg text-sm">
                <span className="text-lg flex-shrink-0">
                  {log.action?.includes("login") ? "🔑" : log.action?.includes("logout") ? "👋" : "📝"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium capitalize ${getActionColor(log.action)}`}>{log.action}</div>
                  {log.ip && <div className="text-xs text-gray-500 mt-0.5">IP: {log.ip}</div>}
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
