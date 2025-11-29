import express from 'express';
import {
  applyLeave,
  getMyLeaveRequests,
  cancelLeaveRequest,
  getLeaveBalance
} from '../controllers/leave.controller.js';
import {
  getPendingLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave
} from '../controllers/manager.controller.js';
import { applyLeaveValidation } from '../validators/leaveValidator.js';
import { approveLeaveValidation, rejectLeaveValidation } from '../validators/managerValidator.js';
import { validate } from '../validators/authValidator.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * Leave Routes - Employee Operations
 * Base path: /api/leaves
 * All routes require authentication
 */

/**
 * @route   POST /api/leaves
 * @desc    Apply for leave
 * @access  Private (Employee)
 */
router.post('/', authMiddleware, applyLeaveValidation, applyLeave);

/**
 * @route   GET /api/leaves/my-requests
 * @desc    Get all leave requests for logged-in employee
 * @access  Private (Employee)
 * @query   status - Filter by status (pending, approved, rejected)
 * @query   leaveType - Filter by leave type (sick, casual, vacation)
 * @query   page - Page number for pagination (default: 1)
 * @query   limit - Number of items per page (default: 10)
 */
router.get('/my-requests', authMiddleware, getMyLeaveRequests);

/**
 * @route   GET /api/leaves/balance
 * @desc    Get leave balance for logged-in employee
 * @access  Private (Employee)
 */
router.get('/balance', authMiddleware, getLeaveBalance);

/**
 * ==========================================================
 * Manager Routes - Leave Approval & Management
 * ==========================================================
 */

/**
 * @route   GET /api/leaves/pending
 * @desc    Get all pending leave requests
 * @access  Private (Manager only)
 */
router.get('/pending', authMiddleware, roleMiddleware('manager'), getPendingLeaves);

/**
 * @route   GET /api/leaves/all
 * @desc    Get all leave requests with filtering
 * @access  Private (Manager only)
 * @query   status - Filter by status (pending, approved, rejected)
 * @query   leaveType - Filter by leave type (sick, casual, vacation)
 * @query   employee - Filter by employee ID
 * @query   startDate - Filter by start date
 * @query   endDate - Filter by end date
 * @query   page - Page number for pagination (default: 1)
 * @query   limit - Number of items per page (default: 10)
 */
router.get('/all', authMiddleware, roleMiddleware('manager'), getAllLeaves);

/**
 * @route   PUT /api/leaves/:id/approve
 * @desc    Approve a leave request and deduct balance
 * @access  Private (Manager only)
 */
router.put('/:id/approve', authMiddleware, roleMiddleware('manager'), approveLeaveValidation, validate, approveLeave);

/**
 * @route   PUT /api/leaves/:id/reject
 * @desc    Reject a leave request with optional comment
 * @access  Private (Manager only)
 */
router.put('/:id/reject', authMiddleware, roleMiddleware('manager'), rejectLeaveValidation, validate, rejectLeave);

/**
 * @route   DELETE /api/leaves/:id
 * @desc    Cancel a pending leave request
 * @access  Private (Employee - own requests only)
 */
router.delete('/:id', authMiddleware, cancelLeaveRequest);

export default router;
