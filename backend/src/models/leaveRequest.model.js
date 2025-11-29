import mongoose from 'mongoose';

/**
 * Leave Request Schema
 * Handles employee leave requests with approval workflow
 */
const leaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true // Index for faster queries by user
    },
    leaveType: {
      type: String,
      enum: {
        values: ['sick', 'casual', 'vacation'],
        message: 'Leave type must be sick, casual, or vacation'
      },
      required: [true, 'Leave type is required'],
      index: true // Index for filtering by leave type
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    totalDays: {
      type: Number,
      required: [true, 'Total days is required'],
      min: [1, 'Total days must be at least 1']
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      minlength: [10, 'Reason must be at least 10 characters long'],
      maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be pending, approved, or rejected'
      },
      default: 'pending',
      index: true // Index for filtering by status
    },
    managerComment: {
      type: String,
      trim: true,
      maxlength: [500, 'Manager comment cannot exceed 500 characters']
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: {
      type: Date
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    versionKey: false // Removes __v field
  }
);

/**
 * Compound Indexes
 * Optimize queries for common filtering combinations
 */
leaveRequestSchema.index({ userId: 1, status: 1 }); // User's leaves by status
leaveRequestSchema.index({ status: 1, createdAt: -1 }); // Recent pending leaves
leaveRequestSchema.index({ leaveType: 1, startDate: 1 }); // Leaves by type and date

/**
 * Virtual: user
 * Populate user information when needed
 */
leaveRequestSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

/**
 * Virtual: formattedDates
 * Returns readable date strings
 */
leaveRequestSchema.virtual('formattedDates').get(function () {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return {
    startDate: this.startDate.toLocaleDateString('en-US', options),
    endDate: this.endDate.toLocaleDateString('en-US', options),
    duration: `${this.totalDays} day${this.totalDays > 1 ? 's' : ''}`
  };
});

/**
 * Virtual: isActive
 * Check if leave is currently active
 */
leaveRequestSchema.virtual('isActive').get(function () {
  const now = new Date();
  return this.status === 'approved' && 
         this.startDate <= now && 
         this.endDate >= now;
});

/**
 * Pre-validation middleware
 * Validate date logic and calculate total days
 */
leaveRequestSchema.pre('validate', function (next) {
  // Ensure end date is not before start date
  if (this.startDate && this.endDate) {
    if (this.endDate < this.startDate) {
      return next(new Error('End date cannot be before start date'));
    }

    // Auto-calculate total days if not provided or needs recalculation
    if (!this.totalDays || this.isModified('startDate') || this.isModified('endDate')) {
      this.totalDays = this.calculateTotalDays();
    }
  }

  next();
});

/**
 * Instance method: Calculate total days
 * Calculates the number of days between start and end date (inclusive)
 * @returns {number} - Total number of days
 */
leaveRequestSchema.methods.calculateTotalDays = function () {
  if (!this.startDate || !this.endDate) {
    return 0;
  }

  // Calculate difference in milliseconds
  const timeDiff = this.endDate.getTime() - this.startDate.getTime();
  
  // Convert to days and add 1 to include both start and end dates
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  
  return daysDiff;
};

/**
 * Instance method: Approve leave
 * @param {ObjectId} managerId - ID of the manager approving the leave
 * @param {string} comment - Optional comment from manager
 * @returns {Promise<LeaveRequest>} - Updated leave request
 */
leaveRequestSchema.methods.approve = function (managerId, comment = '') {
  this.status = 'approved';
  this.approvedBy = managerId;
  this.approvedAt = new Date();
  if (comment) {
    this.managerComment = comment;
  }
  return this.save();
};

/**
 * Instance method: Reject leave
 * @param {ObjectId} managerId - ID of the manager rejecting the leave
 * @param {string} comment - Required comment explaining rejection
 * @returns {Promise<LeaveRequest>} - Updated leave request
 */
leaveRequestSchema.methods.reject = function (managerId, comment) {
  if (!comment) {
    throw new Error('Manager comment is required when rejecting a leave request');
  }
  
  this.status = 'rejected';
  this.approvedBy = managerId;
  this.approvedAt = new Date();
  this.managerComment = comment;
  return this.save();
};

/**
 * Static method: Get pending leaves
 * @returns {Promise<Array>} - Array of pending leave requests
 */
leaveRequestSchema.statics.getPendingLeaves = function () {
  return this.find({ status: 'pending' })
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 });
};

/**
 * Static method: Get user's leave history
 * @param {ObjectId} userId - User ID
 * @param {Object} filter - Optional filter (status, leaveType, etc.)
 * @returns {Promise<Array>} - Array of leave requests
 */
leaveRequestSchema.statics.getUserLeaves = function (userId, filter = {}) {
  return this.find({ userId, ...filter })
    .sort({ createdAt: -1 });
};

/**
 * Query helper: Filter by date range
 */
leaveRequestSchema.query.byDateRange = function (startDate, endDate) {
  return this.where('startDate').gte(startDate).where('endDate').lte(endDate);
};

/**
 * Enable virtuals in JSON and Object conversions
 */
leaveRequestSchema.set('toJSON', { virtuals: true });
leaveRequestSchema.set('toObject', { virtuals: true });

// Create and export LeaveRequest model
const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

export default LeaveRequest;
