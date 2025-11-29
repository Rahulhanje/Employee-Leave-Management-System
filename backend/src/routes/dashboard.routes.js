import express from 'express';
import {
  getEmployeeDashboard,
  getManagerDashboard,
} from '../controllers/dashboard.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = express.Router();

// Employee dashboard
router.get(
  '/employee',
  authMiddleware,
  roleMiddleware('employee'),
  getEmployeeDashboard
);

// Manager dashboard
router.get(
  '/manager',
  authMiddleware,
  roleMiddleware('manager'),
  getManagerDashboard
);

export default router;
