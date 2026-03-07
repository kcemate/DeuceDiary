# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T09:03:28.403139

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, broken down with explanations and best practices. This is a starting point, and you'll need to customize it to fit your specific project and needs.

**Pipeline Name:** `ci-cd-pipeline`

**Repository:**  `[Your Repository Name]`

**Triggers:**

*   **Push to all branches:**  This is the most common trigger.  The pipeline will run automatically whenever code is pushed to any branch.
*   **Pull Request Created/Updated:** Optionally trigger the pipeline when a pull request is created or updated. This can help catch issues early.

**Workflow File:** `workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - '*'  # Trigger on all branches
  pull_request:
    types: [opened, synchronize, reopened] # Trigger on PR creation, updates, and reopening

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Or your desired Node.js version

      - name: Install dependencies
        run: npm install  # Or yarn install or pnpm install

      - name: Run tests
        run: npm test  # Or yarn test or pnpm test

      - name: Build (Example - for JavaScript)
        run: npm run build  # Or yarn build or pnpm build
        if: success() # Only build if tests are successful

      - name: Upload test reports (Optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: test-reports/*  # Adjust the path based on your test output

  deploy-to-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test succeeds first
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - using SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USERNAME }}
          key: ${{ secrets.STAGING_KEY }}
          script: |
            echo "Deploying to staging..."
            # Add your deployment commands here (e.g., rsync, npm install, npm run build)
            npm install
            npm run build
            # ... other deployment steps ...

  deploy-to-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - using SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USERNAME }}
          key: ${{ secrets.PRODUCTION_KEY }}
          script: |
            echo "Deploying to production..."
            # Add your deployment commands here (e.g., rsync, npm install, npm run
