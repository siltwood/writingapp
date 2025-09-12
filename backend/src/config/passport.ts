import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Express } from 'express';
import session from 'express-session';
import { supabase } from './supabase';

export const setupPassport = (app: Express) => {
  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || 'typewriter-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', profile.id)
        .single();

      if (existingUser) {
        return done(null, existingUser);
      }

      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          google_id: profile.id,
          email: profile.emails?.[0].value,
          name: profile.displayName,
          avatar_url: profile.photos?.[0].value,
          provider: 'google'
        })
        .select()
        .single();

      if (error) throw error;
      return done(null, newUser);
    } catch (error) {
      return done(error as Error);
    }
  }));

  // Serialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id: string, done) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};