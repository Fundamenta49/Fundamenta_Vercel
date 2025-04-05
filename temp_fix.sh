#!/bin/bash
# Make a backup of the original file
cp client/src/components/fundi-interactive-assistant.tsx client/src/components/fundi-interactive-assistant.tsx.bak

# Remove the first toggleChat function
sed -i '304,307d' client/src/components/fundi-interactive-assistant.tsx

# Check if we successfully fixed the file
echo "File fixed. Here's the relevant section:"
grep -A 10 "resizeObserver.disconnect" client/src/components/fundi-interactive-assistant.tsx
