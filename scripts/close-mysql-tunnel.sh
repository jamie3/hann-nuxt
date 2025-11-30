#!/bin/bash

# MySQL SSH Tunnel Close Script
# This script closes the SSH tunnel created by setup-mysql-tunnel.sh

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

LOCAL_PORT="3307"
PID_FILE=".mysql-tunnel-pid"

echo -e "${YELLOW}Closing MySQL SSH tunnel...${NC}"

# Check if PID file exists
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    
    # Check if process is still running
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        sleep 1
        
        # Verify it's killed
        if ! ps -p $PID > /dev/null 2>&1; then
            echo -e "${GREEN}✓ SSH tunnel closed (PID: $PID)${NC}"
            rm "$PID_FILE"
        else
            echo -e "${RED}Failed to kill process. Trying with SIGKILL...${NC}"
            kill -9 $PID
            sleep 1
            if ! ps -p $PID > /dev/null 2>&1; then
                echo -e "${GREEN}✓ SSH tunnel forcefully closed${NC}"
                rm "$PID_FILE"
            else
                echo -e "${RED}✗ Failed to close tunnel${NC}"
                exit 1
            fi
        fi
    else
        echo -e "${YELLOW}Process not running. Cleaning up PID file.${NC}"
        rm "$PID_FILE"
    fi
else
    # Try to find process by port
    if lsof -Pi :$LOCAL_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        PID=$(lsof -ti:$LOCAL_PORT)
        echo -e "${YELLOW}Found process on port $LOCAL_PORT (PID: $PID)${NC}"
        kill $PID
        sleep 1
        
        if ! ps -p $PID > /dev/null 2>&1; then
            echo -e "${GREEN}✓ SSH tunnel closed${NC}"
        else
            echo -e "${RED}✗ Failed to close tunnel${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}No tunnel found on port $LOCAL_PORT${NC}"
    fi
fi

echo "Tunnel closed. You can reconnect using ./scripts/setup-mysql-tunnel.sh"
