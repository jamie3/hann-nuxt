# MySQL to PostgreSQL Migration Guide

This guide explains how to migrate data from your legacy MySQL database to the new PostgreSQL database.

## Overview

The migration script (`migrate-mysql-to-postgres.ts`) directly queries your MySQL database and inserts the data into PostgreSQL, automatically handling:

- **ID Mapping**: Converts MySQL integer IDs to PostgreSQL UUIDs
- **Schema Transformation**: Maps MySQL fields to PostgreSQL schema
- **Data Validation**: Validates dates and required fields
- **Relationship Preservation**: Maintains referral → clinical notes relationships
- **Error Handling**: Continues on errors with detailed logging

## Prerequisites

### 1. MySQL Database Access

You need access to the MySQL database through the SSH tunnel (as documented in `scripts/README.md`):

```bash
# Start the SSH tunnel (if not already running)
./scripts/setup-mysql-tunnel.sh
```

This creates a tunnel on `localhost:3307`.

### 2. PostgreSQL Database Setup

Your PostgreSQL database must be running with all migrations applied:

```bash
# Run migrations
yarn db:migrate

# Verify database is ready
psql -h localhost -p 5432 -U postgres -d hann -c "SELECT COUNT(*) FROM referral;"
```

### 3. Environment Configuration

Add MySQL credentials to your `.env` file:

```bash
# PostgreSQL (already configured)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=hann

# MySQL (add these)
MYSQL_HOST=localhost
MYSQL_PORT=3307
MYSQL_USER=ghanndb
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=hanndb

# Optional: Skip deleted records
SKIP_DELETED=true
```

## Running the Migration

### Step 1: Verify Connections

Test both database connections:

```bash
# Test MySQL (through tunnel)
mysql -h 127.0.0.1 -P 3307 -u ghanndb -p hanndb -e "SELECT COUNT(*) FROM clients;"

# Test PostgreSQL
psql -h localhost -p 5432 -U postgres -d hann -c "SELECT COUNT(*) FROM referral;"
```

### Step 2: Run Migration

Execute the migration script:

```bash
yarn db:import-mysql
```

Or directly with tsx:

```bash
npx tsx scripts/migrate-mysql-to-postgres.ts
```

### Step 3: Monitor Progress

The script will show real-time progress:

```
🚀 Starting MySQL to PostgreSQL migration...

Connecting to MySQL at localhost:3307...
✅ MySQL connection established

MySQL clients table has 7358 records
✅ PostgreSQL connection successful

📥 Migrating referrals from MySQL to PostgreSQL...

Found 7358 clients in MySQL database

  ✓ Imported 100 referrals...
  ✓ Imported 200 referrals...
  ...

✅ Referral migration complete:
   - Imported: 7200
   - Skipped: 150
   - Errors: 8

📥 Migrating clinical notes from MySQL to PostgreSQL...

Found 18732 clinical notes in MySQL database

  ✓ Imported 100 clinical notes...
  ✓ Imported 200 clinical notes...
  ...

✅ Clinical notes migration complete:
   - Imported: 18500
   - Skipped: 200
   - Errors: 32

🎉 Migration complete!
```

## Data Transformation

### Referrals (clients → referral)

| MySQL Field             | PostgreSQL Field           | Transformation                             |
| ----------------------- | -------------------------- | ------------------------------------------ |
| `id`                    | `id`                       | INT → UUID (auto-generated)                |
| `first_name`            | `first_name`               | Direct copy                                |
| `last_name`             | `last_name`                | Direct copy                                |
| `dob`                   | `date_of_birth`            | DATE → TIMESTAMPTZ                         |
| `phone`                 | `primary_telephone`        | Direct copy                                |
| `phone_2`               | `secondary_telephone`      | Direct copy                                |
| `email`                 | `email`                    | Direct copy                                |
| `address`               | `mailing_address`          | Direct copy                                |
| `parents`               | `parents_guardians`        | Direct copy                                |
| `therapy`               | `requested_service`        | Direct copy                                |
| `notes`                 | `presenting_issues`        | Direct copy                                |
| `referral_type`         | `referral_type`            | Direct copy                                |
| `referrer_name`         | `referrer_name`            | Direct copy                                |
| `referrer_relationship` | `referrer_relationship`    | Direct copy                                |
| `referrer_email`        | `referrer_email`           | Direct copy                                |
| `file_opened`           | `opened_at`                | DATE → TIMESTAMPTZ                         |
| `file_closed`           | `closed_at`                | DATE → TIMESTAMPTZ                         |
| `referral_date`         | `referred_at`              | DATE → TIMESTAMPTZ                         |
| `last_updated`          | `updated_at`               | TIMESTAMP → TIMESTAMPTZ                    |
| `archived`, `closed`    | `status`                   | Computed: archived→archived, closed→closed |
| `deleted`               | `is_deleted`               | TINYINT(1) → BOOLEAN                       |
| -                       | `method_of_payment`        | Set to NULL                                |
| -                       | `referrer_prefers_contact` | Set to FALSE                               |

### Clinical Notes (clinical_note → clinical_note)

| MySQL Field     | PostgreSQL Field | Transformation                 |
| --------------- | ---------------- | ------------------------------ |
| `id`            | `id`             | BIGINT → UUID (auto-generated) |
| `client_id`     | `referral_id`    | INT → UUID (via ID mapping)    |
| `clinical_note` | `content`        | Direct copy                    |
| `session_date`  | `session_date`   | DATE → TIMESTAMPTZ             |
| `created`       | `created_at`     | DATETIME → TIMESTAMPTZ         |
| `updated`       | `updated_at`     | TIMESTAMP → TIMESTAMPTZ        |
| `deleted`       | `is_deleted`     | TINYINT(1) → BOOLEAN           |
| -               | `author_id`      | Set to NULL (no author data)   |

