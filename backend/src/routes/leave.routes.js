import express from 'express';
import {
  applyLeave,
  getMyLeaveRequests,
  cancelLeaveRequest,
  getLeaveBalance
} from '../controllers/leave.controller.js';
import { applyLeaveValidation } from '../validators/leaveValidator.js';
import authMiddleware from '../middleware/authMiddleware.js';

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
 * @route   DELETE /api/leaves/:id
 * @desc    Cancel a pending leave request
 * @access  Private (Employee - own requests only)
 */
router.delete('/:id', authMiddleware, cancelLeaveRequest);

export default router;
