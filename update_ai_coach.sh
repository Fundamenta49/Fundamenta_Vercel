#!/bin/bash

# Replace the first instance
sed -i '833s/onClick={() => setShowAICoach(true)}/onClick={() => alert("Please use Fundi for AI assistance")}/' client/src/components/active-you-enhanced.tsx

# Replace the second instance
sed -i '1430s/onClick={() => setShowAICoach(true)}/onClick={() => alert("Please use Fundi for AI assistance")}/' client/src/components/active-you-enhanced.tsx

# Replace the third instance
sed -i '2037s/onClick={() => setShowAICoach(true)}/onClick={() => alert("Please use Fundi for AI assistance")}/' client/src/components/active-you-enhanced.tsx

# Update the button text to reflect the change
sed -i '837s/Ask AI Coach/Use Fundi Instead/' client/src/components/active-you-enhanced.tsx
sed -i '1434s/Ask AI Coach/Use Fundi Instead/' client/src/components/active-you-enhanced.tsx
sed -i '2041s/Ask AI Coach/Use Fundi Instead/' client/src/components/active-you-enhanced.tsx