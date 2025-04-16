#!/bin/bash

# Fundi Component Analyzer
# This script helps identify unused Fundi components in the codebase

set -e

# Create necessary directories
mkdir -p reports
mkdir -p backups

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "==========================================="
echo -e "   FUNDI COMPONENT ANALYZER   "
echo -e "==========================================="
echo -e ""

echo -e "Scanning for unused Fundi components..."
echo -e ""

# Get all Fundi-related files
find client/src -name "*fundi*" -o -name "*Fundi*" | grep -v "home-tour/fix-fundi-display.css" | sort > reports/fundi-files.txt

echo -e "${BLUE}Found Fundi-related files:${NC}"
cat reports/fundi-files.txt
echo -e ""

# Get all import statements
echo -e "Analyzing imports for Fundi components..."
grep -r "import .*from" --include="*.tsx" --include="*.ts" client/src > reports/all-imports.txt

# Check each Fundi file for imports
echo -e "${YELLOW}Potentially unused Fundi components:${NC}"
echo -e "" > reports/unused-fundi-components.txt

while IFS= read -r file; do
  filename=$(basename "$file")
  name_no_ext="${filename%.*}"
  
  # Skip CSS files
  if [[ "$filename" == *.css ]]; then
    continue
  fi
  
  # Get the relative path that might be used in imports
  relative_path=$(echo "$file" | sed 's|client/src/||' | sed 's|\.tsx\?$||')
  
  # Check if this file is imported anywhere
  imported=false
  
  # Check for direct imports by name
  if grep -q "from ['\"].*$name_no_ext['\"]" reports/all-imports.txt; then
    imported=true
  fi
  
  # Check for imports by path
  if grep -q "from ['\"].*$relative_path['\"]" reports/all-imports.txt || grep -q "from ['\"]@/$relative_path['\"]" reports/all-imports.txt; then
    imported=true
  fi
  
  # Check if it exports a default component that might be imported
  if grep -q "export default" "$file"; then
    component_name=$(grep -o "export default.*" "$file" | sed 's/export default //' | sed 's/{//g' | sed 's/}//g' | awk '{print $1}')
    if [ -n "$component_name" ] && grep -q "import $component_name from" reports/all-imports.txt; then
      imported=true
    fi
  fi
  
  if [ "$imported" = false ]; then
    echo -e "${RED}$file${NC} - not imported anywhere"
    echo "$file" >> reports/unused-fundi-components.txt
  else
    echo -e "${GREEN}$file${NC} - used in the application"
  fi
done < reports/fundi-files.txt

echo -e ""
echo -e "Analysis complete. Results saved to ${BLUE}reports/unused-fundi-components.txt${NC}"
echo -e ""
echo -e "Recommendation: Before removing any files, verify they are truly unused by:"
echo -e "1. Checking if they are dynamically imported"
echo -e "2. Checking if they are referenced by string literals"
echo -e "3. Making a backup before deleting anything"
echo -e ""