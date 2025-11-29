import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

// Async thunk: Fetch employee dashboard
export const fetchEmployeeDashboard = createAsyncThunk(
  'leave/fetchEmployeeDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/employee');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Async thunk: Apply leave
export const applyLeave = createAsyncThunk(
  'leave/applyLeave',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/leaves', leaveData);
      toast.success('Leave request submitted successfully!');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to apply leave';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Async thunk: Get my leave requests
export const getMyRequests = createAsyncThunk(
  'leave/getMyRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/leaves/my-requests');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch requests';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Async thunk: Cancel leave request
export const cancelLeave = createAsyncThunk(
  'leave/cancelLeave',
  async (leaveId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/leaves/${leaveId}`);
      toast.success('Leave request cancelled successfully!');
      return leaveId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel leave';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  leaves: [],
  dashboardStats: {
    remainingLeaves: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    upcomingLeaves: [],
  },
  balance: {
    sick: 0,
    casual: 0,
    vacation: 0,
  },
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLeaves: (state) => {
      state.leaves = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employee dashboard
      .addCase(fetchEmployeeDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = {
          remainingLeaves: action.payload.remainingLeaves || 0,
          pendingRequests: action.payload.pendingRequests || 0,
          approvedRequests: action.payload.approvedRequests || 0,
          upcomingLeaves: action.payload.upcomingLeaves || [],
        };
        state.balance = action.payload.balance || state.balance;
        state.error = null;
      })
      .addCase(fetchEmployeeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Apply leave
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves.unshift(action.payload);
        state.error = null;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get my requests
      .addCase(getMyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.leaves || action.payload || [];
        state.error = null;
      })
      .addCase(getMyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel leave
      .addCase(cancelLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = state.leaves.filter((leave) => leave._id !== action.payload);
        state.error = null;
      })
      .addCase(cancelLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLeaves } = leaveSlice.actions;
export default leaveSlice.reducer;
