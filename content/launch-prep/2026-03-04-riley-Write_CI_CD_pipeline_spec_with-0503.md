# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T05:03:36.627892

Okay, here's a comprehensive CI/CD pipeline spec using GitHub Actions, tailored for a common scenario. I'll break it down into sections with explanations and best practices.  This example focuses on a Node.js project, but the principles can be adapted for other languages and environments.

**Pipeline Name:** `ci-cd-nodejs`

**Repository:** `[Your GitHub Repository Name]`

**Triggers:**

*   **Push to all branches:**  This is the primary trigger, automatically running the pipeline when code is pushed to any branch.
*   **Pull Request Creation:**  Runs the pipeline when a new pull request is created. (Crucial for testing changes before merging).
*   **Pull Request Updates:**  Runs the pipeline when a pull request is updated (e.g., after a new commit).

**Workflow File:** `.github/workflows/ci-cd-nodejs.yml`

```yaml
name: CI/CD - Node.js Project

on:
  push:
    branches:
      - '*'  # Trigger on all branches
  pull_request:
    branches:
      - '*' # Trigger on all branches for PRs
    types: [opened, synchronize, reopened] # Run on PR creation, updates, etc.

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'  # Specify your Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build (if needed - e.g., for a front-end)
        run: npm run build  # Adjust command based on your build process
        if: success()

      - name: Upload test reports (Optional)
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results.json #or relevant path to your test report

  deploy:
    runs-on: ubuntu-latest
    environment: production  # You'll configure this in GitHub for actual deployments
    needs: build # Only run deploy if the build job succeeds

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Production (Example - using SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_KEY }} # Store securely in GitHub Secrets!
          script: |
            echo "Deploying to production..."
            # Add your deployment commands here
            # Example:  npm install && npm run deploy  (if you have a deploy script)
            # Or, manually run commands:
            #  pm2 restart your-app
            #  ./your-deploy-script.sh
  #Add a check step to ensure the build stage succeeded before deploying
  post_build:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'push' || github.event.pull_request.merged == true #Only run when build is completed

    steps:
      - name: Run Post Build Script
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key
