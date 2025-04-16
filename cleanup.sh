#!/bin/bash

# Fundamenta Zombie Code Cleanup Script
# Purpose: Identify and clean up unused code, dependencies, and lint issues

# Create reports directory if it doesn't exist
mkdir -p reports

# Print notice about specialized tools
printf "\n🔧 Note: Advanced code analysis tools (ESLint, ts-prune, depcheck) are not installed.\n"
printf "   Using basic grep and find commands for zombie code detection.\n"
printf "   For more thorough analysis, install tools with: npm install -D eslint ts-prune depcheck\n\n"

# Step 4: Find files that might be zombie code
printf "\n🔍 Finding potential zombie files...\n"
find client/src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | grep -v "node_modules" > reports/all-files.txt

# Find imports to identify potentially unused files
printf "Finding imports and generating potential zombie file list...\n"
grep -r "import.*from" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" client/src | grep -v "node_modules" > reports/imports.txt

# Step 4.1: Find duplicate components with similar names
printf "\n🔍 Finding potential duplicate components...\n"
find client/src -type f -name "*.tsx" -o -name "*.jsx" | grep -v "node_modules" | xargs basename -a | sort | uniq -d > reports/duplicate-components.txt

# Step 4.2: Look for backup files or temporary files
printf "\n🔍 Finding backup and temporary files...\n"
find client/src -type f -name "*backup*" -o -name "*temp*" -o -name "*tmp*" -o -name "*.bak" -o -name "*-old*" -o -name "*-copy*" | grep -v "node_modules" > reports/backup-files.txt

# Create simple report of files that aren't imported anywhere (potential zombies)
cat reports/all-files.txt | while read file; do
  base_name=$(basename "$file" | sed 's/\.[^.]*$//')
  if ! grep -q "$base_name" reports/imports.txt; then
    # Exclude index files and common entry points
    if [[ "$base_name" != "index" && "$base_name" != "main" && "$base_name" != "App" ]]; then
      echo "$file" >> reports/potential-zombie-files.txt
    fi
  fi
done

# Check if the zombie files report was created
if [ -f reports/potential-zombie-files.txt ]; then
  printf "✅ Zombie file analysis completed. Results saved to reports/potential-zombie-files.txt\n"
else
  printf "📝 No potential zombie files identified.\n"
  touch reports/potential-zombie-files.txt
fi

# Step 5: Summary Output
printf "\n📄 Cleanup Reports Generated in /reports:\n"
echo " - potential-zombie-files.txt (Files not imported anywhere)"
echo " - duplicate-components.txt (Components with duplicate names)"
echo " - backup-files.txt (Backup and temporary files)"
echo " - all-files.txt (All source files)"
echo " - imports.txt (All import statements)"

# Optional: Git status to review pending changes
printf "\n📁 Git status overview:\n"
git status

# End of script
printf "\n🚀 Zombie cleanup complete. Review reports in /reports before manual deletion.\n"
printf "To install missing tools, run: npm install -D eslint ts-prune depcheck\n"