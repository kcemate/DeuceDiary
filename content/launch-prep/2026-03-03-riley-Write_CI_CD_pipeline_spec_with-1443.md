# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T14:43:14.332103

```yaml
name: CI/CD Pipeline - Example Project

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch
  schedule:
    - cron: "0 0 * * *" # Run every day at midnight (e.g., for nightly checks)

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16' # Specify Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build Project
        run: npm run build  # Assuming a build script exists (e.g., 'npm run build')

      - name: Upload Artifacts (Optional - if you need to deploy)
        if: success()
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build/  # Adjust path to your build output folder
          if_no_files_found: error  # Fail the job if no files are found in the path

  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test  # This job depends on the build_and_test job
    environment: staging # This job deploys to the staging environment. Configure this in your deployment settings.
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to staging..."
          # Example:
          # ssh user@staging-server "cd /var/www/project && git pull && npm install && npm run build"

  deploy_production:
    runs-on: ubuntu-latest
    needs: build_and_test
    environment: production  # This job deploys to the production environment. Configure this in your deployment settings.
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to production..."
          # Example:
          # ssh user@production-server "cd /var/www/project && git pull && npm install && npm run build"
```

**Explanation and Key Features:**

1.  **`name`:**  A descriptive name for the workflow.

2.  **`on`:**  Specifies when the workflow should run.
    *   `push`: Triggers on pushes to the `main` branch.
    *   `pull_request`: Triggers on pull requests to the `main` branch.
    *   `schedule`:  Runs the workflow on a scheduled basis.  The example uses `cron` to run daily at midnight.  Customize this to your needs.

3.  **`jobs`:** Defines the individual jobs within the workflow.

4.  **`build_and_test` Job:**
    *   `runs-on: ubuntu-latest`:  Specifies the runner environment (Ubuntu).
    *   `steps`:  A sequence of tasks to execute.
        *   `actions/checkout@v3`:  Checks out the code from your repository
