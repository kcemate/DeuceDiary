# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T02:02:30.119935

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch

jobs:
  build_and_test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18  # Or your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build  # Or your build command (e.g., npm run build:prod)

      - name: Upload Artifacts (Optional - for deployment)
        if: success()
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build/  # Adjust this path to your built output

  deploy_to_staging:
    runs-on: ubuntu-latest
    needs: build_and_test  # This job depends on the build and test job completing successfully

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging Environment
        if: github.ref == 'refs/heads/main' # Only deploy from main
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to Staging..."
          # Example using SSH and rsync (adjust for your infrastructure)
          # ssh user@staging-server "rm -rf /path/to/staging/directory"
          # rsync -avz build/ user@staging-server:/path/to/staging/directory
          echo "Deployment completed."

  deploy_to_production:
    runs-on: ubuntu-latest
    needs: build_and_test
    environment: production
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production Environment
        if: github.ref == 'refs/heads/main' # Only deploy from main
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to Production..."
          # Example using SSH and rsync (adjust for your infrastructure)
          # ssh user@production-server "rm -rf /path/to/production/directory"
          # rsync -avz build/ user@production-server:/path/to/production/directory
          echo "Deployment completed."
```

**Explanation and Key Improvements:**

1. **`on:`  - Triggering the Workflow:**
   - `push`: Triggers the workflow when code is pushed to the `main` branch.
   - `pull_request`: Triggers the workflow when a pull request is opened or updated against the `main` branch. This enables PR builds and tests.

2. **`jobs:` -  Defining the Workflow's Tasks:**
   - `build_and_test`: This job performs the core build and testing steps.  It's the foundation of your CI.
     - `runs-on: ubuntu-latest`: Specifies the runner (virtual machine) to use.
     - `steps:`:  A sequence of individual tasks within the job.
       - `Checkout code`:  Retrieves the code from your
