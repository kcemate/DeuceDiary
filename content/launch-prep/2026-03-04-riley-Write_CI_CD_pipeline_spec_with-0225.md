# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T02:25:06.421187

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, designed to be adaptable and scalable.  I'll break it down into sections, explaining the rationale behind each step.

**Pipeline Name:** `ci-cd-pipeline`

**Trigger:**  Every push to any branch (including forks) –  This allows for continuous integration.

**YAML File (`.github/workflows/ci-cd-pipeline.yml`)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ "main", "develop" ] # Specify branches to trigger the pipeline
  pull_request:
    branches: [ "main", "develop" ]
  workflow_dispatch: # Allows manual triggering

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build Application
        run: npm run build # Adjust based on your build command

      - name: Archive Artifacts
        if: success() # Only archive if the previous steps were successful
        run: |
          mkdir -p build/artifacts
          cp build/* build/artifacts/
          echo "Build artifacts archived"
          # Upload artifacts to GitHub Releases
          # You can remove this step if you don't use GitHub Releases
          # and handle uploads manually.  Consider using a deployment service
          # instead of GitHub Releases for a larger project.
          # This part requires a GitHub token with write access to Releases
          # (See security note below)
          #
          #  export RELEASE_ID=$(curl -s "https://api.github.com/repos/${{ github.repository }}/releases/latest" | jq -r '.id')
          #  curl -s -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
          #    -T build/artifacts/package.json \
          #    "https://api.github.com/repos/${{ github.repository }}/releases/$RELEASE_ID"
  deploy:
    runs-on: ubuntu-latest
    needs: build # Ensures 'build' job completes successfully before running 'deploy'
    if: github.ref == 'refs/heads/main' #  Only deploy from the main branch

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - assumes a simple server setup)
        run: |
          # Replace this with your actual deployment commands!
          echo "Deploying to production..."
          # Example:
          # ssh user@server "cd /var/www/my-app && git pull origin main && npm install && npm run build && pm2 restart my-app"
          #  Consider using a deployment service for greater control and reliability.
```

**Explanation and Key Components:**

1.  **`name`**: A descriptive name for your workflow.

2.  **`on`**: This section defines the triggers that initiate the pipeline.
    *   **`push`**: Runs the pipeline whenever code is pushed to the `main` or `develop` branches.
    *   **`pull_request`**: Runs the pipeline when a pull request is created or updated against `main` or `develop`.  This is critical for automated testing of pull
