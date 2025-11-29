import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { getMyRequests, cancelLeave } from '../../store/leaveSlice';
import LeaveCard from '../../components/LeaveCard';

const MyRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leaves, loading } = useSelector((state) => state.leave);
  const [cancelingId, setCancelingId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [leaveToCancel, setLeaveToCancel] = useState(null);

  useEffect(() => {
    dispatch(getMyRequests());
  }, [dispatch]);

  const handleCancelClick = (leaveId) => {
    setLeaveToCancel(leaveId);
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (leaveToCancel) {
      setCancelingId(leaveToCancel);
      const result = await dispatch(cancelLeave(leaveToCancel));
      if (cancelLeave.fulfilled.match(result)) {
        dispatch(getMyRequests());
      }
      setCancelingId(null);
      setShowConfirmDialog(false);
      setLeaveToCancel(null);
    }
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
    setLeaveToCancel(null);
  };

  if (loading && leaves.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/employee/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Leave Requests</h1>
          <p className="text-gray-600">View and manage all your leave requests</p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600 text-sm font-medium mb-1">Total Requests</p>
            <p className="text-3xl font-bold text-gray-900">{leaves.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {leaves.filter((l) => l.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600 text-sm font-medium mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">
              {leaves.filter((l) => l.status === 'approved').length}
            </p>
          </div>
        </motion.div>

        {/* Leave Requests List */}
        {leaves.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {leaves.map((leave, index) => (
                <motion.div
                  key={leave._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LeaveCard
                    leave={leave}
                    onCancel={handleCancelClick}
                    showActions={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100"
          >
            <DocumentTextIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Leave Requests Yet</h3>
            <p className="text-gray-500 mb-8">
              You haven't submitted any leave requests. Start by applying for leave!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/employee/apply-leave')}
              className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Apply for Leave
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            onClick={handleCancelDialog}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
                <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Cancel Leave Request?
              </h3>
              <p className="text-gray-600 text-center mb-8">
                Are you sure you want to cancel this leave request? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleCancelDialog}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={cancelingId !== null}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelingId ? 'Canceling...' : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyRequests;
