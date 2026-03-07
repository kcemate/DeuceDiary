# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T07:42:21.396869

```yaml
name: CI/CD Pipeline - Automated Build & Deploy

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting the main branch
  schedule:
    - cron: '0 0 * * *'  # Run daily at midnight (UTC) - Adjust as needed

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'  # Specify your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run linters and tests
        run: npm test

      - name: Build project
        run: npm run build  # Adapt this command to your build process

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build  # Or the path to your built artifacts

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: staging  # Specify your staging environment
      url: ${{ secrets.STAGING_URL }} # Replace with your staging URL
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - name: Deploy to Staging (Example - Adapt for your deployment)
        # This is a placeholder. Replace with your actual deployment commands!
        # This example uses SSH to deploy to a staging server
        run: |
          echo "Deploying to Staging..."
          # Replace with your SSH command to deploy to your staging environment
          # Example: ssh user@staging_server "cd /path/to/app && git pull origin main"
          echo "Deployment complete!"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: production
      url: ${{ secrets.PRODUCTION_URL }} # Replace with your production URL
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - name: Deploy to Production (Example - Adapt for your deployment)
        # This is a placeholder. Replace with your actual deployment commands!
        # This example uses SSH to deploy to a production server
        run: |
          echo "Deploying to Production..."
          # Replace with your SSH command to deploy to your production environment
          # Example: ssh user@production_server "cd /path/to/app && git pull origin main"
          echo "Deployment complete!"
```

**Explanation and Key Improvements:**

1. **`name:`**:  Clear pipeline name for identification.
2. **`on:`**:
   - **`push`**: Triggers on pushes to the `main` branch.  This is a typical starting point.
   - **`pull_request`**: Triggers on pull requests targeting the `main` branch, allowing for code review before deployment.
   - **`schedule`**:  This allows you to run the pipeline automatically on a schedule.  The example runs daily at midnight UTC
