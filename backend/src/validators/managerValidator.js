import { body } from 'express-validator';

/**
 * Validation rules for approving leave
 */
export const approveLeaveValidation = [
  body('managerComment')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Manager comment must be between 5 and 500 characters if provided')
];

/**
 * Validation rules for rejecting leave
 */
export const rejectLeaveValidation = [
  body('managerComment')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Manager comment must be between 5 and 500 characters if provided')
];
