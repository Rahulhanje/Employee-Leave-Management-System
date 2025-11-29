import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

// Fetch manager dashboard
export const fetchManagerDashboard = createAsyncThunk(
  'manager/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/manager');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Fetch pending requests
export const fetchPendingRequests = createAsyncThunk(
  'manager/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/leaves/pending');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch pending requests';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Fetch all requests
export const fetchAllRequests = createAsyncThunk(
  'manager/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axiosInstance.get(`/leaves/all?${params}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch requests';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Approve request
export const approveRequest = createAsyncThunk(
  'manager/approve',
  async ({ leaveId, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/leaves/${leaveId}/approve`, { comment });
      toast.success('Leave request approved!');
      return { leaveId, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to approve';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Reject request
export const rejectRequest = createAsyncThunk(
  'manager/reject',
  async ({ leaveId, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/leaves/${leaveId}/reject`, { comment });
      toast.success('Leave request rejected!');
      return { leaveId, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reject';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  dashboardStats: {
    pendingCount: 0,
    approvedLast30Days: 0,
    rejectedLast30Days: 0,
    leaveTypeDistribution: [],
  },
  pendingRequests: [],
  allRequests: [],
  loading: false,
  error: null,
};

const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchManagerDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchManagerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchManagerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Pending
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload.leaves || action.payload || [];
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // All requests
      .addCase(fetchAllRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.allRequests = action.payload.leaves || action.payload || [];
      })
      .addCase(fetchAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve
      .addCase(approveRequest.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter((r) => r._id !== action.payload.leaveId);
      })
      // Reject
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter((r) => r._id !== action.payload.leaveId);
      });
  },
});

export const { clearError } = managerSlice.actions;
export default managerSlice.reducer;
