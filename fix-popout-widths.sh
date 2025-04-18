#!/bin/bash

# Find all popup components in the codebase
FILES=$(find client/src/components -name "*pop-out.tsx")

# Loop through each file and replace max-width constraints
for file in $FILES; do
  echo "Processing: $file"
  
  # Replace patterns like 'w-full max-w-4xl mx-auto' and similar with just 'w-full'
  sed -i 's/className="w-full max-w-\([0-9xl]*\) mx-auto"/className="w-full"/g' "$file"
  
  # Also catch variations with different spacing or attributes order
  sed -i 's/className="w-full mx-auto max-w-\([0-9xl]*\)"/className="w-full"/g' "$file"
  
  # In case there are other attributes before or after
  sed -i 's/className="\([^"]*\)w-full max-w-\([0-9xl]*\) mx-auto\([^"]*\)"/className="\1w-full\3"/g' "$file"
  sed -i 's/className="\([^"]*\)w-full mx-auto max-w-\([0-9xl]*\)\([^"]*\)"/className="\1w-full\3"/g' "$file"
done

echo "Popup width constraints removed from all components!"