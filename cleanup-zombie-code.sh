#!/bin/bash

# Fundamenta Zombie Code Cleanup Script
# Purpose: Clean up unused files, backups, and duplicates found by the analysis script

# Create backup directory
BACKUP_DIR="zombie-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating backup of files in $BACKUP_DIR before removal..."

# Function to safely backup and remove a file
backup_and_remove() {
  local file=$1
  if [ -f "$file" ]; then
    # Create directory structure in backup
    local dir_path=$(dirname "$file")
    mkdir -p "$BACKUP_DIR/$dir_path"
    
    # Copy to backup
    cp "$file" "$BACKUP_DIR/$file"
    echo "✓ Backed up: $file"
    
    # Remove original
    rm "$file"
    echo "✓ Removed: $file"
  else
    echo "⚠️ File not found: $file"
  fi
}

echo -e "\n=== CLEANING UP BACKUP FILES ==="
# Process backup files
cat reports/backup-files.txt | while read file; do
  if [[ "$file" == *".bak" || "$file" == *"backup"* || "$file" == *"-old"* || "$file" == *"-copy"* ]]; then
    backup_and_remove "$file"
  fi
done

echo -e "\n=== CLEANING UP POTENTIAL ZOMBIE FILES ==="
# Process zombie files
cat reports/potential-zombie-files.txt | while read file; do
  # Skip speech-recognition.d.ts as it might be a type declaration file
  if [[ "$file" != *"speech-recognition.d.ts"* ]]; then
    backup_and_remove "$file"
  fi
done

echo -e "\n=== CLEANUP SUMMARY ==="
echo "✅ Backup of all removed files created in: $BACKUP_DIR"
echo "✅ Cleanup complete"
echo ""
echo "If you encounter any issues, restore files from the backup directory."
echo "To verify everything still works, restart your application and test functionality."