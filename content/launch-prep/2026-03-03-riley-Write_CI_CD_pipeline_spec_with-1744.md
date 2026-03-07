# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T17:44:14.039527

Okay, let's craft a comprehensive CI/CD pipeline specification using GitHub Actions. This will cover the key stages you'd typically want to include, with explanations and considerations.

**Pipeline Name:** `my-project-ci-cd` (Replace with your project's name)

**Repository:** `github.com/<your-username>/<your-repository>`

**Triggers:**

*   **Push to all branches:**  Triggers the pipeline whenever code is pushed to any branch.
*   **Pull request:** Triggers the pipeline when a pull request is created or updated.  This is critical for automated testing and review.

**Workflow Definition (YAML):**

```yaml
name: CI/CD - My Project

on:
  push:
    branches:
      - main # Or your main branch name
  pull_request:
    branches:
      - main # Or your main branch name

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your desired Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (if applicable - Example for JavaScript)
        run: npm run build  # Adjust based on your build command

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensures build-and-test has completed successfully
    if: github.ref == 'refs/heads/main'  # Deploy from main only

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to Staging..."
          # Example:  npm run deploy:staging
          #  or SSH into the server and execute commands
          #  Example: ssh user@staging-server 'cd /app && git pull && npm install && npm run build && pm2 restart myapp'

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production
        run: |
          # Replace with your actual deployment commands. This is more complex!
          echo "Deploying to Production..."
          # Example: npm run deploy:production
          # Consider using a deployment service like AWS, Azure, or Google Cloud
          # Or use a tool like Ansible or Terraform for infrastructure as code
          # Example:  Run commands to deploy to a server
```

**Explanation and Key Considerations:**

1.  **`name`:**  A descriptive name for the workflow.
2.  **`on`:**  Defines when the workflow is triggered.
    *   `push`:  Triggers on code pushes.
    *   `pull_request`: Triggers on pull request events.
3.  **`jobs`:**  Contains one or more independent jobs that run concurrently.
    *   **`build-and-test`:**
        *   `runs-on`: Specifies the virtual machine to run the job on (Ubuntu is common for many projects).
        *   `steps`: A sequence of actions to perform.
