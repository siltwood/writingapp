# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Typewriter Studio** - A retro typewriter visualization app with Papers, Please-inspired pixelated aesthetic. Users can type on a vintage typewriter, save stories to the cloud, and share their work.

### Tech Stack
- **Frontend**: React with TypeScript
- **Backend**: Express.js with TypeScript  
- **Database**: Supabase (PostgreSQL)
- **Auth**: Google OAuth + Email/Password
- **Styling**: CSS with pixelated effects

## CRITICAL: Design System Requirements

**YOU MUST ALWAYS REFERENCE AND FOLLOW THESE FILES:**

### 📋 `DESIGN-SYSTEM.md` 
Complete design specifications - READ THIS BEFORE ANY UI CHANGES

### 📦 `src/constants/ui.constants.ts`
TypeScript constants for colors, spacing, animations - USE THESE IN CODE

### 🎨 `src/styles/shared.css`
Shared CSS classes - USE THESE INSTEAD OF CREATING NEW ONES

## Non-Negotiable Design Rules

1. **SPINNING X CLOSE BUTTONS** - ALL close buttons MUST rotate 90deg on hover
   ```jsx
   <button className="close-button-standard close-button-light">
     <X size={20} />
   </button>
   ```

2. **Font**: Always use `'Courier Prime', monospace`

3. **Colors**:
   - Paper: `#f4f1e8`
   - Dark gradient: `#2a2a2a` to `#1a1a1a`
   - Text on paper: `#1a1a1a`
   - Text on dark: `#f4f1e8`

4. **Animations**: 
   - Duration: `0.3s`
   - Easing: `ease`
   - Close buttons: `rotate(90deg)` on hover

5. **Modal Behavior**:
   - Escape key MUST close
   - Backdrop click MUST close
   - X button in top-left corner

6. **Consistency**:
   - Check `shared.css` before creating new styles
   - Use constants from `ui.constants.ts`
   - Follow patterns in `DESIGN-SYSTEM.md`

## Architecture

### Frontend Structure
```
src/
├── components/       # React components
├── constants/       # UI constants and configs
├── lib/            # API services
├── styles/         # Shared styles
└── App.tsx         # Main app component
```

### Backend Structure
```
backend/
├── src/
│   ├── config/     # Database and auth config
│   ├── middleware/ # Auth middleware
│   ├── routes/     # API routes
│   └── server.ts   # Express server
```

## Database Schema

Run `supabase-schema.sql` in Supabase to set up:
- `users` table (with email/password support)
- `stories` table (user-scoped)
- `password_resets` table
- `email_verifications` table
- Row Level Security policies

## Development Commands

### Start Frontend
```bash
npm start
```

### Start Backend
```bash
cd backend
npm run dev
```

### Both Need to Run
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Authentication Flow

1. **Unauthenticated users** see sidebar but get prompts to sign up
2. **Sign up/in** via Google OAuth or email/password
3. **Stories** are private to each user
4. **Password reset** tokens expire in 1 hour

## Common Tasks

### Adding a New Component
1. Check `DESIGN-SYSTEM.md` for patterns
2. Import `ui.constants.ts` for values
3. Use classes from `shared.css`
4. Follow existing component structure

### Modifying Styles
1. Check if style exists in `shared.css`
2. Use constants from `ui.constants.ts`
3. Maintain 0.3s transitions
4. Keep spinning X on ALL close buttons

### API Changes
1. Backend routes require `authenticateToken` middleware
2. Frontend uses `api` service from `lib/api.ts`
3. Auth tokens sent automatically

## Important Notes

- **NEVER** create new close button styles - use `close-button-standard`
- **ALWAYS** make modals dismissible via Escape key
- **MAINTAIN** the pixelated Paper, Please aesthetic
- **USE** the design system files - they exist to ensure consistency
- **TEST** auth flows - features should prompt login when needed