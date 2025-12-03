#!/bin/bash

# MySQL Schema Export Script
# This script connects to a MySQL RDS instance and exports all table schemas to a SQL file

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - Read from environment or use defaults
# Check if SSH tunnel is running on port 3307
TUNNEL_RUNNING=false
if lsof -Pi :3307 -sTCP:LISTEN -t >/dev/null 2>&1; then
    TUNNEL_RUNNING=true
fi

# If tunnel is running and no explicit host is set, use 127.0.0.1:3307
# Note: Use 127.0.0.1 instead of localhost to force TCP connection (avoid Unix socket)
if [ "$TUNNEL_RUNNING" = true ] && [ -z "$MYSQL_HOST" ]; then
    MYSQL_HOST="127.0.0.1"
    MYSQL_PORT="3307"
else
    MYSQL_HOST="${MYSQL_HOST:-hanndb-instance-1.caxokwegqpck.ca-central-1.rds.amazonaws.com}"
    MYSQL_PORT="${MYSQL_PORT:-3306}"
fi

MYSQL_USER="${MYSQL_USER:-ghanndb}"
MYSQL_PASSWORD="${MYSQL_PASSWORD}"
MYSQL_DATABASE="${MYSQL_DATABASE:-hanndb}"
OUTPUT_FILE="${OUTPUT_FILE:-schema-export.sql}"

# Check if mysql client is installed
# On macOS with Homebrew, mysql-client may not be in PATH
MYSQL_BIN=""
MYSQLDUMP_BIN=""

# Check common locations for mysql
if command -v mysql &> /dev/null; then
    MYSQL_BIN="mysql"
elif [ -f "/opt/homebrew/opt/mysql-client/bin/mysql" ]; then
    MYSQL_BIN="/opt/homebrew/opt/mysql-client/bin/mysql"
elif [ -f "/usr/local/opt/mysql-client/bin/mysql" ]; then
    MYSQL_BIN="/usr/local/opt/mysql-client/bin/mysql"
else
    echo -e "${RED}Error: mysql command not found${NC}"
    echo "Please install MySQL client:"
    echo "  macOS: brew install mysql-client"
    echo "  Ubuntu/Debian: sudo apt-get install mysql-client"
    echo "  CentOS/RHEL: sudo yum install mysql-client"
    echo ""
    echo "After installation on macOS, reload your shell:"
    echo "  source ~/.zshrc"
    exit 1
fi

# Check for mysqldump
if command -v mysqldump &> /dev/null; then
    MYSQLDUMP_BIN="mysqldump"
elif [ -f "/opt/homebrew/opt/mysql-client/bin/mysqldump" ]; then
    MYSQLDUMP_BIN="/opt/homebrew/opt/mysql-client/bin/mysqldump"
elif [ -f "/usr/local/opt/mysql-client/bin/mysqldump" ]; then
    MYSQLDUMP_BIN="/usr/local/opt/mysql-client/bin/mysqldump"
else
    echo -e "${RED}Error: mysqldump command not found${NC}"
    echo "Please install mysql-client (includes mysqldump):"
    echo "  macOS: brew install mysql-client"
    echo "  Ubuntu/Debian: sudo apt-get install mysql-client"
    echo "  CentOS/RHEL: sudo yum install mysql-client"
    echo ""
    echo "After installation on macOS, reload your shell:"
    echo "  source ~/.zshrc"
    exit 1
fi

# Prompt for password if not set
if [ -z "$MYSQL_PASSWORD" ]; then
    echo -e "${YELLOW}MySQL password not set in environment${NC}"
    read -sp "Enter MySQL password: " MYSQL_PASSWORD
    echo
    if [ -z "$MYSQL_PASSWORD" ]; then
        echo -e "${RED}Password cannot be empty${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}MySQL Schema Export${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Host:     $MYSQL_HOST"
echo "Port:     $MYSQL_PORT"
echo "Database: $MYSQL_DATABASE"
echo "User:     $MYSQL_USER"
echo "Output:   $OUTPUT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test connection
echo -e "${YELLOW}Testing connection...${NC}"
if ! "$MYSQL_BIN" -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1;" "$MYSQL_DATABASE" &> /dev/null; then
    echo -e "${RED}✗ Failed to connect to MySQL${NC}"
    echo "Please check:"
    echo "  1. Host and port are correct"
    echo "  2. Username and password are correct"
    echo "  3. Database exists and is accessible"
    echo "  4. Network/firewall allows connection"
    exit 1
fi
echo -e "${GREEN}✓ Connection successful${NC}"
echo ""

# Get list of tables
echo -e "${YELLOW}Fetching table list...${NC}"
TABLES=$("$MYSQL_BIN" -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -N -e "SHOW TABLES;" "$MYSQL_DATABASE" 2>/dev/null)

if [ -z "$TABLES" ]; then
    echo -e "${YELLOW}No tables found in database '$MYSQL_DATABASE'${NC}"
    exit 0
fi

TABLE_COUNT=$(echo "$TABLES" | wc -l | tr -d ' ')
echo -e "${GREEN}✓ Found $TABLE_COUNT table(s)${NC}"
echo ""

# Export schema using mysqldump
echo -e "${YELLOW}Exporting schema...${NC}"

# Export schema only (no data)
# Format: mysqldump -u username -p --host=IP --port=PORT --no-data databasename > schema.sql
# Using --password flag for proper password handling
"$MYSQLDUMP_BIN" -u "$MYSQL_USER" --password="$MYSQL_PASSWORD" --host="$MYSQL_HOST" --port="$MYSQL_PORT" --no-data "$MYSQL_DATABASE" > "$OUTPUT_FILE" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Schema exported successfully${NC}"
    echo ""
    echo -e "${BLUE}Export Summary${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Output file: $OUTPUT_FILE"
    echo "File size:   $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo ""
    echo "Tables exported:"
    echo "$TABLES" | while read -r table; do
        echo "  - $table"
    done
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${GREEN}✓ Export complete!${NC}"
    echo ""
    echo "You can now:"
    echo "  1. Review the file: cat $OUTPUT_FILE"
    echo "  2. Import to another DB: mysql -h HOST -u USER -p DATABASE < $OUTPUT_FILE"
    echo "  3. Version control: git add $OUTPUT_FILE"
else
    echo -e "${RED}✗ Export failed${NC}"
    exit 1
fi
