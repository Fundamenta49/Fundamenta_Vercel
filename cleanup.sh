#!/bin/bash

# Fundamenta Zombie Code Cleanup Script
# Purpose: Identify and clean up unused code, dependencies, and lint issues

# Create reports directory if it doesn't exist
mkdir -p reports

# Function to check if a command exists
command_exists() {
  command -v "$1" &> /dev/null
}

# Function to check if an npm package is installed
npm_package_exists() {
  npx --no-install "$1" --version &> /dev/null
  return $?
}

# Check for necessary tools
printf "\n🔧 Checking for required tools...\n"

MISSING_TOOLS=false

# Check for ESLint
if ! npm_package_exists eslint; then
  printf "❌ ESLint not found. Install with: npm install -D eslint\n"
  MISSING_TOOLS=true
else
  printf "✅ ESLint found.\n"
fi

# Check for ts-prune
if ! npm_package_exists ts-prune; then
  printf "❌ ts-prune not found. Install with: npm install -D ts-prune\n"
  MISSING_TOOLS=true
else
  printf "✅ ts-prune found.\n"
fi

# Check for depcheck
if ! npm_package_exists depcheck; then
  printf "❌ depcheck not found. Install with: npm install -D depcheck\n"
  MISSING_TOOLS=true
else
  printf "✅ depcheck found.\n"
fi

# Exit if tools are missing
if [ "$MISSING_TOOLS" = true ]; then
  printf "\n❌ Missing required tools. Please install them before running this script.\n"
  exit 1
fi

# Step 1: Linting with ESLint
printf "\n🔍 Running ESLint...\n"
npx eslint . --ext .ts,.tsx,.js,.jsx --fix > reports/eslint-report.txt 2>&1 || true
printf "✅ ESLint completed. Results saved to reports/eslint-report.txt\n"

# Step 2: Unused exports with ts-prune
printf "\n🔍 Scanning for unused exports with ts-prune...\n"
npx ts-prune > reports/ts-prune-report.txt 2>&1 || true
printf "✅ ts-prune completed. Results saved to reports/ts-prune-report.txt\n"

# Step 3: Unused dependencies with depcheck
printf "\n🔍 Checking for unused dependencies with depcheck...\n"
npx depcheck > reports/depcheck-report.txt 2>&1 || true
printf "✅ depcheck completed. Results saved to reports/depcheck-report.txt\n"

# Step 4: Find files that might be zombie code
printf "\n🔍 Finding potential zombie files...\n"
find client/src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | grep -v "node_modules" > reports/all-files.txt

# Find imports to identify potentially unused files
printf "Finding imports and generating potential zombie file list...\n"
grep -r "import.*from" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" client/src | grep -v "node_modules" > reports/imports.txt

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
echo " - eslint-report.txt"
echo " - ts-prune-report.txt"
echo " - depcheck-report.txt"
echo " - potential-zombie-files.txt"

# Optional: Git status to review pending changes
printf "\n📁 Git status overview:\n"
git status

# End of script
printf "\n🚀 Zombie cleanup complete. Review reports in /reports before manual deletion.\n"
printf "To install missing tools, run: npm install -D eslint ts-prune depcheck\n"