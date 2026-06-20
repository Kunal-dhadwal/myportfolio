import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

// ─── Auth Thunks ──────────────────────────────────────────────
export const loginAdmin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('portfolio_token', data.token);
    localStorage.setItem('portfolio_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.getMe();
    return data.user;
  } catch (err) {
    localStorage.removeItem('portfolio_token');
    return rejectWithValue('Session expired');
  }
});

// ─── Auth Slice ───────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('portfolio_user') || 'null'),
    token: localStorage.getItem('portfolio_token') || null,
    isAuthenticated: !!localStorage.getItem('portfolio_token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_user');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(loadUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

// ─── Portfolio Slice (public data cache) ─────────────────────
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    profile: null,
    projects: [],
    groupedProjects: {},
    experiences: [],
    education: [],
    skills: [],
    skillsGrouped: {},
    certificates: [],
    loading: {},
    errors: {},
  },
  reducers: {
    setProfile: (state, { payload }) => { state.profile = payload; },
    setProjects: (state, { payload }) => { state.projects = payload; },
    setGroupedProjects: (state, { payload }) => { state.groupedProjects = payload; },
    setExperiences: (state, { payload }) => { state.experiences = payload; },
    setEducation: (state, { payload }) => { state.education = payload; },
    setSkills: (state, { payload }) => {
      state.skills = payload.skills;
      state.skillsGrouped = payload.grouped;
    },
    setCertificates: (state, { payload }) => { state.certificates = payload; },
    setLoading: (state, { payload }) => { state.loading[payload.key] = payload.value; },
    setError: (state, { payload }) => { state.errors[payload.key] = payload.value; },
  },
});

export const { logout, clearError } = authSlice.actions;
export const portfolioActions = portfolioSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    portfolio: portfolioSlice.reducer,
  },
});

export default store;
