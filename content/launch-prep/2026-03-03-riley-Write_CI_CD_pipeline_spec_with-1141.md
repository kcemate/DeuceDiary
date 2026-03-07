# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T11:41:50.686337

Okay, here's a detailed CI/CD pipeline specification using GitHub Actions, designed to be adaptable to various projects.  I'll break it down into sections with explanations and best practices.  This is a reasonably comprehensive example; you'll likely need to tailor it to your specific project's needs.

**Pipeline Name:** `default` (or a more descriptive name like `ci-cd`)

**Trigger:**  Every push to a branch (including pull requests).  This ensures that changes are automatically tested and built upon.

**Workflow Name:** `build-test-deploy` (or similar)

**YAML Configuration (`.github/workflows/main.yml`):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the 'main' branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting 'main'
  workflow_dispatch: # Allows manual triggering of the workflow

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install  # Or yarn install

      - name: Run Tests
        run: npm test  # Or yarn test

      - name: Build (Example - Adapt for your project)
        if: ${{ github.event_name == 'push' || github.event_name == 'workflow_dispatch' }}
        run: npm run build  # Or yarn build

      - name: Upload Artifacts (if needed)
        if: ${{ github.event_name == 'push' || github.event_name == 'workflow_dispatch' }}
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: ./dist  # Adjust the path to your build output directory


  deploy-to-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensures build-and-test has completed successfully

    if: github.ref == 'refs/heads/main' #Only deploy from main branch
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Staging (Example - Adapt for your deployment method)
        run: |
          # Replace this with your deployment commands
          echo "Deploying to staging environment..."
          # Example using SSH and rsync
          # ssh user@staging-server "rsync -avz ./dist/ user@staging-server:/path/to/deployment/"
          # Example using a Cloud Provider's CLI
          # aws s3 sync ./dist s3://your-bucket-name
          echo "Deployment completed!"

  deploy-to-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment:
      name: production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Production (Example - Adapt for your deployment method)
        run: |
          # Replace this with your deployment commands
          echo "Deploying to production environment..."
          # Example using SSH and rsync
          # ssh user@production-server "rsync -avz ./dist
