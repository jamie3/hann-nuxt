#!/bin/bash

# MySQL SSH Tunnel Setup Script
# This script creates an SSH tunnel from your local machine to a MySQL RDS instance through an EC2 bastion host

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PEM_FILE="$SCRIPT_DIR/hann-mysql-ec2.pem"
EC2_HOST="ec2-3-96-173-161.ca-central-1.compute.amazonaws.com"
EC2_USER="ec2-user"
LOCAL_PORT="3307"
REMOTE_PORT="3306"

# RDS endpoint
RDS_ENDPOINT="${MYSQL_RDS_ENDPOINT:-hanndb-instance-1.caxokwegqpck.ca-central-1.rds.amazonaws.com}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PEM file exists
if [ ! -f "$PEM_FILE" ]; then
    echo -e "${RED}Error: PEM file '$PEM_FILE' not found!${NC}"
    echo "Please ensure the PEM file is in the current directory."
    exit 1
fi

# Check PEM file permissions
CURRENT_PERMS=$(stat -f "%A" "$PEM_FILE" 2>/dev/null || stat -c "%a" "$PEM_FILE" 2>/dev/null)
if [ "$CURRENT_PERMS" != "400" ] && [ "$CURRENT_PERMS" != "600" ]; then
    echo -e "${YELLOW}Warning: PEM file has incorrect permissions. Setting to 400...${NC}"
    chmod 400 "$PEM_FILE"
fi

# Check if RDS endpoint is set
if [ "$RDS_ENDPOINT" = "your-rds-endpoint.region.rds.amazonaws.com" ]; then
    echo -e "${YELLOW}Warning: Using default RDS endpoint placeholder${NC}"
    echo "Set the MYSQL_RDS_ENDPOINT environment variable or update the script with your actual RDS endpoint"
    echo ""
    read -p "Enter your RDS endpoint: " user_rds_endpoint
    if [ -n "$user_rds_endpoint" ]; then
        RDS_ENDPOINT="$user_rds_endpoint"
    else
        echo -e "${RED}No RDS endpoint provided. Exiting.${NC}"
        exit 1
    fi
fi

# Check if tunnel is already running
if lsof -Pi :$LOCAL_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Port $LOCAL_PORT is already in use.${NC}"
    read -p "Do you want to kill the existing process? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        PID=$(lsof -ti:$LOCAL_PORT)
        kill $PID 2>/dev/null
        sleep 2
        echo -e "${GREEN}Killed process on port $LOCAL_PORT${NC}"
    else
        echo "Exiting. Please free up port $LOCAL_PORT or use a different port."
        exit 1
    fi
fi

echo -e "${GREEN}Setting up SSH tunnel...${NC}"
echo "EC2 Host: $EC2_HOST"
echo "RDS Endpoint: $RDS_ENDPOINT"
echo "Local Port: $LOCAL_PORT"
echo "Remote Port: $REMOTE_PORT"
echo ""
echo -e "${YELLOW}Establishing connection...${NC}"

# Create SSH tunnel
# -i: identity file (PEM)
# -N: Don't execute remote command
# -L: Local port forwarding
# -f: Go to background after authentication
ssh -i "$PEM_FILE" \
    -N \
    -L ${LOCAL_PORT}:${RDS_ENDPOINT}:${REMOTE_PORT} \
    ${EC2_USER}@${EC2_HOST} \
    -o ServerAliveInterval=60 \
    -o ServerAliveCountMax=3 \
    -o StrictHostKeyChecking=no &

SSH_PID=$!
sleep 3

# Check if tunnel was established
if ps -p $SSH_PID > /dev/null 2>&1; then
    echo -e "${GREEN}✓ SSH tunnel established successfully!${NC}"
    echo ""
    echo "Connection Details:"
    echo "  Host: localhost"
    echo "  Port: $LOCAL_PORT"
    echo "  Process ID: $SSH_PID"
    echo ""
    echo "You can now connect to MySQL using:"
    echo -e "${YELLOW}  mysql -h localhost -P $LOCAL_PORT -u your_username -p${NC}"
    echo ""
    echo "Or set these environment variables:"
    echo -e "${YELLOW}  export MYSQL_HOST=localhost${NC}"
    echo -e "${YELLOW}  export MYSQL_PORT=$LOCAL_PORT${NC}"
    echo ""
    echo "To close the tunnel, run:"
    echo -e "${YELLOW}  kill $SSH_PID${NC}"
    echo "Or use: ${YELLOW}./scripts/close-mysql-tunnel.sh${NC}"
    echo ""
    
    # Save PID for easy cleanup
    echo $SSH_PID > .mysql-tunnel-pid
else
    echo -e "${RED}✗ Failed to establish SSH tunnel${NC}"
    echo "Please check:"
    echo "  1. PEM file is correct and has proper permissions"
    echo "  2. EC2 host is accessible"
    echo "  3. Security groups allow SSH access"
    echo "  4. RDS endpoint is correct"
    exit 1
fi
