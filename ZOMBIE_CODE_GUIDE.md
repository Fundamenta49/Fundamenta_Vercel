# Zombie Code Management Guide

This guide explains how to use the zombie code management tools to keep your codebase clean and maintainable.

## What is Zombie Code?

Zombie code includes:
- Unused files that aren't imported anywhere
- Backup files with extensions like `.bak` or including words like `backup`, `temp`, etc.
- Duplicate components with similar functionality
- Dead code paths that are never executed

## Available Tools

### 1. Zombie Code Manager (Recommended)

The easiest way to manage zombie code is using the zombie code manager script:

```bash
./zombie-code-manager.sh
```

This interactive script provides options to:
- Scan for potential zombie code
- Clean up identified zombie code
- View reports of potential issues

### 2. Manual Process

If you prefer, you can use the individual scripts directly:

1. **Scan for zombie code**:
   ```bash
   ./cleanup.sh
   ```
   This generates reports in the `reports/` directory but doesn't delete anything.

2. **Review reports**:
   - `potential-zombie-files.txt`: Files not imported anywhere
   - `duplicate-components.txt`: Components with duplicate names
   - `backup-files.txt`: Backup and temporary files

3. **Clean up identified files**:
   ```bash
   ./cleanup-zombie-code.sh
   ```
   This removes files listed in the reports and creates backups in a timestamped directory.

## Best Practices

1. **Always scan first**: Run a scan before attempting cleanup to generate up-to-date reports.

2. **Review reports carefully**: Before deleting any files, review the reports to ensure you're not removing critical code.

3. **Test after cleanup**: After removing files, thoroughly test the application to ensure all functionality still works.

4. **Restore when needed**: If you accidentally remove a needed file, restore it from the backup directory.

## When to Run Zombie Code Detection

Good times to check for zombie code include:
- After completing a major feature or milestone
- Before code reviews
- During refactoring projects
- When experiencing build size or performance issues

## Recovery Process

If you encounter issues after cleanup:

1. Find the backup directory (named like `zombie-backup-20250416-230333`)
2. Restore the needed file:
   ```bash
   cp zombie-backup-*/path/to/file.tsx path/to/file.tsx
   ```
3. Restart your application and test

## Limitations

The current detection system has some limitations:
- It may not detect dependencies used through dynamic imports
- It might not catch files referenced only in specific ways
- Type definition files might be flagged even when they're needed

Always use your judgment when reviewing potential zombie code.