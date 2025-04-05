#!/bin/bash

# Update greetingPatterns with additional expressions
sed -i 's/'\''whats up'\'', "what'\''s up",/'\''whats up'\'', "what'\''s up", '\''whats good'\'', "what'\''s good",/' server/ai/ai-fallback-strategy.ts

chmod +x update_greeting_patterns.sh
