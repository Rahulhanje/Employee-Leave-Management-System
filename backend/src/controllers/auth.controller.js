import { validationResult } from 'express-validator';
import User from '../models/user.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Auth Controller
 * Handles user authentication (register, login, get current user)
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (req, res, next) => {
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

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already registered');
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee' // Default to employee if not provided
    });

    // Generate JWT token
    const token = user.generateJWT();

    // Prepare user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      leaveBalance: user.leaveBalance,
      createdAt: user.createdAt
    };

    // Return success response
    return successResponse(res, 201, 'Registration successful', {
      user: userData,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 */
export const login = async (req, res, next) => {
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

    const { email, password } = req.body;

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Compare password using model method
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = user.generateJWT();

    // Prepare user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      leaveBalance: user.leaveBalance,
      createdAt: user.createdAt
    };

    // Return success response
    return successResponse(res, 200, 'Login successful', {
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private (requires authentication)
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    const userId = req.user.id;

    // Fetch fresh user data from database (without password)
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Prepare user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      leaveBalance: user.leaveBalance,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return successResponse(res, 200, 'User retrieved successfully', {
      user: userData
    });
  } catch (error) {
    console.error('GetMe error:', error);
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
export const logout = async (req, res) => {
  // Note: With JWT, logout is typically handled client-side by removing the token
  // This endpoint is optional and serves as a confirmation
  return successResponse(res, 200, 'Logout successful', {
    message: 'Please remove the token from client storage'
  });
};
