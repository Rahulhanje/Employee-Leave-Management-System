import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';
import User from '../models/user.model.js';

/**
 * Authentication Middleware
 * Protects routes by verifying JWT token
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request object
      req.user = decoded;

      // Optionally, fetch fresh user data from database (without password)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return errorResponse(res, 401, 'User not found. Invalid token.');
      }

      // Attach full user object to request
      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        leaveBalance: user.leaveBalance
      };

      next();
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        return errorResponse(res, 401, 'Token expired. Please login again.');
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return errorResponse(res, 401, 'Invalid token. Please login again.');
      }
      throw jwtError;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 500, 'Authentication failed');
  }
};

export default authMiddleware;
