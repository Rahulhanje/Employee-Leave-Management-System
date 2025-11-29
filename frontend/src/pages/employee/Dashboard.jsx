import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { fetchEmployeeDashboard } from '../../store/leaveSlice';
import LeaveCard from '../../components/LeaveCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardStats, balance, loading, error } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEmployeeDashboard());
  }, [dispatch]);

  const statsCards = [
    {
      title: 'Total Remaining',
      value: dashboardStats.remainingLeaves || 0,
      icon: CalendarDaysIcon,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Pending Requests',
      value: dashboardStats.pendingRequests || 0,
      icon: ClockIcon,
      gradient: 'from-yellow-500 to-yellow-600',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Approved Leaves',
      value: dashboardStats.approvedRequests || 0,
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  const leaveBalanceCards = [
    { type: 'Sick Leave', value: balance.sick || 0, color: 'blue' },
    { type: 'Casual Leave', value: balance.casual || 0, color: 'purple' },
    { type: 'Vacation Leave', value: balance.vacation || 0, color: 'indigo' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Employee'}! 👋
          </h1>
          <p className="text-gray-600">Here's your leave management overview</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgLight} p-4 rounded-xl`}>
                  <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leave Balance Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Leave Balance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaveBalanceCards.map((leave, index) => (
              <motion.div
                key={leave.type}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`bg-gradient-to-br from-${leave.color}-500 to-${leave.color}-600 rounded-2xl shadow-lg p-6 text-white`}
              >
                <p className="text-white/80 text-sm font-medium mb-2">{leave.type}</p>
                <p className="text-5xl font-bold">{leave.value}</p>
                <p className="text-white/60 text-xs mt-2">days available</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <button
            onClick={() => navigate('/employee/apply-leave')}
            className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 flex items-center justify-center gap-4 group"
          >
            <PlusCircleIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold">Apply for Leave</p>
              <p className="text-white/80 text-sm">Submit a new leave request</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/employee/my-requests')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 flex items-center justify-center gap-4 group"
          >
            <DocumentTextIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold">My Requests</p>
              <p className="text-white/80 text-sm">View all your leave requests</p>
            </div>
          </button>
        </motion.div>

        {/* Upcoming Leaves */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Leaves</h2>
          {dashboardStats.upcomingLeaves && dashboardStats.upcomingLeaves.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardStats.upcomingLeaves.map((leave) => (
                <LeaveCard key={leave._id} leave={leave} showActions={false} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No upcoming leaves</p>
              <p className="text-gray-400 text-sm mt-2">Your approved leaves will appear here</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
