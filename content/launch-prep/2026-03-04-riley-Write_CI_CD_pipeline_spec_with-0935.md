# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T09:35:44.571350

Okay, let's craft a CI/CD pipeline specification for GitHub Actions, incorporating best practices and offering a solid starting point.  This will be a YAML-based specification, which is the standard format for GitHub Actions workflows.

**Pipeline Name:** `main` (or whatever your primary branch is named)

**Purpose:** Automate build, test, and deploy a Node.js application to a staging environment.

**Workflow File Name:** `workflow.yml` (Save this in the `.github/workflows` directory of your repository)

```yaml
name: Node.js CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x' # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build (Optional - if your project needs it)
        run: npm run build # Or whatever your build command is

      - name: Upload test results (Optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json  # Adjust path to your test results file
          if_no_results_error: fail # Fail if no results are uploaded

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensures build-and-test completes successfully
    environment: staging # Define the deployment environment
    if: github.ref == 'refs/heads/main' # Only deploy from the main branch (adjust as needed)

    steps:
      - name: SSH into staging server
        uses: shivammathur/action-ssh@v1
        with:
          host: ${{ secrets.STAGING_SERVER_HOST }}
          ssh_private_key: ${{ secrets.STAGING_SERVER_KEY }}
          username: ${{ secrets.STAGING_SERVER_USERNAME }}

      - name: Deploy to Staging
        run: |
          # Add your deployment commands here.
          # Example:
          # npm install --production # Only install production dependencies
          # npm run deploy  # Your deployment script
          echo "Deploying to staging..."
          #  Replace with your actual deployment steps!
          #  This is just a placeholder.
          sleep 10 # Simulate deployment time
          echo "Deployment complete!"
```

**Explanation and Key Components:**

1.  **`name`:**  A descriptive name for your workflow.

2.  **`on`:** This section defines when the workflow will be triggered.
    *   `push`:  Triggers the workflow on any push to the `main` branch.
    *   `pull_request`: Triggers the workflow on any pull request to the `main` branch.

3.  **`jobs`:** This contains the individual jobs that make up the workflow.  A job runs on a virtual machine.
    *   **`build-and-test`:** This job is responsible for building and testing your application.
        *   `runs-on: ubuntu-latest`: Specifies that the job will run on an Ubuntu-based virtual machine.
        *   `steps`: Defines the sequence of actions within the job.
            *
