# Scripts

This directory contains utility scripts for database management, user management, and MySQL connections.

## User Management Scripts

### `create-user.ts`

Creates a new user account in the database.

**Usage:**

```bash
yarn create-user
```

**Features:**

- Interactive prompts for username and password
- Hashes passwords using bcrypt (10 rounds)
- Supports multiple environments (development, test, production)
- SSL support for test and production environments

**Example:**

```bash
yarn create-user
# Enter username: john.doe
# Enter password: ********

✓ User created successfully:
  ID: 1
  Username: john.doe
  Created at: 2026-01-31T13:30:00.000Z
```

**For different environments:**

```bash
yarn create-user --env production
yarn create-user --env test
```

### `change-password.ts`

Changes the password for an existing user account.

**Usage:**

```bash
yarn change-password
```

**Features:**

- Interactive prompts for username and new password
- Hidden password input (displays asterisks)
- Password confirmation
- Minimum password length validation (6 characters)
- Automatically resets failed login attempts to 0
- Unlocks the account if it was locked
- Hashes passwords using bcrypt (10 rounds)
- Supports multiple environments (development, test, production)
- SSL support for test and production environments

**Example:**

```bash
yarn change-password
# Enter username: john.doe
# Found user: john.doe (ID: 1)
# Enter new password: ********
# Confirm new password: ********

✓ Password changed successfully
  - Password updated
  - Failed login attempts reset to 0
  - Account unlocked (if it was locked)
```

**For different environments:**

```bash
yarn change-password --env production
yarn change-password --env test
```

---

## MySQL Connection Scripts

This section contains scripts for connecting to the MySQL RDS database through an EC2 SSH tunnel (bastion host).

## Overview

The database is not directly accessible from the public internet. To connect, you must:

1. Establish an SSH tunnel through the EC2 bastion host
2. Connect to MySQL through the tunnel on localhost:3307

```
Your Machine → SSH Tunnel (port 3307) → EC2 Bastion → RDS MySQL
```

## Prerequisites

### 1. Install mysql-client

**macOS (Homebrew):**

```bash
brew install mysql-client
```

After installation, the scripts will automatically detect mysql-client in Homebrew's installation directories. If you prefer to add it to your PATH manually:

```bash
echo 'export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Ubuntu/Debian:**

```bash
sudo apt-get install mysql-client
```

**CentOS/RHEL:**

```bash
sudo yum install mysql-client
```

### 2. PEM File

Ensure `hann-mysql-ec2.pem` exists in the `scripts/` directory with correct permissions (400):

```bash
chmod 400 scripts/hann-mysql-ec2.pem
```

### 3. Environment Variables

Set the MySQL password in your environment:

```bash
export MYSQL_PASSWORD="your-password-here"
```

Optionally configure other connection details (defaults are already set):

```bash
export MYSQL_HOST="hanndb-instance-1.caxokwegqpck.ca-central-1.rds.amazonaws.com"
export MYSQL_PORT="3306"
export MYSQL_USER="ghanndb"
export MYSQL_DATABASE="hanndb"
```

## Available Scripts

### 1. `setup-mysql-tunnel.sh`

Establishes an SSH tunnel to the MySQL RDS instance through the EC2 bastion host.

**Configuration:**

- **EC2 Host:** `ec2-15-222-238-198.ca-central-1.compute.amazonaws.com`
- **Local Port:** 3307
- **Remote Port:** 3306 (MySQL default)

**Usage:**

```bash
./scripts/setup-mysql-tunnel.sh
```

**Output:**

```
✓ SSH tunnel established successfully!

Connection Details:
  Host: localhost
  Port: 3307
  Process ID: 12345

You can now connect to MySQL using:
  mysql -h localhost -P 3307 -u your_username -p
```

The tunnel runs in the background. The process ID is saved to `.mysql-tunnel-pid` for easy cleanup.

### 2. `test-mysql-connection.sh`

Tests the MySQL connection and displays server information.

**Features:**

- Auto-detects if SSH tunnel is running on port 3307
- Tests connection and displays:
  - MySQL server version
  - Current database
  - Number of tables

**Usage:**

```bash
./scripts/test-mysql-connection.sh
```

**Output:**

```
✓ Detected SSH tunnel running on port 3307

MySQL Connection Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Host:     localhost
Port:     3307
Database: hanndb
User:     ghanndb
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Connection successful!

Server Version: 8.0.35
Current Database: hanndb
Table Count: 4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All checks passed! MySQL connection is working.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. `export-mysql-schema.sh`

