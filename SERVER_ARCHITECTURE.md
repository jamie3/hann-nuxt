# Server Architecture

This Nuxt 4 application is configured for full server-side rendering (SSR) with all data fetching proxied through server routes.

## Server Routes

All API routes are defined in the `server/api/` directory and run **exclusively on the server**. These routes are never exposed to the client.

### Creating API Routes

Create files in `server/api/` with HTTP method suffixes:

```typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const db = useDB()
  const users = await db.selectFrom('users').selectAll().execute()
  
  return { users }
})

// server/api/users.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = useDB()
  
  const result = await db
    .insertInto('users')
    .values(body)
    .execute()
  
  return { success: true, id: result.insertId }
})
```

### Calling API Routes from Pages/Components

Use Nuxt's built-in composables to call server routes:

```vue
<script setup lang="ts">
// Fetch data on server and client (automatic hydration)
const { data, error, refresh } = await useFetch('/api/users')

// Or using useAsyncData for more control
const { data: user } = await useAsyncData('user', () => 
  $fetch('/api/users/1')
)

// For client-side only requests
const submitForm = async () => {
  await $fetch('/api/users', {
    method: 'POST',
    body: { name: 'John Doe', email: 'john@example.com' }
  })
}
</script>
```

## Database Access

Database queries should **only** be performed in server routes or server middleware:

```typescript
// ✅ CORRECT: In server/api/ route
export default defineEventHandler(async (event) => {
  const db = useDB()
  const results = await db.selectFrom('table').selectAll().execute()
  return results
})

// ❌ WRONG: Never in pages/components
<script setup>
const db = useDB() // This will fail on client-side
</script>
```

## Server Middleware

Create server middleware in `server/middleware/` for cross-cutting concerns:

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // Authentication logic
  const token = getHeader(event, 'authorization')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
})
```

## Route Handlers

All route handlers run on the server and have access to:
- `useDB()` - Database connection
- `readBody(event)` - Parse request body
- `getQuery(event)` - Get query parameters
- `getRouterParam(event, 'id')` - Get route parameters
- `setResponseStatus(event, 200)` - Set response status
- `createError()` - Throw HTTP errors

## Benefits of Server-Side Proxying

1. **Security**: Database credentials and queries never exposed to client
2. **Performance**: Reduced client bundle size
3. **SEO**: Content rendered on server for better indexing
4. **Data Privacy**: Sensitive operations stay server-side
5. **API Protection**: Rate limiting and authentication on server

## Environment Variables

All database credentials are loaded server-side only from `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=hann
```

These are **never** exposed to the client.

## SSR Configuration

The app is configured in `nuxt.config.ts` with SSR enabled by default (Nuxt 4 default):

```typescript
export default defineNuxtConfig({
  // SSR is enabled by default in Nuxt 4
  // All pages render on server first, then hydrate on client
})
```

## Data Flow

```
Client Request
    ↓
Nuxt Server (SSR)
    ↓
Server API Route (/server/api/)
    ↓
Database Query (useDB())
    ↓
Response to Client
    ↓
Hydration on Client
```

## Best Practices

1. **Always use server routes** for database access
2. **Use `useFetch()` or `useAsyncData()`** in pages/components
3. **Never import database utilities** in client-side code
4. **Validate input** in server routes before database queries
5. **Handle errors** with `createError()` for proper HTTP responses
6. **Use TypeScript** for type-safe database queries with Kysely
