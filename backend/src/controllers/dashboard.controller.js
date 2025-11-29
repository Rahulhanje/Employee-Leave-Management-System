import LeaveRequest from '../models/leaveRequest.model.js';
import User from '../models/user.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Get employee dashboard statistics
 * @route GET /api/dashboard/employee
 * @access Private (Employee)
 */
export const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all leave requests for the employee
    const leaveRequests = await LeaveRequest.find({ userId });

    // Calculate statistics
    const totalLeavesTaken = leaveRequests.filter(
      (leave) => leave.status === 'approved'
    ).length;

    const pendingRequests = leaveRequests.filter(
      (leave) => leave.status === 'pending'
    ).length;

    const approvedRequests = leaveRequests.filter(
      (leave) => leave.status === 'approved'
    ).length;

    const rejectedRequests = leaveRequests.filter(
      (leave) => leave.status === 'rejected'
    ).length;

    // Get user's leave balance
    const user = await User.findById(userId).select('leaveBalance');
    const leaveBalance = {
      sick: user.leaveBalance.sickLeave || 0,
      casual: user.leaveBalance.casualLeave || 0,
      vacation: user.leaveBalance.vacationLeave || 0,
    };

    // Get upcoming leaves (approved leaves with future start dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingLeaves = await LeaveRequest.find({
      userId,
      status: 'approved',
      startDate: { $gte: today },
    })
      .select('leaveType startDate endDate reason')
      .sort({ startDate: 1 });

    const dashboardData = {
      totalLeavesTaken,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      balance: leaveBalance,
      upcomingLeaves,
    };

    return successResponse(
      res,
      200,
      'Employee dashboard data retrieved successfully',
      dashboardData
    );
  } catch (error) {
    console.error('Get employee dashboard error:', error);
    return errorResponse(res, 500, 'Failed to retrieve dashboard data', [
      error.message,
    ]);
  }
};

/**
 * Get manager dashboard statistics
 * @route GET /api/dashboard/manager
 * @access Private (Manager)
 */
export const getManagerDashboard = async (req, res) => {
  try {
    // Get all pending leave requests
    const pendingRequests = await LeaveRequest.find({ status: 'pending' })
      .populate('userId', 'name email')
      .select('leaveType startDate endDate reason createdAt')
      .sort({ createdAt: -1 });

    // Calculate date for 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get approved requests in last 30 days
    const approved30Days = await LeaveRequest.countDocuments({
      status: 'approved',
      updatedAt: { $gte: thirtyDaysAgo },
    });

    // Get rejected requests in last 30 days
    const rejected30Days = await LeaveRequest.countDocuments({
      status: 'rejected',
      updatedAt: { $gte: thirtyDaysAgo },
    });

    // Get leave type statistics using MongoDB aggregation
    const leaveTypeStats = await LeaveRequest.aggregate([
      {
        $group: {
          _id: '$leaveType',
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          leaveType: '$_id',
          totalRequests: '$count',
          approved: 1,
          pending: 1,
          rejected: 1,
        },
      },
      {
        $sort: { totalRequests: -1 },
      },
    ]);

    const dashboardData = {
      pendingRequests,
      pendingCount: pendingRequests.length,
      approved30Days,
      rejected30Days,
      leaveTypeStats,
    };

    return successResponse(
      res,
      200,
      'Manager dashboard data retrieved successfully',
      dashboardData
    );
  } catch (error) {
    console.error('Get manager dashboard error:', error);
    return errorResponse(res, 500, 'Failed to retrieve dashboard data', [
      error.message,
    ]);
  }
};
