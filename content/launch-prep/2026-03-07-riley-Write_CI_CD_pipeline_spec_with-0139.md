# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T01:39:39.660283

```yaml
name: CI/CD Pipeline - AutoDeploy

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
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'  # Specify your Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build  # Adjust command based on your build script

  deploy-to-staging:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main' # Only run on main branch pushes
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Staging
        run: |
          # Add your deployment commands here.
          # This is a placeholder - replace with your actual deployment steps
          echo "Deploying to staging..."
          # Example using SSH:
          # ssh your_staging_server "cd /path/to/your/app && git pull origin main"
          # You might use a tool like rsync, or a cloud deployment service
          echo "Deployment complete."

  deploy-to-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main' # Only run on main branch pushes
    environment: production  #  This tells GitHub Actions which environment to deploy to
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Production
        run: |
          # Add your deployment commands here.
          # This is a placeholder - replace with your actual deployment steps
          echo "Deploying to production..."
          # Example using SSH:
          # ssh your_production_server "cd /path/to/your/app && git pull origin main"
          # You might use a tool like rsync, or a cloud deployment service
          echo "Deployment complete."
```

**Explanation and Key Considerations:**

1. **`name`:**  A descriptive name for your CI/CD pipeline.

2. **`on`:**
   - `push`: Defines triggers for when a new commit is pushed to the `main` branch.  This is the primary trigger for your CI pipeline.
   - `pull_request`: Defines triggers for when a pull request is created or updated to the `main` branch.  This is where your testing and validation happens before merging.

3. **`jobs`:**  The core of your pipeline – the tasks that will be executed.

4. **`build-and-test` Job:**
   - `runs-on: ubuntu-latest`: Specifies the runner (virtual machine) where the job will execute.  Ubuntu is a common choice for Node.js projects.
   - `steps`:  A sequence of actions to perform within the job.
     - `Checkout code`:  Fetches the code from your repository.
     - `Set up Node.js`: Installs the specified Node.js version.  **Important:** Update the `node-version` to match your project's
