# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T12:49:57.686484

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the 'main' branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting 'main'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18  # Specify your Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (Optional)
        run: npm run build  # Or your build command

      - name: Upload Artifacts (Optional)
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: ./dist  # Or the directory containing your build output

  deploy-to-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # This job depends on the 'build-and-test' job
    if: github.ref == 'refs/heads/main'  # Deploy only on pushes to the 'main' branch
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging
        # This is a placeholder - Replace with your actual deployment steps.
        #  This could involve:
        #    - SSHing into a server
        #    - Using a cloud provider's CLI (e.g., AWS CLI, Azure CLI, Google Cloud CLI)
        #    - Deploying to a staging environment using a CI/CD platform
        run: |
          echo "Deploying to staging environment..."
          # Example:  Deploying via SSH (adjust credentials appropriately)
          # ssh user@staging-server "cd /path/to/app && git pull origin main && npm install && npm run build"
          # You'll likely need to configure SSH keys for your workflow.
          echo "Staging deployment complete!"

  deploy-to-production:
    runs-on: ubuntu-latest
    needs: build-and-test  # Depends on the 'build-and-test' job
    if: github.ref == 'refs/heads/main'  # Deploy only on pushes to the 'main' branch
    environment: production # Sets the environment to 'production'
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production
        # This is a placeholder - Replace with your actual deployment steps.
        #  This could involve:
        #    - SSHing into a server
        #    - Using a cloud provider's CLI (e.g., AWS CLI, Azure CLI, Google Cloud CLI)
        #    - Deploying to a production environment using a CI/CD platform
        run: |
          echo "Deploying to production environment..."
          # Example:  Deploying via AWS CLI (configure your AWS credentials)
          # aws s3 sync ./dist s3://your-production-bucket
          # You'll need the correct IAM role for your workflow and configured AWS credentials.
          echo "Production deployment complete!"
```

Key improvements and explanations:

* **`name`:**  Provides a descriptive name for the workflow.
* **`on`:** Defines when the workflow is triggered:
