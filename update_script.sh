#!/bin/bash

# Add the new expressions to all whatsUpPatterns arrays
sed -i 's/'\''how is everything'\''/'\''how is everything'\'', '\''whats good'\'', "what'\''s good"/' server/ai/ai-fallback-strategy.ts

chmod +x update_script.sh
