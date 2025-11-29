import { body } from 'express-validator';

/**
 * Validation rules for leave management endpoints
 */

/**
 * Apply leave validation rules
 */
export const applyLeaveValidation = [
  body('leaveType')
    .trim()
    .notEmpty()
    .withMessage('Leave type is required')
    .isIn(['sick', 'casual', 'vacation'])
    .withMessage('Leave type must be sick, casual, or vacation'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      
      if (endDate < startDate) {
        throw new Error('End date cannot be before start date');
      }
      return true;
    }),

  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 10 })
    .withMessage('Reason must be at least 10 characters long')
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
];

/**
 * Update leave validation rules (for updating pending leave requests)
 */
export const updateLeaveValidation = [
  body('leaveType')
    .optional()
    .trim()
    .isIn(['sick', 'casual', 'vacation'])
    .withMessage('Leave type must be sick, casual, or vacation'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (req.body.startDate) {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
        
        if (endDate < startDate) {
          throw new Error('End date cannot be before start date');
        }
      }
      return true;
    }),

  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Reason must be at least 10 characters long')
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
];
