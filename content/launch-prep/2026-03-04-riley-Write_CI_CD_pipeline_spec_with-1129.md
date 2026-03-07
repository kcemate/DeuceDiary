# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T11:29:08.644990

```yaml
# .github/workflows/ci-cd-pipeline.yml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch
  schedule:
    - cron: '0 0 * * *'  # Run every day at midnight (adjust as needed)

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16' # Specify Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build (Optional -  Add if you have a build step)
        run: npm run build

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test completes successfully
    if: github.ref == 'refs/heads/main'  # Only deploy from main
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Replace with your actual deployment steps)
        run: |
          # Example: Deploy to a staging environment using SSH
          ssh -o StrictHostKeyChecking=no user@staging_server "cd /path/to/staging && npm install && npm run build && pm2 restart your_app"


  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test completes successfully
    if: github.ref == 'refs/heads/main'  # Only deploy from main
    # Triggered by a manual event - you can add a button to the repo
    concurrency:
      group: deploy-production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - Replace with your actual deployment steps)
        run: |
          # Example: Deploy to a production environment using SSH -  Consider using a more robust deployment strategy
          ssh -o StrictHostKeyChecking=no user@production_server "cd /path/to/production && npm install && npm run build && pm2 restart your_app"


# Optional -  Workflow to run specific tests on a pull request
#  test-pull-request:
#    runs-on: ubuntu-latest
#    if: github.event.pull_request
#    steps:
#      - name: Run Tests on Pull Request
#        run: npm test
```

**Explanation and Key Improvements:**

1. **`on:` Section (Triggers):**
   - `push`:  Triggers the workflow on pushes to the `main` branch.
   - `pull_request`: Triggers the workflow on pull requests to the `main` branch.
   - `schedule`:  Runs the workflow automatically on a schedule (every day at midnight).  This is useful for nightly builds and checks.  Adjust the `cron` expression as needed.

2. **`jobs:` Section:**  This defines the individual tasks that the workflow will perform.
   - **`build-and-test`:**
     - `runs-on: ubuntu-latest`: Specifies the virtual machine to use for running the
