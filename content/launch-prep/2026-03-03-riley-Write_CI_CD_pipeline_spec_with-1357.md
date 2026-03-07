# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T13:57:49.363314

```yaml
name: CI/CD Pipeline - MyProject

on:
  push:
    branches:
      - main # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main # Trigger on pull requests to the main branch

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16 # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build Project
        run: npm run build # Replace with your build command (e.g., npm run build)

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensure build-and-test passes first
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging
        run: |
          # Replace with your staging deployment script
          echo "Deploying to staging..."
          # Example using SSH:
          # ssh user@staging-server "cd /path/to/app && git pull origin main && npm install && npm run build"

          # Or using a service like AWS, Azure, or Google Cloud - this is a placeholder
          # Example (placeholder for AWS S3):
          # aws s3 sync ./build s3://my-staging-bucket
        # Consider using environment variables for sensitive information
        # e.g., aws_access_key_id, aws_secret_access_key

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensure build-and-test passes first
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    environment: production #  This triggers the deployment environment setup, important for some providers
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production
        run: |
          # Replace with your production deployment script
          echo "Deploying to production..."
          # Example using SSH:
          # ssh user@production-server "cd /path/to/app && git pull origin main && npm install && npm run build"

          # Or using a service like AWS, Azure, or Google Cloud - this is a placeholder
          # Example (placeholder for AWS S3):
          # aws s3 sync ./build s3://my-production-bucket
        # Consider using environment variables for sensitive information
        # e.g., aws_access_key_id, aws_secret_access_key
```

**Explanation and Key Improvements:**

1. **`name`:** Clearly defines the purpose of the pipeline.
2. **`on`:**
   - `push`: Triggers the pipeline on pushes to the `main` branch.
   - `pull_request`: Triggers the pipeline on pull requests to the `main` branch. This is essential for code review and testing before merging.
3. **`jobs`:**  Defines the individual tasks that make up the pipeline.
   - **`build-and-test`:**
     - `runs-on: ubuntu-latest`: Uses the latest Ubuntu runner for all steps.
