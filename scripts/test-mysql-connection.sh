#!/bin/bash

# MySQL Connection Test Script
# This script tests the connection to a MySQL RDS instance

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

MYSQL_PASSWORD="sd^sd84Sdjna\$%ajnk1d90"

# If tunnel is running, use 127.0.0.1:3307 (overrides MYSQL_HOST if set)
# Note: Use 127.0.0.1 instead of localhost to force TCP connection (avoid Unix socket)
if [ "$TUNNEL_RUNNING" = true ]; then
    MYSQL_HOST="127.0.0.1"
    MYSQL_PORT="3307"
    echo -e "${GREEN}✓ Detected SSH tunnel running on port 3307${NC}"
    echo ""
else
    MYSQL_HOST="${MYSQL_HOST:-hanndb-instance-1.caxokwegqpck.ca-central-1.rds.amazonaws.com}"
    MYSQL_PORT="${MYSQL_PORT:-3306}"
fi

MYSQL_USER="${MYSQL_USER:-ghanndb}"
MYSQL_PASSWORD="${MYSQL_PASSWORD}"
MYSQL_DATABASE="${MYSQL_DATABASE:-hanndb}"

# Check if mysql client is installed
# On macOS with Homebrew, mysql-client may not be in PATH
MYSQL_BIN=""

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

# Display mysql binary location
MYSQL_BIN_PATH=$(which "$MYSQL_BIN" 2>/dev/null || echo "$MYSQL_BIN")
echo -e "${GREEN}Using mysql binary: $MYSQL_BIN_PATH${NC}"
echo ""

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

echo -e "${BLUE}MySQL Connection Test${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Host:     $MYSQL_HOST"
echo "Port:     $MYSQL_PORT"
echo "Database: $MYSQL_DATABASE"
echo "User:     $MYSQL_USER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test connection
echo -e "${YELLOW}Testing connection...${NC}"
CONNECTION_ERROR=$("$MYSQL_BIN" -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1;" "$MYSQL_DATABASE" 2>&1)
CONNECTION_STATUS=$?

if [ $CONNECTION_STATUS -ne 0 ]; then
    echo -e "${RED}✗ Connection failed${NC}"
    echo ""
    echo -e "${RED}MySQL Error:${NC}"
    echo "$CONNECTION_ERROR"
    echo ""
    echo "Possible issues:"
    echo "  1. Host or port is incorrect"
    echo "  2. Username or password is incorrect"
    echo "  3. Database doesn't exist or is not accessible"
    echo "  4. Network/firewall is blocking the connection"
    echo "  5. SSH tunnel is not established (if connecting through bastion)"
    echo ""
    echo "If connecting through an SSH tunnel:"
    echo "  - Run: ${YELLOW}./scripts/setup-mysql-tunnel.sh${NC}"
    echo "  - Then set: ${YELLOW}export MYSQL_HOST=localhost MYSQL_PORT=3307${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Connection successful!${NC}"
echo ""

# Get MySQL version
echo -e "${YELLOW}Fetching server information...${NC}"
SERVER_VERSION=$("$MYSQL_BIN" -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -N -e "SELECT VERSION();" "$MYSQL_DATABASE" 2>/dev/null)
echo -e "${GREEN}Server Version: $SERVER_VERSION${NC}"

# Get current database
CURRENT_DB=$("$MYSQL_BIN" -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -N -e "SELECT DATABASE();" "$MYSQL_DATABASE" 2>/dev/null)
echo -e "${GREEN}Current Database: $CURRENT_DB${NC}"

# Get table count
TABLE_COUNT=$("$MYSQL_BIN" -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$MYSQL_DATABASE';" "$MYSQL_DATABASE" 2>/dev/null)
echo -e "${GREEN}Table Count: $TABLE_COUNT${NC}"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}All checks passed! MySQL connection is working.${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
