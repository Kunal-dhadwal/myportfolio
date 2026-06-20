import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
  getLogs: () => api.get('/auth/logs'),
  logout: () => api.post('/auth/logout'),
};

// ─── Profile ──────────────────────────────────────────────────
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

// ─── Projects ─────────────────────────────────────────────────
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getGrouped: () => api.get('/projects/grouped'),
  getById: (id) => api.get(`/projects/${id}`),
  getAllAdmin: () => api.get('/projects/admin/all'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// ─── Experiences ──────────────────────────────────────────────
export const experiencesAPI = {
  getAll: () => api.get('/experiences'),
  getAllAdmin: () => api.get('/experiences/admin'),
  create: (data) => api.post('/experiences', data),
  update: (id, data) => api.put(`/experiences/${id}`, data),
  delete: (id) => api.delete(`/experiences/${id}`),
};

// ─── Education ────────────────────────────────────────────────
export const educationAPI = {
  getAll: () => api.get('/education'),
  create: (data) => api.post('/education', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
};

// ─── Skills ───────────────────────────────────────────────────
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

// ─── Certificates ─────────────────────────────────────────────
export const certificatesAPI = {
  getAll: () => api.get('/certificates'),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
};

// ─── Contacts ─────────────────────────────────────────────────
export const contactsAPI = {
  submit: (data) => api.post('/contacts', data),
  getAll: (params) => api.get('/contacts', { params }),
  updateStatus: (id, status) => api.patch(`/contacts/${id}/status`, { status }),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// ─── Upload ───────────────────────────────────────────────────
export const uploadAPI = {
  image: (formData) => api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  images: (formData) => api.post('/upload/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  video: (formData) => api.post('/upload/video', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  document: (formData) => api.post('/upload/document', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (publicId) => api.delete(`/upload/${encodeURIComponent(publicId)}`),
};

// ─── Analytics ────────────────────────────────────────────────
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

export default api;
