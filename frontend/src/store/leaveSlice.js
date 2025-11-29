import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leaves: [],
  currentLeave: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    // Fetch leaves
    fetchLeavesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLeavesSuccess: (state, action) => {
      state.loading = false;
      state.leaves = action.payload.leaves;
      state.pagination = action.payload.pagination || state.pagination;
    },
    fetchLeavesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create leave
    createLeaveStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createLeaveSuccess: (state, action) => {
      state.loading = false;
      state.leaves.unshift(action.payload);
    },
    createLeaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update leave
    updateLeaveStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateLeaveSuccess: (state, action) => {
      state.loading = false;
      const index = state.leaves.findIndex(
        (leave) => leave._id === action.payload._id
      );
      if (index !== -1) {
        state.leaves[index] = action.payload;
      }
    },
    updateLeaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete leave
    deleteLeaveStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteLeaveSuccess: (state, action) => {
      state.loading = false;
      state.leaves = state.leaves.filter(
        (leave) => leave._id !== action.payload
      );
    },
    deleteLeaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current leave
    setCurrentLeave: (state, action) => {
      state.currentLeave = action.payload;
    },

    // Clear error
    clearLeaveError: (state) => {
      state.error = null;
    },

    // Reset state
    resetLeaveState: (state) => {
      state.leaves = [];
      state.currentLeave = null;
      state.loading = false;
      state.error = null;
      state.pagination = initialState.pagination;
    },
  },
});

export const {
  fetchLeavesStart,
  fetchLeavesSuccess,
  fetchLeavesFailure,
  createLeaveStart,
  createLeaveSuccess,
  createLeaveFailure,
  updateLeaveStart,
  updateLeaveSuccess,
  updateLeaveFailure,
  deleteLeaveStart,
  deleteLeaveSuccess,
  deleteLeaveFailure,
  setCurrentLeave,
  clearLeaveError,
  resetLeaveState,
} = leaveSlice.actions;

export default leaveSlice.reducer;
