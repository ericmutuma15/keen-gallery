import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { hashToken, isStrongPassword, randomToken } from '../utils/token.js';
import { sendAdminSetupEmail, sendPasswordResetEmail } from '../services/emailService.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

const signToken = (admin) => jwt.sign({ sub: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
const signRefreshToken = (admin) => jwt.sign({ sub: admin.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/request-access', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, 'Email is required.', 400);

    const allowlistEntry = await prisma.adminAllowlist.findUnique({ where: { email: String(email).trim().toLowerCase() } });
    if (!allowlistEntry || !allowlistEntry.isActive) {
      return successResponse(res, { message: 'If this email is authorized, you will receive an email shortly.' });
    }

    let admin = await prisma.admin.findUnique({ where: { email: allowlistEntry.email } });
    if (!admin) {
      admin = await prisma.admin.create({ data: { email: allowlistEntry.email } });
    }

    const token = randomToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    const tokenHash = hashToken(token);

    await prisma.adminSetupToken.create({ data: { adminId: admin.id, tokenHash, expiresAt } });

    const setupUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/setup?token=${encodeURIComponent(token)}`;
    await sendAdminSetupEmail(admin.email, setupUrl);

    return successResponse(res, { message: 'If this email is authorized, you will receive an email shortly.' });
  } catch (error) {
    return errorResponse(res, 'Unable to process access request.', 500);
  }
});

router.post('/setup-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword) return errorResponse(res, 'All fields are required.', 400);
    if (password !== confirmPassword) return errorResponse(res, 'Passwords do not match.', 400);
    if (!isStrongPassword(password)) return errorResponse(res, 'Password must include uppercase, lowercase, number and symbol.', 400);

    const tokenHash = hashToken(token);
    const setupToken = await prisma.adminSetupToken.findUnique({ where: { tokenHash } });
    if (!setupToken || setupToken.usedAt || setupToken.expiresAt < new Date()) {
      return errorResponse(res, 'This setup link is invalid or expired.', 400);
    }

    const admin = await prisma.admin.findUnique({ where: { id: setupToken.adminId } });
    if (!admin) return errorResponse(res, 'Administrator not found.', 404);

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.admin.update({ where: { id: admin.id }, data: { passwordHash, isInitialized: true, lastLoginAt: new Date() } }),
      prisma.adminSetupToken.update({ where: { id: setupToken.id }, data: { usedAt: new Date() } }),
    ]);

    return successResponse(res, { message: 'Password created successfully.' });
  } catch (error) {
    return errorResponse(res, 'Unable to complete password setup.', 500);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return errorResponse(res, 'Email and password are required.', 400);

    const admin = await prisma.admin.findUnique({ where: { email: String(email).trim().toLowerCase() } });
    if (!admin || !admin.passwordHash || !admin.isInitialized) {
      return errorResponse(res, 'Invalid credentials.', 401);
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) return errorResponse(res, 'Invalid credentials.', 401);

    const token = signToken(admin);
    const refreshToken = signRefreshToken(admin);

    await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

    return successResponse(res, {
      data: {
        admin: { id: admin.id, email: admin.email },
        token,
        refreshToken,
      },
      message: 'Logged in successfully.'
    });
  } catch (error) {
    return errorResponse(res, 'Unable to log in.', 500);
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return errorResponse(res, 'Refresh token required.', 400);

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({ where: { id: payload.sub } });
    if (!admin) return errorResponse(res, 'Invalid refresh token.', 401);

    return successResponse(res, { data: { token: signToken(admin) } });
  } catch (error) {
    return errorResponse(res, 'Unable to refresh session.', 401);
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, 'Email is required.', 400);

    const admin = await prisma.admin.findUnique({ where: { email: String(email).trim().toLowerCase() } });
    if (!admin) {
      return successResponse(res, { message: 'If an account exists, a reset link will be sent.' });
    }

    const token = randomToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.adminSetupToken.create({ data: { adminId: admin.id, tokenHash, expiresAt } });
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset?token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail(admin.email, resetUrl);

    return successResponse(res, { message: 'If an account exists, a reset link will be sent.' });
  } catch (error) {
    return errorResponse(res, 'Unable to process password reset.', 500);
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword) return errorResponse(res, 'All fields are required.', 400);
    if (password !== confirmPassword) return errorResponse(res, 'Passwords do not match.', 400);
    if (!isStrongPassword(password)) return errorResponse(res, 'Password must include uppercase, lowercase, number and symbol.', 400);

    const tokenHash = hashToken(token);
    const setupToken = await prisma.adminSetupToken.findUnique({ where: { tokenHash } });
    if (!setupToken || setupToken.usedAt || setupToken.expiresAt < new Date()) {
      return errorResponse(res, 'This reset link is invalid or expired.', 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.admin.update({ where: { id: setupToken.adminId }, data: { passwordHash, isInitialized: true } }),
      prisma.adminSetupToken.update({ where: { id: setupToken.id }, data: { usedAt: new Date() } }),
    ]);

    return successResponse(res, { message: 'Password reset complete.' });
  } catch (error) {
    return errorResponse(res, 'Unable to reset password.', 500);
  }
});

router.get('/me', authenticate, async (req, res) => {
  return successResponse(res, { data: { admin: { id: req.admin.id, email: req.admin.email } } });
});

router.post('/logout', async (_req, res) => {
  return successResponse(res, { message: 'Logged out.' });
});

export default router;
