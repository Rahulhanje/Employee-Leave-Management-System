import { errorResponse } from '../utils/response.js';

/**
 * Role-based Authorization Middleware
 * Restricts access to routes based on user roles
 * 
 * @param  {...string} allowedRoles - List of allowed roles
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Only managers can access
 * router.get('/manager-only', authMiddleware, roleMiddleware('manager'), handler);
 * 
 * // Managers and admins can access
 * router.get('/admin-area', authMiddleware, roleMiddleware('manager', 'admin'), handler);
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by authMiddleware)
    if (!req.user || !req.user.role) {
      return errorResponse(
        res,
        401,
        'Authentication required. Please login first.'
      );
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. This route requires one of the following roles: ${allowedRoles.join(', ')}`
      );
    }

    // User has required role, proceed to next middleware
    next();
  };
};

export default roleMiddleware;
