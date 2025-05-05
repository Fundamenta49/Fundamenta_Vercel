
#!/bin/bash

echo "Running deployment verification suite..."

# Run health check tests
echo "Testing health check endpoints..."
node test-deployment.js

if [ $? -eq 0 ]; then
  echo "✅ Health check verification passed"
else
  echo "❌ Health check verification failed"
  exit 1
fi

# Verify essential files
echo "Verifying deployment files..."
required_files=("cloudrun-health-web.cjs" "_health" "public/_health")

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ Found $file"
  else
    echo "❌ Missing $file"
    exit 1
  fi
done

echo "All deployment tests completed successfully!"
