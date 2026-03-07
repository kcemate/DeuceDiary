# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T13:45:12.590579

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
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Specify your Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test  # Assuming you have a 'test' script in your package.json

      - name: Build (Example - adjust for your project)
        run: npm run build

      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build  # Adjust path based on your build output
          if_no_files_found: fail # Fail the job if no artifacts are found

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build  # This job depends on the 'build' job completing successfully
    environment: staging  # Define the environment for deployment
    if: github.ref == 'refs/heads/main' # Only deploy from main branch.  Adjust as needed.

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Adjust for your deployment method)
        run: |
          # Example: Deploy to a server using SSH
          # Replace with your actual deployment commands
          echo "Deploying to Staging..."
          # ssh user@staging-server "your_deployment_commands"

      - name: Slack Notification (Optional)
        uses: rtCamp/action-slack-notify@v2.2.0
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }} # Configure your Slack Webhook Secret in GitHub Secrets
          SLACK_COLOR: success
          SLACK_MESSAGE: "Staging deployment successful!"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    environment: production  # Define the environment for deployment
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch. Adjust as needed.
    secrets:
      # Replace with your actual production deployment secrets
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - Adjust for your deployment method)
        run: |
          # Example: Deploy to AWS S3
          echo "Deploying to Production..."
          # Replace with your actual deployment commands using AWS CLI or similar

      - name: Slack Notification (Optional)
        uses: rtCamp/action-slack-notify@v2.2.0
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_COLOR: success
          SLACK_MESSAGE: "Production deployment successful!"
```

**Explanation and Key Improvements:**

1. **`on:` Trigger:**
   - `push`:  Triggers the pipeline when code
