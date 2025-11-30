Rules

- Always use zod.
- Use kysely migrations not raw SQL.

Kysely Rules

- By default dont add indexes
- Add updated_at and created_at should be timestampz

Nuxt

- Use Nuxt Pages

Service Layer

- Service code shall reside in the server/service folder.

Repository Layer

- Repository code shall reside in server/repository.
- There should be a base repository that uses generics and supports insert, update, findAll, findById

1. Login/Logout

- Create a /login route with username and password.
- Create a /logout route
- The login should query the database table 'user'
- It should create a session which can be used
- The logout should destroy the session
- Create a login page

2. Database Migrations

- Create a db migration with a user table. It should have a last_login_at timestampz.

3. Health page

- Create a health page which calls the health route

4. Index page

- Contains a welcome message

5. Sidebar Component

- Menu items
  > Users
  > Settings
  > Referrals
  > Clients

5. Navbar

- Show logged in user
- > Drop down with Logout

6. Default Layout

- This will contain the Sidebar and Navbar

7. Login Layout

- Used by the login page

8. Authentication

- All pages by default should be protected using the global auth middleware.
- This middleware checks if the user is logged in and has a session
- It should use nuxt auth util
- This would be associated with the user table
