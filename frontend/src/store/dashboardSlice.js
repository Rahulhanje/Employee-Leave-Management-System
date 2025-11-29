import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  },
  recentLeaves: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Fetch dashboard stats
    fetchDashboardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload.stats || state.stats;
      state.recentLeaves = action.payload.recentLeaves || [];
    },
    fetchDashboardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update stats
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },

    // Clear error
    clearDashboardError: (state) => {
      state.error = null;
    },

    // Reset dashboard state
    resetDashboardState: (state) => {
      state.stats = initialState.stats;
      state.recentLeaves = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  updateStats,
  clearDashboardError,
  resetDashboardState,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
