import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '../config/supabase';
import { generateToken } from '../middleware/auth';

export const authExtendedRouter = Router();

// Password reset request
authExtendedRouter.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If an account exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token in database
    await supabase
      .from('password_resets')
      .insert({
        user_id: user.id,
        token: resetToken,
        expires_at: resetTokenExpiry.toISOString()
      });

    // In production, send email here
    // For development, return the reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Password reset link:', resetLink);

    // TODO: Send email with nodemailer or SendGrid
    // await sendResetEmail(email, resetLink);

    res.json({ 
      message: 'If an account exists, a reset link has been sent',
      // Remove this in production - only for development
      developmentLink: resetLink 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to process reset request' });
  }
});

// Confirm password reset
authExtendedRouter.post('/reset-password/confirm', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }

    // Verify token
    const { data: resetRequest } = await supabase
      .from('password_resets')
      .select('user_id, expires_at')
      .eq('token', token)
      .single();

    if (!resetRequest) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token expired
    if (new Date(resetRequest.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', resetRequest.user_id);

    // Delete used reset token
    await supabase
      .from('password_resets')
      .delete()
      .eq('token', token);

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Email verification
authExtendedRouter.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const { data: verification } = await supabase
      .from('email_verifications')
      .select('user_id')
      .eq('token', token)
      .single();

    if (!verification) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // Mark user as verified
    await supabase
      .from('users')
      .update({ email_verified: true })
      .eq('id', verification.user_id);

    // Delete verification token
    await supabase
      .from('email_verifications')
      .delete()
      .eq('token', token);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});