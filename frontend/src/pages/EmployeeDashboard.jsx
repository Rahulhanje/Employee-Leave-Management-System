import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const EmployeeDashboard = () => {
  const stats = [
    {
      name: 'Total Leaves',
      value: '24',
      description: 'Annual allocation',
      icon: CalendarDaysIcon,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
    },
    {
      name: 'Used Leaves',
      value: '8',
      description: 'This year',
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-500',
    },
    {
      name: 'Pending',
      value: '2',
      description: 'Awaiting approval',
      icon: ClockIcon,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      iconBg: 'bg-yellow-500',
    },
    {
      name: 'Available',
      value: '16',
      description: 'Remaining balance',
      icon: ChartBarIcon,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
    },
  ];

  const recentLeaves = [];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
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
                Employee Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back! Manage your leave requests and track your balance.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Apply for Leave
            </motion.button>
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
                <div className="text-right">
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
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

        {/* Recent Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Leave Requests
              </h2>
            </div>
            <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors">
              View All →
            </button>
          </div>

          {recentLeaves.length === 0 ? (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
              >
                <CalendarDaysIcon className="h-12 w-12 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No leave requests yet
              </h3>
              <p className="text-gray-500 mb-6">
                Click "Apply for Leave" to submit your first request
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-700 transition-all duration-200"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Apply for Leave
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Leave request items will go here */}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Leave Calendar</h3>
                <p className="text-sm text-gray-600">View team calendar</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Leave History</h3>
                <p className="text-sm text-gray-600">View past requests</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Leave Policy</h3>
                <p className="text-sm text-gray-600">View company policy</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
