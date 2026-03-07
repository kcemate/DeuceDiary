# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T08:05:03.720479

```yaml
name: CI/CD Pipeline - Example Project

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch
  schedule:  # Optional: Schedule for daily or specific times
    - cron: '0 0 * * *' # Example: Run every day at 00:00 UTC

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Specify your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (Example - React)
        if: success()  # Only build if tests pass
        run: npm run build

      - name: Upload Test Reports
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json # Or the path to your test report

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensure build-and-test completes successfully first

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Netlify)
        if: success()
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to staging..."
          # Example:  npm run deploy:staging
          # Or use a service like Netlify CLI:
          # netlify deploy --prod --dir dist --message "Deployment from CI/CD"
          # Make sure you've configured your Netlify credentials in GitHub Secrets

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test, deploy-staging # Ensure both previous jobs complete successfully

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - AWS S3)
        if: success()
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to production..."
          # Example:  npm run deploy:production
          # Or use AWS CLI
          # aws s3 sync ./dist s3://your-s3-bucket --delete
          # Make sure you have AWS credentials configured in GitHub Secrets
          # and the AWS CLI installed on the runner.
```

**Explanation and Key Concepts:**

1. **`name`:**  A descriptive name for your CI/CD pipeline.

2. **`on`:** Defines when the pipeline is triggered:
   - **`push`:** Triggers the pipeline on pushes to specified branches.
   - **`pull_request`:** Triggers the pipeline when a pull request is created or updated.
   - **`schedule`:** (Optional) Allows you to schedule runs at specific intervals, using cron syntax.  This is very useful for automated tests and deployments.

3. **`jobs`:** Defines the individual tasks to be performed.
   - **`build-and-test`:** This job performs the core build and testing.
     - **`runs-on`:** Specifies the runner environment (e.g., `ubuntu-latest`).
     - **`steps`