### Status Determination

The script determines the PostgreSQL `status` field from MySQL flags:

```
IF archived = 1 THEN status = 'archived'
ELSE IF closed = 1 THEN status = 'closed'
ELSE status = 'open'
```

### Date Handling

The script handles various date formats:

- **Valid dates**: Converted to JavaScript Date objects
- **Invalid dates**: `0000-00-00` or `0000-00-00 00:00:00` → `NULL`
- **Missing dates**: Use fallback values where required (e.g., `referred_at` falls back to current date)

## Skipped Records

Records may be skipped for the following reasons:

### Referrals

- **Invalid date of birth**: DOB is NULL, '0000-00-00', or invalid
- **Deleted records**: If `SKIP_DELETED=true` and `deleted=1`

### Clinical Notes

- **Missing client**: `client_id` doesn't exist or wasn't imported
- **Deleted records**: If `SKIP_DELETED=true` and `deleted=1`

## Error Handling

The script continues processing even when individual records fail. Common errors:

### "Invalid date of birth"

```
⚠️  Skipping client 123: Invalid date of birth
```

**Fix**: Update the DOB in MySQL before re-running, or manually add after migration.

### "Client not found"

```
⚠️  Skipping note 789: Client 123 not found
```

**Fix**: Ensure the referenced client was successfully imported.

### Duplicate key violations

```
❌ Error importing client 456: duplicate key value violates unique constraint
```

**Fix**: Clear PostgreSQL tables and re-run migration, or skip already-imported records.

## Post-Migration Verification

### 1. Check Record Counts

```bash
# MySQL
mysql -h 127.0.0.1 -P 3307 -u ghanndb -p hanndb -e "
  SELECT
    (SELECT COUNT(*) FROM clients) as mysql_clients,
    (SELECT COUNT(*) FROM clinical_note) as mysql_notes;"

# PostgreSQL
psql -h localhost -p 5432 -U postgres -d hann -c "
  SELECT
    (SELECT COUNT(*) FROM referral) as pg_referrals,
    (SELECT COUNT(*) FROM clinical_note) as pg_notes;"
```

### 2. Verify Relationships

```sql
-- PostgreSQL: Check clinical notes have valid referral IDs
SELECT COUNT(*)
FROM clinical_note cn
LEFT JOIN referral r ON cn.referral_id = r.id
WHERE r.id IS NULL;
-- Should return 0
```

### 3. Sample Data Review

```sql
-- Compare a few records manually
-- MySQL
SELECT * FROM clients WHERE id = 100;

-- PostgreSQL (you'll need to find the UUID)
SELECT * FROM referral WHERE first_name = 'John' AND last_name = 'Doe';
```

### 4. Test Application

Start your application and verify:

- Referrals display correctly
- Clinical notes are linked to the right referrals
- Dates are formatted properly
- All functionality works as expected

## Troubleshooting

### MySQL Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:3307
```

**Solutions**:

1. Check SSH tunnel is running: `lsof -Pi :3307`
2. Restart tunnel: `./scripts/setup-mysql-tunnel.sh`
3. Verify MySQL credentials in `.env`

### PostgreSQL Connection Failed

```
Error: password authentication failed for user "postgres"
```

**Solutions**:

1. Verify PostgreSQL is running
2. Check credentials in `.env`
3. Test connection: `psql -h localhost -p 5432 -U postgres -d hann`

### Out of Memory

If migrating a very large database:

1. The script processes records one at a time (no memory issues expected)
2. If issues persist, migrate in batches by modifying the SQL query:

```typescript
// In the script, modify the query:
const [rows] = await mysql.query('SELECT * FROM clients WHERE id BETWEEN ? AND ? ORDER BY id', [
  startId,
  endId,
]);
```

### Migration Already Completed

To re-run the migration, first clear the PostgreSQL tables:

```sql
-- Connect to PostgreSQL
psql -h localhost -p 5432 -U postgres -d hann

-- Clear data (WARNING: This deletes all data!)
TRUNCATE TABLE clinical_note CASCADE;
TRUNCATE TABLE referral CASCADE;
```

## Performance

- **Speed**: ~100-200 records/second (depends on network and database performance)
- **Memory**: Constant memory usage (processes one record at a time)
- **Duration**: For 7,000 referrals + 18,000 notes: ~3-5 minutes

## Safety Features

1. **Read-only MySQL**: Only reads from MySQL, never modifies
2. **Transactional**: Each record is a separate transaction
3. **Continue on error**: Won't stop on individual failures
4. **Detailed logging**: All actions are logged
5. **Reversible**: Can clear PostgreSQL and re-run

## Clean-up

After successful migration and verification:

1. Keep the SSH tunnel scripts for future maintenance
2. Keep the migration script for reference
3. Update your `.env` to remove MySQL credentials (if no longer needed)
4. Consider backing up the MySQL database as archive

```bash
# Backup MySQL before archiving
mysqldump -h 127.0.0.1 -P 3307 -u ghanndb -p hanndb > mysql-backup-$(date +%Y%m%d).sql
```

## Support

If you encounter issues:

1. Check the migration output for specific error messages
2. Review this documentation
3. Verify both database connections independently
4. Check environment variables are set correctly
5. Ensure all PostgreSQL migrations have been applied
