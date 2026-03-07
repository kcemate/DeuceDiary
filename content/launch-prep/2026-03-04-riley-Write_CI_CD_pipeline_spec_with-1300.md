# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T13:00:00.781790

```yaml
name: CI/CD Pipeline - My Project

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting the main branch

jobs:
  build-and-test:
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

      - name: Build project
        run: npm run build  # Assuming you have a build script

      - name: Archive Artifacts
        if: success()
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build/  # Or the path to your built files
          if_no_files_found: fail

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test passes first
    environment: staging  #  Associate with a GitHub Environments setting
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch (for example)
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging Server
        # Replace with your actual deployment script/commands
        run: |
          echo "Deploying to staging..."
          # Example: ssh to your server and run a deployment command
          # ssh -o StrictHostKeyChecking=no user@staging-server "npm install && npm run deploy"
          # This is a placeholder - customize this step
          echo "Deployment completed!"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment: production  # Associate with a GitHub Environments setting
    if: github.ref == 'refs/heads/main' # Only deploy from main branch (for example)
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production Server
        # Replace with your actual deployment script/commands
        run: |
          echo "Deploying to production..."
          # Example: deploy using a CI/CD tool like AWS CodeDeploy, Jenkins, etc.
          # This is a placeholder - customize this step
          echo "Deployment completed!"

```

**Explanation and Key Features:**

1. **`name:`**  A descriptive name for your workflow.
2. **`on:`** This section defines when the workflow will be triggered:
   - `push:`  Triggers when code is pushed to the specified branches.
   - `pull_request:` Triggers when a pull request is created or updated targeting the specified branches.
3. **`jobs:`**  Defines the individual jobs that make up the workflow.
   - **`build-and-test:`**
     - `runs-on: ubuntu-latest`  Specifies the runner environment (Ubuntu).
     - `steps:` A sequence of tasks to execute.
       - `Checkout code:`  Checks out the code from your repository.
       - `Set up Node.js:` Installs a specific version of Node.js.
       - `Install dependencies:`  Installs the project's dependencies
