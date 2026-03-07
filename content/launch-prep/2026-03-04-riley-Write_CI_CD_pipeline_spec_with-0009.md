# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T00:09:01.064331

Okay, let's craft a CI/CD pipeline specification using GitHub Actions. This will be a detailed outline, focusing on a common scenario – a Node.js application.  I'll provide explanations and best practices along the way.

**Pipeline Name:** `ci-cd-nodejs`

**Repository:** (Assumed: This pipeline is linked to a GitHub repository containing a Node.js project)

**Triggers:**

*   **Pull Request Creation:** Automatically triggered on pull request creation.  This allows for automated testing and linting as developers make changes.
*   **Pull Request Updates:** Triggered when the head branch of a pull request is updated.  This will rerun tests and build steps after updates.
*   **Push to Main/Master Branch:**  Triggered when code is pushed to the main branch, initiating a deployment after successful CI checks. (Consider using a "scheduled" workflow for deployments, as described below)

**Workflow (YAML):**

```yaml
name: CI/CD - Node.js

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Lint code
        run: npm run lint # Assuming you have a 'lint' script in your package.json

      - name: Run tests
        run: npm run test # Assuming you have a 'test' script in your package.json

      - name: Build (optional)
        run: npm run build # If you have a build process (e.g., for a frontend app)

      - name: Archive artifacts (optional)
        if: success()
        uses: actions/upload-artifact@v3
        with:
          name: nodejs-app-artifacts
          path: dist # Or the directory containing your build artifacts
          if_no_files_found: error # Fail the job if no files are found

  deploy:
    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - Assuming a serverless environment like Netlify or Vercel)
        #  This is a placeholder - customize for your deployment strategy
        if: github.ref == 'refs/heads/main' # Only deploy from main
        run: |
          echo "Deploying to production..."
          # Replace with your actual deployment commands
          # Example (Netlify):
          # npm install -g netlify-cli
          # netlify deploy --prod
          # Example (Vercel):
          # npm install -g vercel
          # vercel deploy

  # Optional: Scheduled Deployment (For automated deployments after successful CI)
  scheduled_deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    schedule:
      - cron: '0 6 * * *' # Run every day at 6:00 AM UTC
    steps:
      - name: Deploy to Production (Scheduled)
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Required for some deployment commands
