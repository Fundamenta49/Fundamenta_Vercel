#!/bin/bash

# Script to monitor codebase changes and run tests automatically
# Usage: ./schedule-test.sh [watch_directory]

# Default directory to watch (current directory if not specified)
WATCH_DIR=${1:-.}

# Set text colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}    FUNDAMENTA AUTOMATED TEST RUNNER     ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo -e "${YELLOW}Watching directory: ${WATCH_DIR} for changes${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop watching${NC}"
echo ""

# Store the initial state of the directory
LAST_MODIFIED=$(find ${WATCH_DIR} -type f -name "*.ts" -o -name "*.js" -not -path "*/node_modules/*" | xargs stat -c "%Y %n" 2>/dev/null | sort)

while true; do
    # Get the current state
    CURRENT_MODIFIED=$(find ${WATCH_DIR} -type f -name "*.ts" -o -name "*.js" -not -path "*/node_modules/*" | xargs stat -c "%Y %n" 2>/dev/null | sort)
    
    # Check if anything has changed
    if [ "$LAST_MODIFIED" != "$CURRENT_MODIFIED" ]; then
        echo -e "${GREEN}Changes detected! Running tests...${NC}"
        echo ""
        
        # Run tests but skip advanced tests by default by passing "n" to the prompt
        echo "n" | ./test-engagement.sh
        
        # Update the last modified state
        LAST_MODIFIED=$CURRENT_MODIFIED
        
        echo ""
        echo -e "${YELLOW}Continuing to watch for changes...${NC}"
    fi
    
    # Sleep for a bit to avoid high CPU usage
    sleep 5
done