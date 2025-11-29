import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CalendarIcon, UserIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ManagerRequestCard = ({ request, onApprove, onReject }) => {
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [action, setAction] = useState(null);

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'sick': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'casual': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'vacation': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAction = (actionType) => {
    setAction(actionType);
    setShowComment(true);
  };

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove(request._id, comment);
    } else {
      onReject(request._id, comment);
    }
    setShowComment(false);
    setComment('');
    setAction(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
    >
      {/* Employee Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
          {request.user?.name?.[0]?.toUpperCase() || 'E'}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{request.user?.name || 'Employee'}</h3>
          <p className="text-sm text-gray-500">{request.user?.email || ''}</p>
        </div>
      </div>

      {/* Leave Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(request.leaveType)}`}>
            {request.leaveType?.toUpperCase()}
          </span>
          <span className="text-sm font-semibold text-gray-700">{request.totalDays} days</span>
        </div>

        <div className="flex items-center text-sm text-gray-700">
          <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
          <span>{format(new Date(request.startDate), 'MMM dd')} - {format(new Date(request.endDate), 'MMM dd, yyyy')}</span>
        </div>

        <div className="flex items-start text-sm text-gray-700">
          <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
          <span className="text-gray-600">{request.reason}</span>
        </div>
      </div>

      {/* Comment Input */}
      {showComment && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows="3"
          />
        </motion.div>
      )}

      {/* Actions */}
      {!showComment ? (
        <div className="flex gap-3">
          <button
            onClick={() => handleAction('approve')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Approve
          </button>
          <button
            onClick={() => handleAction('reject')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            <XCircleIcon className="w-5 h-5" />
            Reject
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className={`flex-1 py-3 text-white rounded-lg font-semibold ${
              action === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
          </button>
          <button
            onClick={() => { setShowComment(false); setComment(''); setAction(null); }}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ManagerRequestCard;
