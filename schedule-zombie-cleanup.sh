#!/bin/bash

# Schedule the zombie code detection script to run every 48 hours
# This script will set up a cron job to execute the cleanup.sh script

# Get the current directory (where the scripts are located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

# Make scripts executable if they aren't already
chmod +x "$SCRIPT_DIR/cleanup.sh"

# Create a new cron job file
CRON_FILE="$SCRIPT_DIR/zombie_cleanup_cron"

# Create the cron command to run every 48 hours
# Format: minute hour day-of-month month day-of-week command
echo "0 0 */2 * * $SCRIPT_DIR/cleanup.sh > $SCRIPT_DIR/reports/last_run_$(date +\%Y\%m\%d).log 2>&1" > "$CRON_FILE"

# Install the cron job
if command -v crontab &> /dev/null; then
    crontab "$CRON_FILE"
    echo "✅ Zombie code detection scheduled to run every 48 hours!"
    echo "✅ Reports will be saved to the reports directory."
    echo "✅ Cron job installed:"
    crontab -l | grep cleanup.sh
else
    echo "⚠️ Crontab command not found. Manual scheduling required."
    echo "To manually schedule this task, add the following to your crontab:"
    echo "0 0 */2 * * $SCRIPT_DIR/cleanup.sh > $SCRIPT_DIR/reports/last_run_\$(date +\%Y\%m\%d).log 2>&1"
    echo "This will run the script at midnight every 2 days."
fi

# Create a README to explain how to modify or disable the schedule
cat > "$SCRIPT_DIR/ZOMBIE_CLEANUP_README.md" << EOL
# Automated Zombie Code Detection

A scheduled task has been set up to detect zombie code every 48 hours.

## Schedule Details

- Frequency: Every 48 hours (midnight)
- Script executed: cleanup.sh
- Reports saved to: reports/ directory

## Managing the Schedule

### View Current Schedule

\`\`\`
crontab -l
\`\`\`

### Remove Schedule

\`\`\`
crontab -l | grep -v cleanup.sh | crontab -
\`\`\`

### Modify Schedule

Edit the cron job with:

\`\`\`
crontab -e
\`\`\`

## How It Works

The scheduled task runs the detection script only, not the cleanup script.
After each run, review the reports in the reports/ directory to identify
zombie code, then use cleanup-zombie-code.sh to remove unnecessary files.

**Important:** Always review reports before deleting any files, and test
thoroughly after cleanup.
EOL

echo "✅ Created ZOMBIE_CLEANUP_README.md with instructions for managing the schedule."