import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, CheckCircleIcon, XCircleIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { fetchManagerDashboard } from '../../store/managerSlice';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardStats, loading } = useSelector((state) => state.manager);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchManagerDashboard());
  }, [dispatch]);

  // Debug: Log dashboard stats
  useEffect(() => {
    console.log('Manager Dashboard Stats:', dashboardStats);
  }, [dashboardStats]);

  const statsCards = [
    {
      title: 'Pending Requests',
      value: dashboardStats.pendingCount || 0,
      icon: ClockIcon,
      gradient: 'from-yellow-500 to-yellow-600',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Approved (30d)',
      value: dashboardStats.approvedLast30Days || 0,
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Rejected (30d)',
      value: dashboardStats.rejectedLast30Days || 0,
      icon: XCircleIcon,
      gradient: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600',
    },
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manager Dashboard 👨‍💼</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
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

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/manager/pending')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 flex items-center justify-center gap-4 group"
          >
            <ClockIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold">Pending Requests</p>
              <p className="text-white/80 text-sm">Review and approve/reject</p>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/manager/requests')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 flex items-center justify-center gap-4 group"
          >
            <DocumentTextIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-2xl font-bold">All Requests</p>
              <p className="text-white/80 text-sm">View complete history</p>
            </div>
          </motion.button>
        </div>

        {/* Team Leave Analytics - Always Show */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-primary-600" />
            Team Leave Analytics
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Leave Type Distribution Pie Chart - Show if data exists */}
            {dashboardStats.leaveTypeDistribution && dashboardStats.leaveTypeDistribution.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Type Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardStats.leaveTypeDistribution.map(item => ({
                        name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Other',
                        value: item.count,
                        color: item._id === 'sick' ? '#3b82f6' : 
                               item._id === 'casual' ? '#8b5cf6' : '#6366f1'
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardStats.leaveTypeDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry._id === 'sick' ? '#3b82f6' : 
                                entry._id === 'casual' ? '#8b5cf6' : '#6366f1'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex items-center justify-center">
                <div className="text-center py-12">
                  <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No leave data available yet</p>
                  <p className="text-gray-400 text-sm mt-2">Leave distribution will appear here once requests are made</p>
                </div>
              </div>
            )}

            {/* Leave Status Bar Chart - Always Show */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Status Overview (30 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { 
                        name: 'Pending', 
                        count: dashboardStats.pendingCount || 0,
                        fill: '#eab308'
                      },
                      { 
                        name: 'Approved', 
                        count: dashboardStats.approvedLast30Days || 0,
                        fill: '#22c55e'
                      },
                      { 
                        name: 'Rejected', 
                        count: dashboardStats.rejectedLast30Days || 0,
                        fill: '#ef4444'
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leave Type Horizontal Bar Chart - Show if data exists */}
            {dashboardStats.leaveTypeDistribution && dashboardStats.leaveTypeDistribution.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Leave Type Breakdown</h3>
                <div className="space-y-4">
                  {dashboardStats.leaveTypeDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-semibold text-gray-700 capitalize">{item._id || item.type}</div>
                      <div className="flex-1">
                        <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.count / Math.max(...dashboardStats.leaveTypeDistribution.map(i => i.count))) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className={`h-full ${
                              item._id === 'sick' ? 'bg-blue-500' :
                              item._id === 'casual' ? 'bg-purple-500' :
                              'bg-indigo-500'
                            } flex items-center justify-end pr-3`}
                          >
                            <span className="text-white font-bold text-sm">{item.count}</span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
