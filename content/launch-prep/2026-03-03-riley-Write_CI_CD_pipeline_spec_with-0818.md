# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T08:18:34.807450

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on push to the main branch
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
          node-version: 18  # Specify your Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test  # Replace with your test command (e.g., jest, mocha)

      - name: Build (if applicable)
        run: npm run build  # Replace with your build command (e.g., webpack, babel)

      - name: Upload test reports (optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json # Or your test report file name
          if_no_files_found: fail #  Fail the job if the test results file isn't found

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensures build-and-test has completed successfully
    environment: staging  # Specify the deployment environment
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging
        # Replace with your deployment steps. This is just an example.
        run: |
          echo "Deploying to staging..."
          # Example: Deploying using SSH or a CI/CD tool like Vercel/Netlify/etc.
          #  This example simulates deploying with a command.  Replace this with your actual deployment logic.
          #  Example using SSH:
          # ssh user@staging-server "cd /path/to/app && git pull origin main && npm install && npm run build && pm2 restart app"
          echo "Deployment complete!"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment: production  # Specify the deployment environment
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production
        # Replace with your deployment steps. This is just an example.
        run: |
          echo "Deploying to production..."
          # Example: Deploying using SSH, a CI/CD tool, or infrastructure as code (IaC)
          #  Replace this with your actual deployment logic.
          # Example using SSH:
          # ssh user@production-server "cd /path/to/app && git pull origin main && npm install && npm run build && pm2 restart app"
          echo "Deployment complete!"
```

**Explanation and Key Components:**

* **`name: CI/CD Pipeline`**:  The name of the workflow.
* **`on:`**:  Defines when the workflow will be triggered.
    * **`push`**:  Triggers the workflow on pushes to the `main` branch.
    * **`pull_request`**: Triggers the workflow when a pull request is opened or updated targeting the `main` branch.
* **`jobs:`**: Contains the individual jobs that make up the workflow.
    * **`build-and-test`**: This job is responsible for building
