# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T09:07:18.787368

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on push to the main branch
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
          node-version: 18  # Specify your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build #  Or whatever your build command is (e.g., yarn build, etc.)

      - name: Code analysis (optional - SonarQube example)
        uses: w9jds/sonar-scanner-action@v2
        with:
          sonarLogin: ${{ secrets.SONARQUBE_TOKEN }} # Use a secret for your SonarQube token
          sonar:
            organization: ${{ secrets.SONARQUBE_ORGANIZATION }} # Use a secret for your SonarQube organization
            token: ${{ secrets.SONARQUBE_TOKEN }}

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build #  Ensure 'build' job completes successfully before running 'deploy-staging'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example using SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_SERVER_IP }}  # Use a secret for your staging server IP
          username: ${{ secrets.STAGING_SERVER_USERNAME }} # Use a secret for your staging server username
          key: ${{ secrets.STAGING_SERVER_SSH_KEY }} # Use a secret for your staging server SSH key
          script: |
            echo "Deploying to staging..."
            # Add your deployment commands here, e.g.,
            # npm install --production
            # npm run build -- --env=staging
            # pm2 restart your-app # Or whatever you use for deployment
            #  You might use rsync or other deployment tools here

  deploy-production:
    runs-on: ubuntu-latest
    needs: build # Ensure 'build' job completes successfully before running 'deploy-production'
    environment: production  # Specify the environment (production, staging, etc.)

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example using SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PRODUCTION_SERVER_IP }}  # Use a secret for your production server IP
          username: ${{ secrets.PRODUCTION_SERVER_USERNAME }}  # Use a secret for your production server username
          key: ${{ secrets.PRODUCTION_SERVER_SSH_KEY }}  # Use a secret for your production server SSH key
          script: |
            echo "Deploying to production..."
            # Add your deployment commands here, e.g.,
            # npm install --production
            # npm run build -- --env=production
            # pm2 restart your-app  # Or whatever you use for deployment
            # Make sure this script is idempotent!  Handle potential errors.

```

**Explanation and Key Considerations:**
