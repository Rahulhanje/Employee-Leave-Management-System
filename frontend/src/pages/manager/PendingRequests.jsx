import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';
import { fetchPendingRequests, approveRequest, rejectRequest } from '../../store/managerSlice';
import ManagerRequestCard from '../../components/ManagerRequestCard';
import toast from 'react-hot-toast';

const PendingRequests = () => {
  const dispatch = useDispatch();
  const { pendingRequests, loading } = useSelector((state) => state.manager);

  useEffect(() => {
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  const handleApprove = async (id, comment) => {
    try {
      await dispatch(approveRequest({ leaveId: id, comment })).unwrap();
      toast.success('Leave request approved successfully!');
      dispatch(fetchPendingRequests()); // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to approve request');
    }
  };

  const handleReject = async (id, comment) => {
    if (!comment || comment.trim() === '') {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      await dispatch(rejectRequest({ leaveId: id, comment })).unwrap();
      toast.success('Leave request rejected');
      dispatch(fetchPendingRequests()); // Refresh list
    } catch (error) {
      toast.error(error || 'Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading pending requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon className="w-10 h-10 text-yellow-600" />
            <h1 className="text-4xl font-bold text-gray-900">Pending Requests ⏳</h1>
          </div>
          <p className="text-gray-600">{pendingRequests.length} request(s) awaiting your approval</p>
        </motion.div>

        {/* Requests Grid */}
        {pendingRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-16 text-center"
          >
            <ClockIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-600">All leave requests have been processed. Great job! 🎉</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingRequests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ManagerRequestCard
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;
