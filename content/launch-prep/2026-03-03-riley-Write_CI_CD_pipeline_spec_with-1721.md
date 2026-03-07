# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T17:21:33.345490

Okay, let's craft a comprehensive CI/CD pipeline specification using GitHub Actions. This will cover the key stages, configurations, and best practices.

**Pipeline Name:** `ci-cd-pipeline` (You can customize this)

**Repository:**  (Specify your GitHub repository name here – e.g., `my-org/my-project`)

**Triggers:**

*   **Push to all branches:**  This will trigger the pipeline whenever code is pushed to any branch.
*   **Pull Request Creation:** Triggers a pipeline when a new Pull Request is opened.  (Highly recommended)
*   **Pull Request Updates:** Triggers a pipeline when a Pull Request is updated. (Good for automated testing)

**Workflow File:**  `workflows/ci-cd-pipeline.yml` (Location within the repository – adjust as needed)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - '*'  # Trigger on all branches
  pull_request:
    branches:
      - '*'
    types: [opened, synchronize, reopened, deleted] # Trigger on PR events

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Specify your Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test  # Assuming you have a test script in your package.json

      - name: Build (Example - Adjust based on your project)
        if: always()
        run: npm run build

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-test  # Ensure build-test completes successfully before this job runs
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Adjust to your deployment method)
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to staging environment..."
          # Example:  rsync, SSH, Cloud Deployment CLI, etc.
          # Example:  ssh user@staging-server "mkdir -p /app && rsync -av ./dist/ user@staging-server:/app"

  # Optional:  Further stages (e.g., production deployment) can be added here,
  # requiring successful completion of previous stages.
```

**Explanation and Key Considerations:**

1.  **`name`**:  The name of your GitHub Actions workflow.

2.  **`on`**:  Defines the triggers for the workflow.
    *   `push`:  Triggers on pushes to all branches.
    *   `pull_request`:  Triggers on Pull Request events (important for testing and code review).
    *   `types`:  Specifies the types of pull request events that trigger the workflow (e.g., `opened`, `synchronize`).

3.  **`jobs`**:  The core of the workflow, containing one or more independent jobs.

4.  **`build-test` Job**:
    *   `runs-on`:  Specifies the virtual environment to run the job in (Ubuntu in this case – choose the one best suited for your project).
    *   `steps`:  A sequence of tasks to execute within the job:
        *   `Checkout Code`:  Clones your repository.
        *   `Set up Node.js
