# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T18:06:50.984052

Okay, let's craft a CI/CD pipeline specification for GitHub Actions. This will cover a foundational pipeline that can be adapted to your specific project's needs.  I'll provide a detailed YAML file with explanations and considerations.

**Pipeline Specification: GitHub Actions CI/CD**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on push to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch

jobs:
  build-and-test:
    runs-on: ubuntu-latest  # Choose your preferred runner

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js 20
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build (Example - Adapt for your project)
        run: npm run build

  deploy-staging:
    needs: build-and-test
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to Staging (Example - Adapt)
        if: github.ref == 'refs/heads/main' # Only deploy from main
        run: |
          # Replace with your staging deployment commands
          echo "Deploying to staging..."
          # Example:  npm run deploy-staging
          #  Or use a service like AWS, Azure, or Google Cloud deployment scripts
          # This is a placeholder - customize extensively
          sleep 10  # Simulate deployment time
          echo "Deployment complete!"
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to Production (Example - Adapt)
        if: github.ref == 'refs/heads/main' # Only deploy from main
        run: |
          # Replace with your production deployment commands
          echo "Deploying to production..."
          # Example:  npm run deploy-production
          #  Or use a service like AWS, Azure, or Google Cloud deployment scripts
          # This is a placeholder - customize extensively
          sleep 10  # Simulate deployment time
          echo "Deployment complete!"
```

**Explanation:**

1.  **`name: CI/CD Pipeline`**:  This sets the name of your workflow.

2.  **`on:`**: This defines when the workflow will trigger.
    *   **`push:`**:  Triggers the workflow when code is pushed to the `main` branch.
    *   **`pull_request:`**: Triggers the workflow when a pull request is created or updated against the `main` branch.  This is crucial for code review and testing.

3.  **`jobs:`**:  Defines the individual jobs that make up the pipeline.

    *   **`build-and-test:`**:
        *   **`runs-on: ubuntu-latest`**: Specifies the runner environment (a virtual machine).  `ubuntu-latest` is a good general-purpose choice.
        *   **`steps:`**:  A sequence of tasks within the job.
            *   **`actions/checkout@v3`**: Checks out your repository code into the runner.
            *   **`actions/setup-node@v3`**:  Sets up Node.js.  It's important to specify the Node.js version.
            *   **`npm install`
