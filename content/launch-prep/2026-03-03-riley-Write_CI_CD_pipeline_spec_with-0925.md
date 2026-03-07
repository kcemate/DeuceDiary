# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T09:25:53.551933

```yaml
# .github/workflows/main.yml

name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch
  schedule:
    - cron: '0 0 * * *' # Run every day at midnight (optional)

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build (Example - Adjust for your project)
        run: npm run build

      - name: Upload test report (optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json # Path to your test report file

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensures build-and-test has completed successfully
    if: github.ref == 'refs/heads/main' # Only deploy from the main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Replace with your deployment steps)
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to staging..."
          # Example:  npm run deploy:staging
          #  Or use SSH, rsync, or a cloud deployment service

  # Optional:  Production Deployment
  # deploy-production:
  #   runs-on: ubuntu-latest
  #   needs: build-and-test, deploy-staging # Needs both stages to complete
  #   if: github.ref == 'refs/heads/main'
  #   steps:
  #     - name: Checkout code
  #       uses: actions/checkout@v3

  #     - name: Deploy to Production (Example - Replace with your deployment steps)
  #       run: |
  #         # Replace with your actual deployment commands
  #         echo "Deploying to production..."
  #         # Example: npm run deploy:production
  #         # Or use SSH, rsync, or a cloud deployment service

```

**Explanation and Key Points:**

1. **`name: CI/CD Pipeline`**:  The name of the workflow.

2. **`on:`**:  Defines when the workflow is triggered.
   - **`push:`**:  Triggers on pushes to the `main` branch.
   - **`pull_request:`**:  Triggers on pull requests to the `main` branch.
   - **`schedule:`**: (Optional)  Allows you to schedule the workflow to run automatically at a specified time.  The cron expression `0 0 * * *` means run at midnight every day.

3. **`jobs:`**:  Defines the individual jobs that make up the workflow.
   - **`build-and-test:`**:  This is the core job that builds and tests your application.
     - **`runs-on: ubuntu-latest`**:  Specifies the virtual machine to run the job on (Ubuntu is a popular choice).
