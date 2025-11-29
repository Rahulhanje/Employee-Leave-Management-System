import { errorResponse } from '../utils/response.js';

/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  return errorResponse(res, 404, `Route ${req.originalUrl} not found`);
};

export default notFound;
