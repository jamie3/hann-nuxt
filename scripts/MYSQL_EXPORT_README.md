# MySQL Schema Export Script

This script connects to a MySQL RDS instance and exports all table schemas to a SQL file using native MySQL client tools.

## Installation

Install MySQL client tools (includes mysql and mysqldump):

**macOS:**

```bash
brew install mysql-client
# Add to PATH if needed
export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"
```

**Ubuntu/Debian:**

```bash
sudo apt-get install mysql-client
```

**CentOS/RHEL:**

```bash
sudo yum install mysql
```

## Configuration

The script uses environment variables for MySQL connection. Create a `.env` file or set these variables:

```bash
# MySQL Connection Settings
MYSQL_HOST=your-rds-endpoint.region.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=ghanndb
MYSQL_PASSWORD=your-password  # See "Getting Password from AWS Secrets Manager" below
MYSQL_DATABASE=hanndb
```

### Getting Password from AWS Secrets Manager

The MySQL password is stored in AWS Secrets Manager. To retrieve it:

**Using AWS CLI:**

```bash
# Retrieve the secret
aws secretsmanager get-secret-value \
  --secret-id your-secret-name \
  --query SecretString \
  --output text

# Set as environment variable
export MYSQL_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id your-secret-name \
  --query SecretString \
  --output text | jq -r '.password')
```

**Using AWS Console:**

1. Go to AWS Secrets Manager console
2. Find your database secret
3. Click "Retrieve secret value"
4. Copy the password value
5. Export it: `export MYSQL_PASSWORD='your-password-here'`

**Note:** Never commit the password to version control. Always use environment variables or AWS Secrets Manager.

### Default Values

If environment variables are not set, the script uses these defaults:

- `MYSQL_HOST`: localhost
- `MYSQL_PORT`: 3306
- `MYSQL_USER`: root
- `MYSQL_PASSWORD`: (empty)
- `MYSQL_DATABASE`: hann

## Usage

Run the export script:

```bash
npm run export-mysql-schema
# or
yarn export-mysql-schema
```

## Output

The script will:

1. Connect to the MySQL database
2. List all tables in the database
3. Export CREATE TABLE statements for each table
4. Include index information
5. Save everything to `schema-export.sql` in the project root

### Output File Format

The generated SQL file includes:

- Database metadata (name, generation timestamp)
- DROP TABLE statements (for clean imports)
- Complete CREATE TABLE statements
- Index definitions and comments
- Proper SQL formatting with comments

### Example Output

```sql
-- MySQL Schema Export
-- Database: hann
-- Generated: 2024-01-01T12:00:00.000Z

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for table `users`
-- UNIQUE INDEX `email`

...
```

## AWS RDS Connection

### Security Group Configuration

Ensure your RDS security group allows connections from your IP:

1. Go to AWS RDS Console
2. Select your database instance
3. Click on the VPC security group
4. Add an inbound rule for MySQL/Aurora (port 3306)
5. Source: Your IP or security group

### Connection String Format

For AWS RDS, your connection details will look like:

```bash
MYSQL_HOST=mydb.abc123xyz.us-east-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD=MySecurePassword123
MYSQL_DATABASE=production_db
```

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED
```

**Solutions:**

- Check if MySQL service is running
- Verify host and port are correct
- Check firewall/security group settings
- Ensure database is publicly accessible (if connecting remotely)

### Access Denied

```
Error: Access denied for user
```

**Solutions:**

- Verify username and password
- Check user has proper permissions
- Ensure user can connect from your IP

### Unknown Database

```
Error: Unknown database 'database_name'
```

**Solutions:**

- Verify database name is correct
- Check user has access to the database

## Script Features

✅ Connects to MySQL RDS instances  
✅ Exports complete table schemas  
✅ Includes CREATE TABLE statements  
✅ Captures index definitions  
✅ Handles multiple tables  
✅ Clean, formatted SQL output  
✅ Environment variable configuration  
✅ Error handling and reporting

## Notes

- The script exports **schema only** (no data)
- Generated file can be used to recreate tables
- All tables in the database are exported
- Output file is overwritten on each run
- Connection is automatically closed after export

## Next Steps

After exporting the schema, you can:

1. Review the `schema-export.sql` file
2. Import it to another database
3. Use it as documentation
4. Version control the schema
5. Create migration scripts from the differences
