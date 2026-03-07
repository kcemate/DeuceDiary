# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T04:18:21.090439

```yaml
name: CI/CD Pipeline

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
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20  # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build  # Adjust this command based on your build process

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensures build-and-test has completed successfully
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Staging (Example using SSH)
        uses: appleboy/ssh-action@v1.1 # Requires: `npm install -g appleboy/ssh-action`
        with:
          host: ${{ secrets.STAGING_HOST }}  # Hostname of your staging server
          username: ${{ secrets.STAGING_USER }} # Username for SSH access
          key: ${{ secrets.STAGING_SSH_KEY }}  # Private key for SSH access
          script: |
            echo "Deploying to Staging..."
            # Your deployment commands here - e.g., rsync, scp, etc.
            # Example: rsync -avz --delete ./dist/ ${{ secrets.STAGING_REMOTE_PATH }}
            #  Replace with your specific deployment commands
            echo "Deployment complete!"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensures build-and-test has completed successfully
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Production (Example using SSH)
        uses: appleboy/ssh-action@v1.1
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            echo "Deploying to Production..."
            # Your deployment commands here - e.g., rsync, scp, etc.
            # Example: rsync -avz --delete ./dist/ ${{ secrets.PRODUCTION_REMOTE_PATH }}
            #  Replace with your specific deployment commands
            echo "Deployment complete!"


# Secrets - Store these securely in GitHub Secrets settings
# Go to your repository -> Settings -> Secrets -> Actions secrets
#   - STAGING_HOST: The hostname of your staging server
#   - STAGING_USER: Username for SSH access to staging
#   - STAGING_SSH_KEY: Private key for SSH access to staging
#   - PRODUCTION_HOST: The hostname of your production server
#   - PRODUCTION_USER: Username for SSH access to production
#   - PRODUCTION_SSH_KEY: Private key for SSH access to production
```

**Explanation and Key Considerations:**

1. **`name`:**  Provides a descriptive name for the workflow.

2. **`on`:**  Defines when the workflow is triggered:
