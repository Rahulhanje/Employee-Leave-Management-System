import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const LeaveCard = ({ leave, onCancel, showActions = true }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'sick':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'casual':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'vacation':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return date;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(leave.leaveType)}`}>
              {leave.leaveType?.toUpperCase() || 'N/A'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
              {leave.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {leave.totalDays || 0} {leave.totalDays === 1 ? 'day' : 'days'}
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-700">
          <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
          <span className="font-medium mr-2">From:</span>
          <span>{formatDate(leave.startDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
          <span className="font-medium mr-2">To:</span>
          <span>{formatDate(leave.endDate)}</span>
        </div>
        <div className="flex items-start text-sm text-gray-700">
          <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-medium mr-2">Reason:</span>
            <span className="text-gray-600">{leave.reason || 'No reason provided'}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <ClockIcon className="w-4 h-4 mr-1" />
          Applied: {formatDate(leave.createdAt || leave.appliedDate)}
        </div>
        
        {showActions && leave.status?.toLowerCase() === 'pending' && onCancel && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCancel(leave._id)}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors shadow-sm"
          >
            Cancel Request
          </motion.button>
        )}
      </div>

      {/* Manager Comment (if rejected) */}
      {leave.status?.toLowerCase() === 'rejected' && leave.managerComment && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-xs font-semibold text-red-800 mb-1">Manager's Comment:</p>
          <p className="text-sm text-red-700">{leave.managerComment}</p>
        </div>
      )}

      {/* Manager Comment (if approved) */}
      {leave.status?.toLowerCase() === 'approved' && leave.managerComment && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
          <p className="text-xs font-semibold text-green-800 mb-1">Manager's Comment:</p>
          <p className="text-sm text-green-700">{leave.managerComment}</p>
        </div>
      )}
    </motion.div>
  );
};

export default LeaveCard;
