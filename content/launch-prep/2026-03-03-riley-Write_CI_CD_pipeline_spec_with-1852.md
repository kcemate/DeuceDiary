# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T18:52:07.603915

```yaml
name: CI/CD Pipeline - Example Project

on:
  push:
    branches:
      - main  # Trigger on pushes to the 'main' branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting the 'main' branch

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Specify Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test  # Or your testing command (e.g., jest, mocha)

      - name: Build (if applicable)
        run: npm run build #  Or your build command (e.g., webpack, rollup)

      - name: Upload Test Results (Optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json  # Or the path to your test report

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build  # Ensures the 'build' job completes successfully before deploying

    environment:
      name: staging
      url: ${{ secrets.STAGING_URL }}  # Use a secret for the staging URL

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - AWS S3)
        # Replace with your actual deployment steps
        if: github.ref == 'refs/heads/main'
        run: |
          #  Example:  This is just a placeholder. Adapt to your deployment process.
          echo "Deploying to Staging..."
          # You'd typically use AWS CLI, Terraform, or similar tools here
          # Example:  aws s3 sync ./dist s3://your-staging-bucket --delete
          #  Consider using a secret to store AWS credentials
          echo "Deployment complete."

  deploy-production:
    runs-on: ubuntu-latest
    needs: build

    environment:
      name: production
      url: ${{ secrets.PRODUCTION_URL }}

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - AWS S3)
        # Replace with your actual deployment steps
        if: github.ref == 'refs/heads/main'
        run: |
          # Replace with your actual production deployment command
          # Example:  aws s3 sync ./dist s3://your-production-bucket --delete
          # Use Secrets Manager for sensitive credentials
          echo "Deploying to Production..."
          # This is a placeholder - adapt to your deployment process.
          echo "Deployment complete."
```

**Explanation and Key Improvements:**

1. **`name`:**  Clearly defines the purpose of the workflow.

2. **`on`:**  Specifies when the workflow should trigger.
   - `push`:  Triggered on pushes to the `main` branch.
   - `pull_request`: Triggered on pull requests targeting the `main` branch. This allows for PR testing before merging.

3. **`jobs`:**  Defines the individual tasks that make up the CI/CD pipeline.

4. **`build` Job:**
   - `runs-on: ubuntu-latest`:  Uses the latest Ubuntu runner for
