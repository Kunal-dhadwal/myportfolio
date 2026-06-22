import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { profileAPI, uploadAPI } from "../../services/api";
import toast from "react-hot-toast";

const Section = ({ title, children }) => (
  <div className="glass-dark rounded-2xl p-6 mb-6">
    <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-dark-600">{title}</h3>
    {children}
  </div>
);

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    profileAPI.get().then((res) => {
      setProfile(res.data.profile || {});
    }).catch(() => setProfile({}))
    .finally(() => setLoading(false));
  }, []);

  const set = (path, value) => {
    setProfile((prev) => {
      const next = { ...prev };
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = { ...(cur[parts[i]] || {}) };
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };
 console.log(profile,"lie 52");
 
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImg(true);
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadAPI.uploadImage(fd);
      set("profileImage", res.data.url);
      toast.success("Profile image uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setUploadingImg(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await profileAPI.update(profile);
      toast.success("Profile saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const addTypingText = () => set("typingTexts", [...(profile.typingTexts || []), ""]);
  const updateTypingText = (i, val) => {
    const arr = [...(profile.typingTexts || [])];
    arr[i] = val;
    set("typingTexts", arr);
  };
  const removeTypingText = (i) =>
    set("typingTexts", (profile.typingTexts || []).filter((_, idx) => idx !== i));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-1">Manage your public portfolio profile</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white px-5 py-2 rounded-xl font-medium transition"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "💾"}
          Save Changes
        </motion.button>
      </div>

      {/* Profile Image */}
      <Section title="Profile Image">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-dark-700 overflow-hidden">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
              )}
            </div>
            {uploadingImg && (
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg text-sm transition inline-block">
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG or WebP. Max 5MB.</p>
            <Input label="Or paste URL" value={profile.profileImage} onChange={(v) => set("profileImage", v)} placeholder="https://..." />
          </div>
        </div>
      </Section>

      {/* Basic Info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name *" value={profile.name} onChange={(v) => set("name", v)} placeholder="John Doe" />
          <Input label="Title *" value={profile.title} onChange={(v) => set("title", v)} placeholder="Full Stack Developer" />
          <div className="sm:col-span-2">
            <Input label="Tagline" value={profile.tagline} onChange={(v) => set("tagline", v)} placeholder="Building modern web experiences..." />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea
              rows={4}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none resize-none"
              value={profile.bio || ""}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Write a short professional bio..."
            />
          </div>
        </div>
      </Section>

      {/* Typing Animation Texts */}
      <Section title="Typing Animation Texts">
        <p className="text-sm text-gray-400 mb-3">These texts cycle in the hero section typing animation.</p>
        {(profile.typingTexts || []).map((t, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none text-sm"
              value={t}
              onChange={(e) => updateTypingText(i, e.target.value)}
              placeholder={`Typing text ${i + 1}`}
            />
            <button type="button" onClick={() => removeTypingText(i)} className="text-red-400 hover:text-red-300 px-2">✕</button>
          </div>
        ))}
        <button type="button" onClick={addTypingText} className="text-sm text-primary-400 hover:text-primary-300">+ Add Text</button>
      </Section>

      {/* Contact Info */}
      <Section title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email" value={profile.contact?.email} onChange={(v) => set("contact.email", v)} placeholder="john@example.com" type="email" />
          <Input label="Phone" value={profile.contact?.phone} onChange={(v) => set("contact.phone", v)} placeholder="+1 (555) 000-0000" />
          <Input label="Location" value={profile.contact?.location} onChange={(v) => set("contact.location", v)} placeholder="San Francisco, CA" />
          <Input label="Website" value={profile.contact?.website} onChange={(v) => set("contact.website", v)} placeholder="https://yoursite.com" />
        </div>
      </Section>

      {/* Social Links */}
      <Section title="Social Links">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["github","🐙 GitHub"],["linkedin","💼 LinkedIn"],["twitter","🐦 Twitter / X"],
            ["youtube","📺 YouTube"],["instagram","📸 Instagram"],["devto","💻 Dev.to"],
          ].map(([key, label]) => (
            <Input
              key={key}
              label={label}
              value={profile.socialLinks?.[key]}
              onChange={(v) => set(`socialLinks.${key}`, v)}
              placeholder={`https://${key}.com/username`}
            />
          ))}
        </div>
      </Section>

      {/* Resume & Intro Video */}
      <Section title="Resume & Video">
        <div className="space-y-4">
          <Input label="Resume URL (PDF)" value={profile.resumeUrl} onChange={(v) => set("resumeUrl", v)} placeholder="https://cloudinary.com/resume.pdf" />
          <Input label="Intro Video URL" value={profile.introVideoUrl} onChange={(v) => set("introVideoUrl", v)} placeholder="https://youtube.com/watch?v=... or Cloudinary URL" />
          <div>
            <label className="block text-sm text-gray-400 mb-1">Video Type</label>
            <select
              className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
              value={profile.introVideoType || "youtube"}
              onChange={(e) => set("introVideoType", e.target.value)}
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="cloudinary">Cloudinary (self-hosted)</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Theme */}
      <Section title="Theme Settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Primary Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                className="w-12 h-10 rounded cursor-pointer bg-transparent"
                value={profile.themeColor || "#6366f1"}
                onChange={(e) => set("themeColor", e.target.value)}
              />
              <input
                className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none"
                value={profile.themeColor || "#6366f1"}
                onChange={(e) => set("themeColor", e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.isAvailableForWork ?? true}
                onChange={(e) => set("isAvailableForWork", e.target.checked)}
                className="accent-primary-500"
              />
              Show "Available for work" badge
            </label>
          </div>
        </div>
      </Section>

      {/* SEO */}
      <Section title="SEO Settings">
        <div className="space-y-4">
          <Input label="Meta Title" value={profile.seo?.metaTitle} onChange={(v) => set("seo.metaTitle", v)} placeholder="John Doe – Full Stack Developer" />
          <div>
            <label className="block text-sm text-gray-400 mb-1">Meta Description</label>
            <textarea
              rows={2}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none resize-none"
              value={profile.seo?.metaDescription || ""}
              onChange={(e) => set("seo.metaDescription", e.target.value)}
              placeholder="Portfolio of John Doe – Full Stack Developer specializing in React and Node.js"
            />
          </div>
          <Input label="Keywords (comma-separated)" value={profile.seo?.keywords} onChange={(v) => set("seo.keywords", v)} placeholder="React, Node.js, Full Stack Developer, Portfolio" />
        </div>
      </Section>

      {/* Save button (bottom) */}
      <div className="flex justify-end">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-medium transition"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "💾"}
          Save All Changes
        </motion.button>
      </div>
    </div>
  );
}
