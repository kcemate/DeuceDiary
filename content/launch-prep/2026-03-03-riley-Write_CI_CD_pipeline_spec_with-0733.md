# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T07:33:42.509808

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch
  schedule:
    - cron: '0 0 * * *' # Run every day at midnight (adjust as needed)

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18 # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test  # Assumes you have a 'test' script in your package.json

      - name: Build (Example - adjust for your project)
        run: npm run build

  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test # Ensures build_and_test has completed successfully
    environment: staging #  Define a deployment environment
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - adjust for your project)
        run: |
          # Replace with your staging deployment command.  This is just an example.
          echo "Deploying to staging..."
          # Example: Deploying to AWS S3, Google Cloud Storage, or a server via SSH
          #  You'll need to configure credentials properly (see below)
          #  Example:  scp -r ./dist user@staging-server:/var/www/staging

  deploy_production:
    runs-on: ubuntu-latest
    needs: build_and_test  # Ensure build_and_test has completed successfully
    environment: production # Define a deployment environment
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - adjust for your project)
        run: |
          # Replace with your production deployment command.  This is just an example.
          echo "Deploying to production..."
          # Example: Deploying to AWS S3, Google Cloud Storage, or a server via SSH
          #  You'll need to configure credentials properly (see below)
          #  Example:  scp -r ./dist user@production-server:/var/www/html

# Example of how to add a secret (for deploying to production)
#  secrets:
#    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
#    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}


```

**Explanation and Key Components:**

1. **`name: CI/CD Pipeline`**:  Name of the workflow.

2. **`on:`**:  Specifies when the workflow should run:
   - **`push:`**: Triggers the workflow on pushes to the `main` branch.
   - **`pull_request:`**: Triggers the workflow on pull requests targeting the `main` branch.
   - **`schedule:`**:  Adds a cron schedule to run the workflow automatically (every day at midnight in this example).  This is useful for CI, not necessarily deployment.  Adjust the cron expression as needed
