# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-05T05:27:45.087447

```yaml
# .github/workflows/ci-cd-pipeline.yml

name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Specify your Node.js version here

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (Example - Adjust based on your project)
        run: npm run build  # Or your build command

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test completes successfully
    environment: staging
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Adjust based on your project)
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to staging environment..."
          # Example: Run deployment scripts
          # npm run deploy:staging
          # Or connect to your server via SSH
          # ssh user@server "cd /path/to/app && ./deploy.sh"
          echo "Deployment complete!"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test completes successfully
    environment: production
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - Adjust based on your project)
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to production environment..."
          # Example: Run deployment scripts
          # npm run deploy:production
          # Or connect to your server via SSH
          # ssh user@server "cd /path/to/app && ./deploy.sh"
          echo "Deployment complete!"
```

**Explanation and Key Considerations:**

1. **`name:`**  Defines the name of the workflow, which appears in the GitHub Actions UI.

2. **`on:`**  Specifies the events that trigger the workflow.
   * `push`: Triggers the workflow on pushes to the `main` branch.
   * `pull_request`: Triggers the workflow on pull requests to the `main` branch.  This is essential for testing changes before merging.

3. **`jobs:`** Defines the individual jobs that make up the workflow.
   * **`build-and-test`**:
      * `runs-on: ubuntu-latest`:  Uses the Ubuntu Linux runner environment.
      * `steps:`  A sequence of tasks to perform within the job:
         * `Checkout Code`:  Checks out the code from your repository.
         * `Set up Node.js`: Installs the specified Node.js version.  **Crucially, adjust the `node-version` to match your project's requirements.**
         * `Install Dependencies`: Installs project dependencies
