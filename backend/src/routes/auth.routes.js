import express from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../validators/authValidator.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Authentication Routes
 * Base path: /api/auth
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', loginValidation, login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private (requires valid JWT token)
 */
router.get('/me', authMiddleware, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (confirmation endpoint)
 * @access  Private
 */
router.post('/logout', authMiddleware, logout);

export default router;
