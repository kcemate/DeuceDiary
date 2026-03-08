# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T16:21:18.801915

Okay, here's a detailed CI/CD pipeline specification using GitHub Actions, designed to be relatively comprehensive and adaptable. This includes explanations, best practices, and considerations for different scenarios.  I'll break it down into sections for clarity.

**Pipeline Name:** `ci-cd-pipeline`

**Repository:**  (Replace with your repository name) `my-repository`

**Workflow Name:** `main.yml` (or any suitable name)

**Triggers:**

*   **Push to all branches:**  This is the most common trigger, ensuring that every code change is built and tested.
*   **Pull Request:**  This trigger will run the pipeline whenever a new pull request is created or updated. This is crucial for automated testing and feedback.
*   **(Optional) Scheduled Runs:** If you need to run the pipeline periodically (e.g., nightly builds or deployments), you can set up a scheduled run using GitHub's cron syntax.  Example: `0 0 * * *` (runs at midnight UTC)

**Workflow Logic (YAML):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Or your primary branch
  pull_request:
    branches:
      - main

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build  # Or your build command

  deploy-staging:
    needs: build-test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install SSH Key
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ secrets.STAGING_SSH_PRIVATE_KEY }}

      - name: Deploy to Staging
        run: |
          # Replace with your deployment commands
          echo "Deploying to Staging..."
          # Example:  ssh user@staging-server "cd /app && git pull origin main && npm install && npm run build"
```

**Explanation and Key Components:**

1.  **`name`:**  A descriptive name for your workflow.

2.  **`on`:** This section defines the triggers that will initiate the workflow.

    *   `push`:  Triggers the workflow on every push to the specified branches.
    *   `pull_request`: Triggers the workflow on any pull request that's created or updated.

3.  **`jobs`:**  This is where you define the individual tasks that make up your pipeline.

    *   **`build-test`:**  This job is responsible for building and testing your code.
        *   `runs-on: ubuntu-latest`:  Specifies the runner environment (a virtual machine).
        *   `steps`:  A sequence of tasks to be executed within the job.
            *   `actions/checkout@v4`: Checks out your repository's code.  Always use a specific version of actions to avoid unexpected behavior.
            *   `actions/setup-node@v4`: Sets up a specific version of Node.js.
            *   `npm install`: Installs your project'
