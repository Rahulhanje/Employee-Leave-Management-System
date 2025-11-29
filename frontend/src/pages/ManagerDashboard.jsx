import React from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  BellAlertIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const ManagerDashboard = () => {
  const stats = [
    {
      name: 'Total Employees',
      value: '45',
      description: 'In your team',
      icon: UsersIcon,
      gradient: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-500',
      change: '+5',
      changeType: 'increase',
    },
    {
      name: 'Pending Requests',
      value: '7',
      description: 'Needs approval',
      icon: ClockIcon,
      gradient: 'from-yellow-500 to-yellow-600',
      iconBg: 'bg-yellow-500',
      change: '+2',
      changeType: 'increase',
    },
    {
      name: 'Approved',
      value: '32',
      description: 'This month',
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-500',
      change: '+8',
      changeType: 'increase',
    },
    {
      name: 'Rejected',
      value: '3',
      description: 'This month',
      icon: XCircleIcon,
      gradient: 'from-red-500 to-red-600',
      iconBg: 'bg-red-500',
      change: '-1',
      changeType: 'decrease',
    },
  ];

  const pendingRequests = [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      <div className="page-container">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Manager Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Manage leave requests and monitor team availability
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
              >
                <CalendarIcon className="h-5 w-5" />
                Team Calendar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ChartBarIcon className="h-5 w-5" />
                View Reports
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg} bg-opacity-20`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-semibold text-white ${
                    stat.changeType === 'increase' ? 'text-white' : 'text-white'
                  }`}>
                    {stat.change}
                  </span>
                  <svg
                    className={`w-4 h-4 text-white ${
                      stat.changeType === 'decrease' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-right mb-2">
                <p className="text-4xl font-bold text-white">{stat.value}</p>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {stat.name}
              </h3>
              <p className="text-sm text-white/80">{stat.description}</p>
              
              {/* Decorative circles */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pending Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BellAlertIcon className="h-8 w-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Pending Leave Requests
              </h2>
              {pendingRequests.length > 0 && (
                <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {pendingRequests.length} New
                </span>
              )}
            </div>
            <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors">
              View All →
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircleIcon className="h-12 w-12 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-500">
                No pending leave requests at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pending request items will go here */}
            </div>
          )}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Team Overview</h3>
                <p className="text-sm text-gray-600">View team members</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed reports</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Leave Calendar</h3>
                <p className="text-sm text-gray-600">View team schedule</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
