# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T22:16:06.115795

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
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18  # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Lint code
        run: npm run lint  # Assumes you have a lint script in package.json

      - name: Test
        run: npm test

      - name: Build (if applicable)
        run: npm run build  # Assumes you have a build script

      - name: Upload code artifacts (if applicable)
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build/  # Or your build output directory


  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensures build-and-test has completed successfully
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - using SSH)
        uses: appleypress/deploy@v4
        with:
          app-name: your-app-name  # Replace with your app name
          app-key: your-app-key    # Replace with your app key
          app-user: your-ssh-user  # Replace with your SSH user
          app-host: your-staging-host # Replace with your staging host
          deploy-path: /var/www/your-app-name  # Replace with your deploy path
          delete-existing: true
          prerelease: true  # Enable prerelease if needed
          # Add any other ApplePressly deployment options here.



  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensures build-and-test has completed successfully
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - using SSH)
        uses: appleypress/deploy@v4
        with:
          app-name: your-app-name  # Replace with your app name
          app-key: your-app-key    # Replace with your app key
          app-user: your-ssh-user  # Replace with your SSH user
          app-host: your-production-host # Replace with your production host
          deploy-path: /var/www/your-app-name  # Replace with your deploy path
          delete-existing: true
          prerelease: true  # Enable prerelease if needed
          # Add any other ApplePressly deployment options here.

  # Optional: Notification
  notification:
    runs-on: ubuntu-latest
    needs: build-and-test
    steps:
      - name: Send Slack Notification (Example)
        uses: rtCamp/action-slack-notify@v2
        with:
          slack-webhook: ${{ secrets.SLACK_WEBHOOK_URL }}  # Securely store your Slack webhook URL
          color: success
          title
