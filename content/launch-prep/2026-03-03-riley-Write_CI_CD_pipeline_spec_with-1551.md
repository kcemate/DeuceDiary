# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T15:51:17.194993

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18  # Specify the Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (Example - Adjust to your build process)
        run: npm run build  # Assumes you have a build script defined in package.json

      - name: Upload Artifacts (Optional - For Deployment)
        if: success() # Only upload if the previous steps succeeded
        runs-on: ubuntu-latest
        with:
          name: Artifacts
          artifacts:
            - dist/* # Assuming your build output is in a folder called 'dist'
            - coverage/  # Optional:  Upload test coverage reports

  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test  # Ensures build_and_test has completed successfully
    environment: staging #  This will be used to automatically set the environment in the GitHub UI
    if: github.ref == 'refs/heads/main'  # Deploy only when pushing to the main branch

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Customize for your deployment)
        run: |
          #  Replace with your actual deployment commands
          echo "Deploying to Staging..."
          # Example:  Deploy to a server using SSH, cloud provider CLI, etc.
          # ssh user@staging-server "cd /app && git pull && npm install && npm run build"
          # Or using a cloud provider CLI:
          # aws s3 sync dist s3://your-staging-bucket

        #  Consider using a deployment tool like Netlify, Vercel, or similar here.
        #  This example uses a placeholder for simplicity.

  deploy_production:
    runs-on: ubuntu-latest
    needs: build_and_test
    environment: production # Automatically set the environment in the GitHub UI
    if: github.ref == 'refs/heads/main' # Deploy only when pushing to the main branch

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - Customize for your deployment)
        run: |
          # Replace with your actual deployment commands.
          echo "Deploying to Production..."
          # Example: Deploy to a server using SSH, cloud provider CLI, etc.
          # ssh user@production-server "cd /app && git pull && npm install && npm run build"
          # Or using a cloud provider CLI:
          # aws s3 sync dist s3://your-production-bucket

        # Consider using a deployment tool like Netlify, Vercel, or similar here.
        # This example uses a placeholder for simplicity.

```

**Explanation and Key Improvements:**

1.  **`on:` Section (Triggers):**
    *   `push`: Triggers the pipeline on pushes to the `main` branch.
    *
