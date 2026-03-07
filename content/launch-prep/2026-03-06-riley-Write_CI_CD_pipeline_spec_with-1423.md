# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-06T14:23:15.147117

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
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set Up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'  # Or your desired Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test  # Or your test command (e.g., npm run test)

      - name: Build (Example -  Might vary based on your project)
        run: npm run build

      - name: Upload Test Reports (Optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json  #  Adjust path to your test report file

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test completes successfully before deploying
    environment:
      name: staging
      url: ${{ secrets.STAGING_URL }} # Replace with your Staging URL
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Staging (Example - Adjust for your deployment method)
        run: |
          # Example - Using SSH and rsync for a simple deployment
          echo "Deploying to staging..."
          # Replace with your staging server details
          ssh user@staging-server "mkdir -p /var/www/staging/app" && \
          rsync -avz ./dist/ user@staging-server:/var/www/staging/app

      - name: Notify Slack (Optional)
        uses: slackbots/slack-github-action@v2
        with:
          slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
          color: good
          message: |
            Deployment to Staging completed successfully!

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensure build-and-test completes successfully
    environment:
      name: production
      url: ${{ secrets.PRODUCTION_URL }}  # Replace with your Production URL
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Production (Example - Adjust for your deployment method)
        run: |
          # Example - Using SSH and rsync (replace with your actual deployment process)
          echo "Deploying to production..."
          # Replace with your production server details
          ssh user@production-server "mkdir -p /var/www/app" && \
          rsync -avz ./dist/ user@production-server:/var/www/app

      - name: Notify Slack (Optional)
        uses: slackbots/slack-github-action@v2
        with:
          slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
          color: good
          message: |
            Deployment to Production completed successfully!
```

**Explanation and Key Features:**

1.  **`name`**:  A descriptive name for the workflow.

2.  **`on`**:  Defines when the workflow should be triggered:
