import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { generateToken } from '../middleware/auth';

export const authRouter = Router();

// Register with email/password
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        name,
        provider: 'email'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email already registered' });
      }
      throw error;
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login with email/password
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Google OAuth callback (handled by Passport in passport.ts)
authRouter.get('/google', (req, res) => {
  // Passport will handle this
  res.redirect(`${process.env.FRONTEND_URL}/auth/google`);
});

authRouter.get('/google/callback', (req, res) => {
  // After successful Google auth, redirect with token
  const user = req.user as any;
  if (user) {
    const token = generateToken({ id: user.id, email: user.email });
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
});

// Verify token
authRouter.get('/verify', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Get fresh user data
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, avatar_url')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});