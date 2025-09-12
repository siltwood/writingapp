# Typewriter Backend API

Secure Express/TypeScript backend for the Typewriter app with authentication and Supabase integration.

## Features

- 🔐 **JWT Authentication** - Secure token-based auth
- 🔑 **Google OAuth** - Sign in with Google
- 📝 **Story Management API** - CRUD operations for stories
- 🛡️ **Security** - Helmet, CORS, rate limiting
- 🗄️ **Supabase Integration** - PostgreSQL database
- 📊 **Session Tracking** - Writing statistics

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set up database:**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run `database-schema.sql` in Supabase SQL editor
   - Copy service key (not anon key) to `.env`

4. **Set up Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3001/auth/google/callback` to redirect URIs
   - Copy client ID and secret to `.env`

## Development

```bash
npm run dev   # Start with hot reload
npm run build # Build TypeScript
npm start     # Run production build
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register with email/password
- `POST /auth/login` - Login with email/password
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/verify` - Verify JWT token

### Stories (Protected)
- `GET /api/stories` - Get user's stories
- `GET /api/stories/:id` - Get single story
- `POST /api/stories` - Create/update story
- `DELETE /api/stories/:id` - Delete story
- `POST /api/stories/:id/share` - Generate share link
- `GET /api/stories/shared/:shareId` - Get shared story (public)

## Security Features

- **Service Key**: Backend uses Supabase service key for full database access
- **JWT Tokens**: Expire after 7 days (configurable)
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend URL only
- **Helmet**: Security headers enabled
- **Password Hashing**: BCrypt with salt rounds

## Frontend Integration

```typescript
// Frontend API client example
const API_URL = 'http://localhost:3001';

// Login
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();

// Authenticated request
const stories = await fetch(`${API_URL}/api/stories`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use HTTPS in production
3. Set secure session cookies
4. Use environment-specific CORS origins
5. Consider using PM2 or similar for process management