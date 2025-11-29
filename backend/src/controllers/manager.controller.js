import LeaveRequest from '../models/LeaveRequest.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * @desc    Get all pending leave requests
 * @route   GET /api/leaves/pending
 * @access  Private (Manager only)
 */
export const getPendingLeaves = async (req, res) => {
  try {
    // Find all pending leave requests
    const pendingLeaves = await LeaveRequest.find({ status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, 200, 'Pending leave requests retrieved successfully', {
      leaves: pendingLeaves,
      total: pendingLeaves.length
    });
  } catch (error) {
    console.error('Error fetching pending leaves:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

/**
 * @desc    Get all leave requests with filtering
 * @route   GET /api/leaves/all
 * @access  Private (Manager only)
 */
export const getAllLeaves = async (req, res) => {
  try {
    const { status, leaveType, employee, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build query object
    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by leave type
    if (leaveType) {
      query.leaveType = leaveType;
    }

    // Filter by specific employee
    if (employee) {
      query.user = employee;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) {
        query.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startDate.$lte = new Date(endDate);
      }
    }

    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch leave requests with pagination
    const leaves = await LeaveRequest.find(query)
      .populate('user', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // Get total count for pagination
    const total = await LeaveRequest.countDocuments(query);

    return sendSuccess(res, 200, 'Leave requests retrieved successfully', {
      leaves,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Error fetching all leaves:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

/**
 * @desc    Approve a leave request
 * @route   PUT /api/leaves/:id/approve
 * @access  Private (Manager only)
 */
export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerComment } = req.body;
    const managerId = req.user.id;

    // Find the leave request
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return sendError(res, 404, 'Leave request not found');
    }

    // Check if already processed
    if (leaveRequest.status !== 'pending') {
      return sendError(
        res,
        400,
        `Cannot approve leave request with status: ${leaveRequest.status}. Only pending requests can be approved.`
      );
    }

    // Find the employee
    const employee = await User.findById(leaveRequest.user);

    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    // Determine the leave type field name
    const leaveTypeField = `${leaveRequest.leaveType}Leave`;

    // Check if employee has sufficient balance
    const availableBalance = employee.leaveBalance[leaveTypeField];

    if (availableBalance < leaveRequest.totalDays) {
      return sendError(
        res,
        400,
        `Cannot approve leave. Insufficient ${leaveRequest.leaveType} leave balance. ` +
        `Available: ${availableBalance} days, Requested: ${leaveRequest.totalDays} days`
      );
    }

    // Deduct leave balance from employee
    employee.leaveBalance[leaveTypeField] -= leaveRequest.totalDays;
    await employee.save();

    // Update leave request status
    leaveRequest.status = 'approved';
    leaveRequest.approvedBy = managerId;
    leaveRequest.approvedAt = new Date();
    
    if (managerComment) {
      leaveRequest.managerComment = managerComment;
    }

    await leaveRequest.save();

    // Populate fields for response
    await leaveRequest.populate('user', 'name email');
    await leaveRequest.populate('approvedBy', 'name email');

    return sendSuccess(res, 200, 'Leave request approved successfully', {
      leaveRequest: leaveRequest.toObject(),
      updatedBalance: {
        [leaveTypeField]: employee.leaveBalance[leaveTypeField]
      }
    });
  } catch (error) {
    console.error('Error approving leave:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

/**
 * @desc    Reject a leave request
 * @route   PUT /api/leaves/:id/reject
 * @access  Private (Manager only)
 */
export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerComment } = req.body;
    const managerId = req.user.id;

    // Find the leave request
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return sendError(res, 404, 'Leave request not found');
    }

    // Check if already processed
    if (leaveRequest.status !== 'pending') {
      return sendError(
        res,
        400,
        `Cannot reject leave request with status: ${leaveRequest.status}. Only pending requests can be rejected.`
      );
    }

    // Update leave request status
    leaveRequest.status = 'rejected';
    leaveRequest.approvedBy = managerId;
    leaveRequest.approvedAt = new Date();
    
    if (managerComment) {
      leaveRequest.managerComment = managerComment;
    } else {
      leaveRequest.managerComment = 'Leave request rejected by manager';
    }

    await leaveRequest.save();

    // Populate fields for response
    await leaveRequest.populate('user', 'name email');
    await leaveRequest.populate('approvedBy', 'name email');

    return sendSuccess(res, 200, 'Leave request rejected successfully', {
      leaveRequest: leaveRequest.toObject()
    });
  } catch (error) {
    console.error('Error rejecting leave:', error);
    return sendError(res, 500, 'Internal server error');
  }
};
