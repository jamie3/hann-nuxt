# Migration to UUID Primary Keys

This document describes the migration from integer `serial` primary keys to UUID primary keys for all database tables.

## Changes Made

### 1. New Database Structure

- **Location**: Moved from `server/database/migrations/` to `db/migrations/`
- **Helper files**: Moved to `db/helpers/`
- **Migrator**: Created `db/migrator.ts`

### 2. Updated Migrations

**db/migrations/001_create_user_table.ts**

- Changed `id` from `serial` to `uuid`
- Uses `uuid_generate_v4()` for automatic UUID generation
- Enables `uuid-ossp` PostgreSQL extension

**db/migrations/002_create_referral_table.ts**

- Changed `id` from `serial` to `uuid`
- Uses `uuid_generate_v4()` for automatic UUID generation

### 3. Type Updates

**server/types/database-types.ts**

- Changed all `id` fields from `Generated<number>` to `Generated<string>`

**server/types/referral-types.ts**

- Changed `Referral.id` from `number` to `string`

**server/repository/base-repository.ts**

- Updated all ID parameters from `number` to `string | number`
- Supports both for backward compatibility

### 4. Code Updates

**Repository Layer:**

- `server/repository/referral-repository.ts`: Updated `findByIdRow` to accept `string`

**Service Layer:**

- `server/service/referral-service.ts`: Updated `getReferralById` to accept `string`

**API Layer:**

- `server/api/referrals/[id].get.ts`: Removed `parseInt()` call, now passes ID as string

**Scripts:**

- `scripts/migrate.ts`: Updated to use `db/migrator.ts`
- `scripts/migrate-down.ts`: Created for migration rollback, uses `db/migrations/`

## Running the Migration

### Prerequisites

1. Backup your database
2. Ensure you have PostgreSQL with uuid-ossp extension support

### Steps

1. **Drop existing tables** (if any):

   ```bash
   # Run twice to drop both tables
   tsx scripts/migrate-down.ts
   tsx scripts/migrate-down.ts
   ```

2. **Run new migrations**:

   ```bash
   npm run migrate
   # or
   yarn migrate
   ```

3. **Verify migration**:
   ```sql
   \d user
   \d referral
   ```
   Both tables should now have `id uuid` as the primary key.

## Benefits of UUIDs

1. **Distributed Systems**: UUIDs can be generated independently without coordination
2. **Security**: No sequential ID enumeration attacks
3. **Merging Data**: Easier to merge data from different sources
4. **API Security**: IDs are not predictable

## Impact on Application

### What Changed:

- All ID references are now strings (UUID format)
- API endpoints accept UUID strings instead of integers
- Database queries use UUID comparison

### What Stayed the Same:

- API response structure (IDs just changed type)
- Repository/Service architecture
- Business logic

## Rollback

If you need to rollback to integer IDs:

1. Run migration down until all tables are dropped
2. Restore the old migrations from `server/database/migrations/`
3. Run migrations up

## Notes

- UUIDs are stored as 16-byte values in PostgreSQL (more efficient than string storage)
- The `uuid-ossp` extension is required for `uuid_generate_v4()`
- Existing references in code now use `string` type for IDs
- TypeScript will catch any code still using `number` for IDs
