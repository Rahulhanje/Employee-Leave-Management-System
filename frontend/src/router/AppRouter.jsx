import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import ManagerDashboard from '../pages/ManagerDashboard';
import NotFound from '../pages/NotFound';

// Employee Pages
import Dashboard from '../pages/employee/Dashboard';
import ApplyLeave from '../pages/employee/ApplyLeave';
import MyRequests from '../pages/employee/MyRequests';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    const dashboardRoute = user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard';
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Employee */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/apply-leave"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <ApplyLeave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/my-requests"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MyRequests />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Manager */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Root redirect based on auth status */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 Not Found */}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
