import { validationResult } from 'express-validator';
import LeaveRequest from '../models/leaveRequest.model.js';
import User from '../models/user.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Leave Controller - Employee Operations
 * Handles employee leave requests, cancellations, and balance checks
 */

/**
 * @route   POST /api/leaves
 * @desc    Apply for leave (Employee)
 * @access  Private (Employee)
 */
export const applyLeave = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        400,
        'Validation failed',
        errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg
        }))
      );
    }

    const { leaveType, startDate, endDate, reason } = req.body;
    const userId = req.user.id;

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate total days (including both start and end dates)
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    // Fetch user to check leave balance
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Check leave balance based on leave type
    let availableBalance = 0;
    let balanceField = '';

    switch (leaveType) {
      case 'sick':
        availableBalance = user.leaveBalance.sickLeave;
        balanceField = 'sickLeave';
        break;
      case 'casual':
        availableBalance = user.leaveBalance.casualLeave;
        balanceField = 'casualLeave';
        break;
      case 'vacation':
        availableBalance = user.leaveBalance.vacationLeave;
        balanceField = 'vacationLeave';
        break;
    }

    // Check if user has sufficient leave balance
    if (totalDays > availableBalance) {
      return errorResponse(
        res,
        400,
        `Insufficient ${leaveType} leave balance. Available: ${availableBalance} days, Requested: ${totalDays} days`
      );
    }

    // Check for overlapping approved leaves
    const overlappingLeaves = await LeaveRequest.find({
      userId,
      status: 'approved',
      $or: [
        // New leave starts during existing leave
        {
          startDate: { $lte: end },
          endDate: { $gte: start }
        }
      ]
    });

    if (overlappingLeaves.length > 0) {
      return errorResponse(
        res,
        400,
        'Leave dates overlap with an existing approved leave.',
        overlappingLeaves.map(leave => ({
          leaveType: leave.leaveType,
          startDate: leave.startDate,
          endDate: leave.endDate,
          totalDays: leave.totalDays
        }))
      );
    }

    // Create leave request
    const leaveRequest = await LeaveRequest.create({
      userId,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      status: 'pending'
    });

    // Populate user information
    await leaveRequest.populate('userId', 'name email role');

    return successResponse(res, 201, 'Leave request submitted successfully', {
      leaveRequest: {
        id: leaveRequest._id,
        leaveType: leaveRequest.leaveType,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate,
        totalDays: leaveRequest.totalDays,
        reason: leaveRequest.reason,
        status: leaveRequest.status,
        createdAt: leaveRequest.createdAt,
        user: {
          id: leaveRequest.userId._id,
          name: leaveRequest.userId.name,
          email: leaveRequest.userId.email
        }
      }
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    next(error);
  }
};

/**
 * @route   GET /api/leaves/my-requests
 * @desc    Get all leave requests for logged-in employee
 * @access  Private (Employee)
 */
export const getMyLeaveRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Query parameters for filtering
    const { status, leaveType, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { userId };

    // Apply filters if provided
    if (status) {
      query.status = status;
    }

    if (leaveType) {
      query.leaveType = leaveType;
    }

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) {
        query.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startDate.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch leave requests with pagination
    const leaveRequests = await LeaveRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('approvedBy', 'name email');

    // Get total count for pagination
    const total = await LeaveRequest.countDocuments(query);

    // Format response
    const formattedLeaves = leaveRequests.map(leave => ({
      id: leave._id,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      totalDays: leave.totalDays,
      reason: leave.reason,
      status: leave.status,
      managerComment: leave.managerComment,
      approvedBy: leave.approvedBy ? {
        id: leave.approvedBy._id,
        name: leave.approvedBy.name,
        email: leave.approvedBy.email
      } : null,
      approvedAt: leave.approvedAt,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt
    }));

    return successResponse(res, 200, 'Leave requests retrieved successfully', {
      leaves: formattedLeaves,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my leave requests error:', error);
    next(error);
  }
};

/**
 * @route   DELETE /api/leaves/:id
 * @desc    Cancel a pending leave request
 * @access  Private (Employee - own requests only)
 */
export const cancelLeaveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the leave request
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return errorResponse(res, 404, 'Leave request not found');
    }

    // Check if leave request belongs to the logged-in user
    if (leaveRequest.userId.toString() !== userId) {
      return errorResponse(
        res,
        403,
        'Access denied. You can only cancel your own leave requests'
      );
    }

    // Check if leave request is pending
    if (leaveRequest.status !== 'pending') {
      return errorResponse(
        res,
        400,
        `Cannot cancel leave request with status: ${leaveRequest.status}. Only pending requests can be cancelled.`
      );
    }

    // Delete the leave request
    await LeaveRequest.findByIdAndDelete(id);

    return successResponse(res, 200, 'Leave request cancelled successfully', {
      cancelledLeave: {
        id: leaveRequest._id,
        leaveType: leaveRequest.leaveType,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate,
        totalDays: leaveRequest.totalDays
      }
    });
  } catch (error) {
    console.error('Cancel leave request error:', error);
    next(error);
  }
};

