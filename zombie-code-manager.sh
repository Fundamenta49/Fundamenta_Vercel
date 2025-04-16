#!/bin/bash

# Fundamenta Zombie Code Manager
# This script helps you find and clean up unused code in the project
# Run this script when you want to check for and remove zombie code

# Make the script executable
chmod +x cleanup.sh
chmod +x cleanup-zombie-code.sh

# Define colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Display header
echo -e "\n${BLUE}===========================================${NC}"
echo -e "${BLUE}   FUNDAMENTA ZOMBIE CODE MANAGER   ${NC}"
echo -e "${BLUE}===========================================${NC}\n"

# Display menu
echo -e "${GREEN}Available Actions:${NC}"
echo -e "  ${YELLOW}1${NC}. Scan for potential zombie code (generates reports only)"
echo -e "  ${YELLOW}2${NC}. Clean up identified zombie code (removes files with backup)"
echo -e "  ${YELLOW}3${NC}. View the latest scan reports"
echo -e "  ${YELLOW}0${NC}. Exit"
echo -e "\n${YELLOW}Note:${NC} Always scan before cleanup and review the reports carefully.\n"

# Get user choice
read -p "Enter your choice (0-3): " choice

case $choice in
    1)
        echo -e "\n${GREEN}Scanning for potential zombie code...${NC}"
        ./cleanup.sh
        echo -e "\n${GREEN}Scan complete.${NC} Please review the reports in the 'reports' directory."
        echo -e "Run this script again with option 2 to clean up identified files.\n"
        ;;
    2)
        echo -e "\n${YELLOW}WARNING:${NC} This will remove files identified as potential zombie code."
        echo -e "Backups will be created, but please ensure you have reviewed the reports first.\n"
        read -p "Are you sure you want to proceed? (y/n): " confirm
        if [[ $confirm == [Yy]* ]]; then
            echo -e "\n${GREEN}Cleaning up zombie code...${NC}"
            ./cleanup-zombie-code.sh
            echo -e "\n${GREEN}Cleanup complete.${NC}"
            echo -e "If you encounter any issues, restore files from the backup directory."
        else
            echo -e "\n${YELLOW}Cleanup canceled.${NC}"
        fi
        ;;
    3)
        echo -e "\n${GREEN}Available Reports:${NC}"
        ls -la reports/
        echo ""
        read -p "Enter report filename to view (or 'all' for all reports): " report
        if [[ $report == "all" ]]; then
            for file in reports/*.txt; do
                echo -e "\n${BLUE}========== $(basename $file) ==========${NC}"
                cat "$file"
            done
        elif [[ -f "reports/$report" ]]; then
            echo -e "\n${BLUE}========== $report ==========${NC}"
            cat "reports/$report"
        else
            echo -e "${RED}Report not found: $report${NC}"
        fi
        ;;
    0)
        echo -e "\n${GREEN}Exiting Zombie Code Manager.${NC}\n"
        exit 0
        ;;
    *)
        echo -e "\n${RED}Invalid choice.${NC} Please run the script again and enter a number from 0-3.\n"
        ;;
esac

# Display helpful reminder
echo -e "${YELLOW}Best Practices:${NC}"
echo "1. Always run a scan first (option 1) before cleaning up"
echo "2. Review the reports carefully before removing any files"
echo "3. Test your application after cleanup to ensure functionality"
echo -e "\n${BLUE}Run this script again any time you want to check for zombie code.${NC}\n"