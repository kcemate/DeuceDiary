# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T23:01:25.383682

Okay, let's craft a CI/CD pipeline specification using GitHub Actions. This will cover a basic, but functional, pipeline for a Node.js project, illustrating key steps.  You can adapt it to your specific needs (language, testing framework, deployment target, etc.).

**Pipeline Specification: Node.js Project with GitHub Actions**

**Project:**  (Assumed: a Node.js project hosted in a GitHub repository)

**Goal:**  Automate build, test, and deployment to a staging environment.

**Workflow Name:** `deploy-staging`

**Trigger:**  On push to the `main` branch (or a specific branch used for staging)

**YAML Configuration (`.github/workflows/deploy-staging.yml`):**

```yaml
name: Deploy Staging

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  workflow_dispatch:  # Allow manual triggering of the workflow

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18' # Or your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build (if applicable - e.g., for React)
        run: npm run build  # Or whatever your build command is

  deploy-to-staging:
    needs: build-and-test  # This job depends on the build-and-test job
    runs-on: ubuntu-latest
    steps:
      - name: SSH into staging server
        uses: shivammathur/action-ssh@v1 # or another SSH action
        with:
          username: ${{ secrets.STAGING_USERNAME }}
          password: ${{ secrets.STAGING_PASSWORD }}
          host: ${{ secrets.STAGING_HOST }}
          path: '/var/www/my-app'  # Path on your staging server

      - name: Deploy code to staging
        run: |
          # Replace this with your actual deployment commands
          scp -r ./dist/* ${{ secrets.STAGING_USERNAME }}@${{ secrets.STAGING_HOST }}:${{ secrets.STAGING_PATH }}
          #Or if you're using rsync:
          #rsync -avz ./dist/ ${{ secrets.STAGING_USERNAME}@${{ secrets.STAGING_HOST}}:${{ secrets.STAGING_PATH }}
```

**Explanation and Key Components:**

1. **`name`:**  A descriptive name for the workflow.

2. **`on`:**  Specifies the events that trigger the workflow.
   - `push`: Triggers the workflow when code is pushed to the specified branches.
   - `workflow_dispatch`:  Allows you to manually trigger the workflow from the GitHub Actions UI.  This is useful for testing deployments or running specific scenarios.

3. **`jobs`:** Defines the individual jobs to be executed.
   - **`build-and-test`:**
     - `runs-on: ubuntu-latest`:  Specifies the virtual machine (runner) to run the job on.
     - `steps`:  A sequence of tasks within the job.
       - `actions/checkout@v4`: Checks out your code from the repository.
       - `actions/setup-node@v4`:  Sets up the Node.js environment.  Important to specify the
