#!/bin/bash

# Test Engagement Engine
# Run this script after any updates to the codebase to ensure
# the Engagement Engine functionality remains stable

# Set text colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}    FUNDAMENTA ENGAGEMENT ENGINE TESTS   ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Function to check if a command was successful
check_status() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ $1 completed successfully${NC}"
    return 0
  else
    echo -e "${RED}✗ $1 failed${NC}"
    return 1
  fi
}

# Step 1: Verify Schema
echo -e "${YELLOW}Step 1: Verifying schema...${NC}"
node verify-engagement-schema.js
check_status "Schema verification" || exit 1
echo ""

# Step 2: Run DB Functions Tests (basic)
echo -e "${YELLOW}Step 2: Testing database functions (basic)...${NC}"
node test-db-functions.js
check_status "Database functions tests (basic)" || exit 1
echo ""

# Step 3: Ask if user wants to run advanced tests (which modify data)
echo -e "${YELLOW}Would you like to run advanced tests that modify data? (y/n)${NC}"
read -r run_advanced

if [[ $run_advanced == "y" || $run_advanced == "Y" ]]; then
  echo -e "${YELLOW}Step 3: Running advanced database tests...${NC}"
  node test-db-functions.js --advanced
  check_status "Advanced database tests" || exit 1
  echo ""
else
  echo -e "${YELLOW}Skipping advanced tests.${NC}"
  echo ""
fi

# Final message
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}    ALL ENGAGEMENT ENGINE TESTS PASSED   ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "Remember to run this script after any changes to the Engagement Engine code."
echo -e "Add it to your pre-commit hooks or CI/CD pipeline for automated testing."