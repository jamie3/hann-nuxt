# Authentication Setup Guide

This guide explains how to set up and use the authentication system in this Nuxt 4 application.

## Overview

The authentication system includes:
- Username/password login with bcrypt password hashing
- Session management via nuxt-auth-utils
- PostgreSQL database for user storage
- Server-side only authentication (never exposed to client)
- Form validation with vee-validate and zod
- Tailwind CSS styled login page

## Database Setup

### 1. Create the Database

Ensure you have PostgreSQL installed and create a database:

```bash
createdb hann_nuxt
```

### 2. Configure Database Connection

Copy the `.env.example` file to `.env` and update with your PostgreSQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=hann
```

### 3. Run the Migration

Apply the database migration to create the user table:

```bash
psql -U postgres -d hann -f server/database/migrations/001_create_users.sql
```

This creates:
- `user` table with id, username, password, created_at, updated_at
- Index on username for faster lookups
- Auto-updating updated_at trigger

## Creating Users

Use the provided script to create users with hashed passwords:

```bash
yarn create-user
```

The script will prompt you for:
- Username
- Password (will be hashed with bcrypt)

Example:
```
$ yarn create-user
Enter username: admin
Enter password: mypassword123

✓ User created successfully:
  ID: 1
  Username: admin
  Created at: 2024-11-30T18:30:00.000Z
```

## Using the Authentication System

### Login Page

Navigate to `/login` to access the login form. The page includes:
- Username and password fields
- Form validation (username required, password min 3 characters)
- Error handling for invalid credentials
- Tailwind CSS styling

### API Routes

#### POST /api/auth/login

Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "mypassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid username or password"
}
```

#### POST /api/auth/logout

Logout and clear the session.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Using Authentication in Your App

### Check if User is Logged In

Use the `useUserSession` composable provided by nuxt-auth-utils:

```vue
<script setup>
const { loggedIn, user, clear } = useUserSession()
</script>

<template>
  <div v-if="loggedIn">
    <p>Welcome, {{ user.username }}!</p>
    <button @click="clear">Logout</button>
  </div>
  <div v-else>
    <NuxtLink to="/login">Login</NuxtLink>
  </div>
</template>
```

### Protecting Routes

Create middleware to protect routes:

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession()
  
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
```

Use in pages:

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Server-Side Authentication Check

In server routes, you can check authentication:

```typescript
// server/api/protected-route.get.ts
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  
  // User is authenticated
  return {
    message: 'Protected data',
    user: session.user
  }
})
```

## Security Features

1. **Password Hashing**: All passwords are hashed with bcrypt (10 rounds)
2. **Server-Side Only**: Database queries and password verification only happen on the server
3. **Session Management**: Secure sessions managed by nuxt-auth-utils
4. **SQL Injection Protection**: Kysely provides type-safe, parameterized queries
5. **Input Validation**: Client-side validation with vee-validate and zod

## File Structure

```
server/
├── api/
│   └── auth/
│       ├── login.post.ts      # Login endpoint
│       └── logout.post.ts     # Logout endpoint
├── database/
│   └── migrations/
│       └── 001_create_users.sql  # User table migration
└── utils/
    └── db.ts                  # Database connection

pages/
└── login.vue                  # Login page with form

scripts/
└── create-user.ts            # User creation script
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Check your `.env` file has correct credentials
2. Verify PostgreSQL is running: `pg_isready`
3. Ensure the database exists: `psql -l`

### TypeScript Errors

If you see TypeScript errors about missing types:
```bash
yarn nuxt prepare
```

Then reload VSCode window (Cmd/Ctrl + Shift + P → "Reload Window")

### Session Not Persisting

Make sure you have a session secret set. nuxt-auth-utils will auto-generate one in development, but for production, set:

```env
NUXT_SESSION_PASSWORD=your-secret-key-here-min-32-chars
```

## Next Steps

1. Add password reset functionality
2. Implement email verification
3. Add multi-factor authentication
4. Create user profile management
5. Add role-based access control (RBAC)