/**
 * @route   GET /api/leaves/balance
 * @desc    Get leave balance for logged-in employee
 * @access  Private (Employee)
 */
export const getLeaveBalance = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user with leave balance
    const user = await User.findById(userId).select('name email role leaveBalance');

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Calculate used leaves (approved only)
    const approvedLeaves = await LeaveRequest.find({
      userId,
      status: 'approved'
    });

    const usedLeaves = {
      sickLeave: 0,
      casualLeave: 0,
      vacationLeave: 0
    };

    approvedLeaves.forEach(leave => {
      switch (leave.leaveType) {
        case 'sick':
          usedLeaves.sickLeave += leave.totalDays;
          break;
        case 'casual':
          usedLeaves.casualLeave += leave.totalDays;
          break;
        case 'vacation':
          usedLeaves.vacationLeave += leave.totalDays;
          break;
      }
    });

    // Calculate pending leaves
    const pendingLeaves = await LeaveRequest.find({
      userId,
      status: 'pending'
    });

    const pendingLeaveDays = {
      sickLeave: 0,
      casualLeave: 0,
      vacationLeave: 0
    };

    pendingLeaves.forEach(leave => {
      switch (leave.leaveType) {
        case 'sick':
          pendingLeaveDays.sickLeave += leave.totalDays;
          break;
        case 'casual':
          pendingLeaveDays.casualLeave += leave.totalDays;
          break;
        case 'vacation':
          pendingLeaveDays.vacationLeave += leave.totalDays;
          break;
      }
    });

    return successResponse(res, 200, 'Leave balance retrieved successfully', {
      leaveBalance: {
        sickLeave: {
          total: user.leaveBalance.sickLeave,
          used: usedLeaves.sickLeave,
          pending: pendingLeaveDays.sickLeave,
          available: user.leaveBalance.sickLeave - usedLeaves.sickLeave
        },
        casualLeave: {
          total: user.leaveBalance.casualLeave,
          used: usedLeaves.casualLeave,
          pending: pendingLeaveDays.casualLeave,
          available: user.leaveBalance.casualLeave - usedLeaves.casualLeave
        },
        vacationLeave: {
          total: user.leaveBalance.vacationLeave,
          used: usedLeaves.vacationLeave,
          pending: pendingLeaveDays.vacationLeave,
          available: user.leaveBalance.vacationLeave - usedLeaves.vacationLeave
        }
      },
      summary: {
        totalApprovedLeaves: approvedLeaves.length,
        totalPendingLeaves: pendingLeaves.length,
        totalDaysUsed: usedLeaves.sickLeave + usedLeaves.casualLeave + usedLeaves.vacationLeave,
        totalDaysPending: pendingLeaveDays.sickLeave + pendingLeaveDays.casualLeave + pendingLeaveDays.vacationLeave
      }
    });
  } catch (error) {
    console.error('Get leave balance error:', error);
    next(error);
  }
};
