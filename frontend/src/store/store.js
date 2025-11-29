import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import leaveReducer from './leaveSlice';
import dashboardReducer from './dashboardSlice';
import managerReducer from './managerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leave: leaveReducer,
    dashboard: dashboardReducer,
    manager: managerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
