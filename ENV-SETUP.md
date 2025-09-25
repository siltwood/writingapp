# Environment Setup: Dev vs Production

## Current Setup
You're currently using ONE Supabase project for both dev and prod, which is risky!

## Recommended Setup

### Option 1: Two Separate Supabase Projects (Recommended)

#### 1. Create a Development Supabase Project
- Go to https://supabase.com/dashboard
- Create new project: "typewriter-dev" 
- Run the migration scripts
- Use for local development

#### 2. Keep Production Supabase Project
- Your current project: "typewriter-prod"
- Use for deployed app only
- Be careful with migrations

#### 3. Environment Files Setup

**Frontend `.env.development`:**
```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SUPABASE_URL=https://[DEV-PROJECT-ID].supabase.co
REACT_APP_SUPABASE_ANON_KEY=[DEV-ANON-KEY]
```

**Frontend `.env.production`:**
```bash
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_SUPABASE_URL=https://ozmqlwnduxjensjgerfs.supabase.co
REACT_APP_SUPABASE_ANON_KEY=[PROD-ANON-KEY]
```

**Backend `.env.development`:**
```bash
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Dev Supabase
SUPABASE_URL=https://[DEV-PROJECT-ID].supabase.co
SUPABASE_SERVICE_KEY=[DEV-SERVICE-KEY]

# Auth
JWT_SECRET=dev-secret-key-change-in-production
SESSION_SECRET=dev-session-secret

# Google OAuth (can use same for dev/prod)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
```

**Backend `.env.production`:**
```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com

# Prod Supabase
SUPABASE_URL=https://ozmqlwnduxjensjgerfs.supabase.co
SUPABASE_SERVICE_KEY=[PROD-SERVICE-KEY]

# Auth (use strong secrets!)
JWT_SECRET=[STRONG-RANDOM-SECRET]
SESSION_SECRET=[STRONG-RANDOM-SECRET]

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/auth/google/callback
```

### Option 2: Single Supabase with RLS (Current Setup)

If you want to keep using one Supabase project:

#### 1. Use Row Level Security Properly
```sql
-- Update policies to check actual auth
DROP POLICY IF EXISTS "Users can manage their own stories" ON stories;
CREATE POLICY "Users can manage their own stories" ON stories
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Remove the "true" development bypass
DROP POLICY IF EXISTS "Allow all operations on stories" ON stories;
```

#### 2. Create Test Users
```sql
-- Create a test user for development
INSERT INTO users (email, password, name, provider)
VALUES ('test@dev.com', '$2a$10$...', 'Dev User', 'email');
```

#### 3. Use Environment Variables
```javascript
// In your code, check environment
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  console.log('Running in development mode');
  // Use test credentials
}
```

## Database Migration Strategy

### For Development:
```bash
# Run migrations freely
npm run migrate:dev
```

### For Production:
```bash
# Test migrations on dev first!
# Then carefully run on prod
npm run migrate:prod
```

### Migration Scripts:
```json
// package.json
"scripts": {
  "migrate:dev": "supabase db push --db-url $DEV_DATABASE_URL",
  "migrate:prod": "supabase db push --db-url $PROD_DATABASE_URL"
}
```

## Deployment Checklist

### Before Deploying to Production:
- [ ] Test all features in dev environment
- [ ] Run migrations on dev database first
- [ ] Update `.env.production` with prod values
- [ ] Ensure RLS policies are production-ready
- [ ] Remove any "true" bypasses in policies
- [ ] Test authentication flow
- [ ] Backup production database

### Deploy Commands:
```bash
# Frontend
npm run build
npm run deploy

# Backend
npm run build
pm2 start dist/server.js --name typewriter-backend
```

## Quick Switch Between Environments

### Local Development:
```bash
# Frontend
npm start  # Uses .env.development

# Backend
npm run dev  # Uses .env.development
```

### Production Build Locally:
```bash
# Frontend
npm run build  # Uses .env.production
serve -s build

# Backend
NODE_ENV=production npm start
```

## Security Notes

1. **NEVER commit `.env` files** to git
2. **Use different JWT secrets** for dev/prod
3. **Enable RLS** in production
4. **Limit CORS** in production
5. **Use HTTPS** in production
6. **Rotate keys** regularly

## Current Status

You're currently using:
- **One Supabase project** for everything
- **Development bypasses** in RLS policies (`true`)
- **Local development** on ports 3000/3001

## Recommended Next Steps

1. Create a dev Supabase project
2. Update your `.env` files
3. Remove the `true` bypasses from production RLS
4. Test the migration process
5. Document your deployment process