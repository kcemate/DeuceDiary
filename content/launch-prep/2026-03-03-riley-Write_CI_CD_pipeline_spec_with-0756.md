# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T07:56:03.630121

Okay, here's a CI/CD pipeline specification using GitHub Actions, designed to be adaptable and illustrate key concepts. This is a starting point - you'll need to customize it based on your specific project, repositories, and tools.

**Pipeline Name:** `default` (This is the default pipeline that runs on every push/pull request)

**Description:** "Automated CI/CD pipeline for [Project Name] - Build, Test, and Deploy"

**Triggers:**

*   **Push to all branches:**  This will trigger the pipeline on every push to any branch.
*   **Pull Request:**  This is crucial for code review and testing.

**Workflow File Name:** `workflow.yml` (This file will define the stages and steps)

**Workflow Content (workflow.yml):**

```yaml
name: CI/CD - [Project Name]

on:
  push:
    branches:
      - main  # Or your main development branch
  pull_request:
    branches:
      - main
  workflow_dispatch:  # Allow manual triggering of the workflow

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Adjust as needed

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build  # Adjust command for your project (e.g., `yarn build`)

  deploy-staging:
    needs: build  # This job depends on the 'build' job completing successfully
    runs-on: ubuntu-latest
    environment: staging #  Using GitHub Environments for managing deployments
    steps:
      - name: Deploy to Staging
        # Replace this with your deployment steps!  Examples:
        # - name: Deploy to AWS S3
        #   run: |
        #     ... your AWS CLI commands ...
        # - name: Deploy to Heroku
        #   run: |
        #     ... your Heroku CLI commands ...
        # - name: Deploy to Netlify
        #   run: |
        #     ... your Netlify CLI commands ...
        # Example using SSH (simplest)
        run: ssh -o StrictHostKeyChecking=no user@staging-server "cd /app && git pull && npm install && npm run build"

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    environment: production # Using GitHub Environments for managing deployments
    steps:
      - name: Deploy to Production
        # Replace this with your deployment steps!
        run: |
          # Example using SSH - Adjust user and server
          ssh -o StrictHostKeyChecking=no user@production-server "cd /app && git pull && npm install && npm run build"
```

**Explanation and Key Components:**

1.  **`name`**:  A descriptive name for the workflow.

2.  **`on`**: This section defines the triggers that initiate the workflow.
    *   `push`: Triggers the workflow on pushes to specified branches.
    *   `pull_request`: Triggers the workflow on pull requests.
    *   `workflow_dispatch`:  Allows you to manually trigger the workflow from the GitHub Actions interface.  Useful for debugging or ad-hoc deployments.

3.  **`jobs`**: Defines the individual tasks (jobs) that make up the workflow
