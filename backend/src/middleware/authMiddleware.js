import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({ where: { id: payload.sub } });

    if (!admin || !admin.isInitialized) {
      return errorResponse(res, 'Invalid session.', 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token.', 401);
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.admin) {
    return errorResponse(res, 'Administrator access required.', 403);
  }

  const allowlistEntry = await prisma.adminAllowlist.findUnique({ where: { email: req.admin.email } });
  if (!allowlistEntry || !allowlistEntry.isActive) {
    return errorResponse(res, 'Unauthorized administrator.', 403);
  }

  next();
};
