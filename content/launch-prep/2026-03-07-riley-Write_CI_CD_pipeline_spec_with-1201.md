# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T12:01:08.342868

```yaml
name: CI/CD Pipeline - Node.js Application

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

      - name: Set Node.js version
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build  # Assuming you have a build script (e.g., "build")

  deploy-to-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test passes before deploying
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging Server - Using SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_HOST }}  # Your staging server's IP or hostname
          username: ${{ secrets.STAGING_USERNAME }} # Your staging server's username
          key: ${{ secrets.STAGING_SSH_KEY }} # Your staging server's SSH private key (securely stored as a secret)
          script: |
            # Replace with your deployment commands
            echo "Deploying to Staging..."
            npm install
            npm run build
            scp -r ./dist/* ${{ secrets.STAGING_USERNAME}@${{ secrets.STAGING_HOST }}:/var/www/your-app  # Example command - adjust as needed

  deploy-to-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production Server - Using SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PRODUCTION_HOST }}  # Your production server's IP or hostname
          username: ${{ secrets.PRODUCTION_USERNAME }} # Your production server's username
          key: ${{ secrets.PRODUCTION_SSH_KEY }} # Your production server's SSH private key (securely stored as a secret)
          script: |
            # Replace with your deployment commands
            echo "Deploying to Production..."
            npm install
            npm run build
            scp -r ./dist/* ${{ secrets.PRODUCTION_USERNAME}@${{ secrets.PRODUCTION_HOST }}:/var/www/your-app  # Example command - adjust as needed

# Secrets - VERY IMPORTANT
# Add these secrets to your GitHub repository settings -> Secrets -> Actions Secrets
# Make sure you don't commit your private keys to your repository!
# secrets:
#   STAGING_HOST: your_staging_server_ip_or_hostname
#   STAGING_USERNAME: your_staging_server_username
#   STAGING_SSH_KEY: ssh-rsa AAAAB3NzaC1yc2E... # Your staging server's SSH private key
#   PRODUCTION_HOST: your_production_server_ip_or_hostname
#   PRODUCTION_USERNAME: your_production_