Exports the database schema (table structures, no data) to a SQL file.

**Features:**

- Auto-detects SSH tunnel
- Exports CREATE TABLE statements
- Includes triggers, routines, and events
- Adds DROP TABLE statements for clean imports

**Usage:**

```bash
./scripts/export-mysql-schema.sh
```

**Custom output file:**

```bash
OUTPUT_FILE="my-schema.sql" ./scripts/export-mysql-schema.sh
```

**Output:**

```
✓ Connection successful

✓ Found 4 table(s)

✓ Schema exported successfully

Export Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Output file: schema-export.sql
File size:   15K

Tables exported:
  - user
  - referral
  - clinical_note
  - file
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. `close-mysql-tunnel.sh`

Closes the SSH tunnel established by `setup-mysql-tunnel.sh`.

**Usage:**

```bash
./scripts/close-mysql-tunnel.sh
```

## Quick Start Workflow

### First Time Setup

```bash
# 1. Install mysql-client
brew install mysql-client

# 2. Set MySQL password
export MYSQL_PASSWORD="your-password"

# 3. Establish SSH tunnel
./scripts/setup-mysql-tunnel.sh

# 4. Test connection
./scripts/test-mysql-connection.sh
```

### Daily Workflow

```bash
# Start tunnel (if not already running)
./scripts/setup-mysql-tunnel.sh

# Use MySQL
./scripts/test-mysql-connection.sh
./scripts/export-mysql-schema.sh

# When done
./scripts/close-mysql-tunnel.sh
```

## Connecting with MySQL Client

Once the tunnel is established, you can use the standard MySQL client:

```bash
# Interactive mode
mysql -h 127.0.0.1 -P 3307 -u ghanndb -p hanndb

# Execute a query
mysql -h 127.0.0.1 -P 3307 -u ghanndb -p -e "SHOW TABLES;" hanndb

# Import a SQL file
mysql -h 127.0.0.1 -P 3307 -u ghanndb -p hanndb < schema.sql
```

**Note:** Use `127.0.0.1` instead of `localhost` to force TCP connection. MySQL treats "localhost" specially and tries to use a Unix socket, which causes connection errors.

## Troubleshooting

### "Error: mysql-client is not installed"

Install mysql-client using the instructions in Prerequisites section.

### "Port 3307 is already in use"

A tunnel is already running. Either:

- Use the existing tunnel
- Close it first: `./scripts/close-mysql-tunnel.sh`
- Kill the process: `kill $(lsof -ti:3307)`

### "Connection failed" but tunnel is running

Check that:

1. The tunnel is actually connected: `lsof -Pi :3307 -sTCP:LISTEN`
2. Your password is correct
3. The RDS endpoint is accessible from the EC2 instance

### "Permission denied (publickey)"

Check PEM file permissions:

```bash
chmod 400 scripts/hann-mysql-ec2.pem
```

### Scripts can't find mysql/mysqldump

The scripts automatically check Homebrew installation paths. If you installed mysql-client elsewhere, add it to your PATH:

```bash
export PATH="/path/to/mysql-client/bin:$PATH"
```

## Environment Variables Reference

| Variable             | Default                | Description                                                       |
| -------------------- | ---------------------- | ----------------------------------------------------------------- |
| `MYSQL_HOST`         | Auto-detected          | MySQL host (localhost if tunnel detected, RDS endpoint otherwise) |
| `MYSQL_PORT`         | Auto-detected          | MySQL port (3307 if tunnel detected, 3306 otherwise)              |
| `MYSQL_USER`         | `ghanndb`              | MySQL username                                                    |
| `MYSQL_PASSWORD`     | _(required)_           | MySQL password (prompted if not set)                              |
| `MYSQL_DATABASE`     | `hanndb`               | Database name                                                     |
| `OUTPUT_FILE`        | `schema-export.sql`    | Output file for schema export                                     |
| `MYSQL_RDS_ENDPOINT` | `hanndb-instance-1...` | Direct RDS endpoint (used by tunnel setup)                        |

## Security Notes

1. **Never commit passwords** to version control
2. Use environment variables or prompt for sensitive data
3. Keep PEM file permissions at 400
4. The `.mysql-tunnel-pid` file is in `.gitignore`
5. Close tunnels when not in use

## Additional Resources

- [MySQL Client Documentation](https://dev.mysql.com/doc/refman/8.0/en/mysql.html)
- [SSH Tunneling Guide](https://www.ssh.com/academy/ssh/tunneling)
- [AWS RDS MySQL Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html)
