# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-06T13:39:09.189490

Okay, here's a CI/CD pipeline spec for GitHub Actions, designed to provide a basic but functional workflow. This example is tailored for a Node.js project, but can be adapted with minimal changes.  I'll break it down with explanations and considerations.

**Pipeline Name:** `ci-cd`

**Triggers:**

*   **Push to all branches:** Triggers the pipeline on every push to any branch. This ensures that every change is tested.
*   **Pull Request:** Triggers the pipeline when a pull request is opened or updated.
*   **Scheduled (Optional):**  You can schedule this to run periodically (e.g., nightly) for deployment or other maintenance tasks.

**Workflow (YAML File - `.github/workflows/ci-cd.yml`)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - '*' # All branches
  pull_request:
    branches:
      - '*' # All branches

jobs:
  build:
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

      - name: Build (Optional - for production builds)
        run: npm run build  # Adjust this based on your project's build command

  deploy:
    needs: build # Ensures build has succeeded
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' # Deploy only from the main branch
    steps:
      - name: Deploy to Production (Example - Using SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            echo "Deploying..."
            # Replace this with your actual deployment commands.
            # This is just an example.
            pm2 restart your-app-name # Example: restart a Node.js app with pm2
      # Alternatively, deploy to a server using a CI/CD platform like AWS, Azure, or Google Cloud

```

**Explanation:**

1.  **`name: CI/CD Pipeline`**:  The name of the workflow.

2.  **`on:`**: Defines the triggers for the workflow.
    *   `push`:  Triggers on push events to any branch.
    *   `pull_request`: Triggers on pull request events to any branch.

3.  **`jobs:`**: Defines the individual jobs within the workflow.  Jobs run concurrently unless explicitly stated otherwise.

4.  **`build` Job:**
    *   `runs-on: ubuntu-latest`: Specifies the runner environment (Ubuntu).
    *   `steps:`:  A sequence of steps to be executed within the job.
        *   `Checkout code`: Uses the `actions/checkout@v3` action to clone your repository.
        *   `Set up Node.js`: Uses the `actions/setup-node@v3` action to install the correct Node.js version.
        *   `Install dependencies`: Runs `npm install` to install your project's dependencies.
        *   `Run tests`: Runs your project's test suite (using `npm test`). Adapt this command to
