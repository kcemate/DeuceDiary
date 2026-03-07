# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T09:48:34.858149

```yaml
# .github/workflows/ci-cd-pipeline.yml

name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Lint code
        run: npm run lint  # Assuming you have a lint script in package.json

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build  # Assuming you have a build script in package.json

      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build/ # Adjust this based on your build output directory

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build # Ensure build is successful before deploying

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install AWS CLI
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: us-east-1 # Or your desired AWS region

      - name: Deploy to Staging
        run: |
          # Replace these commands with your actual deployment steps
          echo "Deploying to Staging..."
          # Example: Deploy using AWS CLI for S3, EC2, etc.
          # aws s3 sync build/ s3://your-staging-bucket --delete
          # Or use a deployment tool like Terraform, Serverless, etc.

        # IMPORTANT:  This is a placeholder.  You *MUST* replace this section
        # with the actual deployment commands for your application.
        # This script doesn't actually deploy anything, it just illustrates where
        # the deployment steps would go.


  deploy-production:
    runs-on: ubuntu-latest
    needs: build # Ensure build is successful before deploying

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install AWS CLI
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: us-east-1 # Or your desired AWS region

      - name: Deploy to Production
        run: |
          # Replace these commands with your actual deployment steps
          echo "Deploying to Production..."
          # Example: Deploy using AWS CLI for S3, EC2, etc.
          # aws s3 sync build/ s3://your-production-bucket --delete
          # Or use a deployment tool like Terraform, Serverless, etc.

        # IMPORTANT:  This is a placeholder.  You *MUST* replace this section
        # with the actual deployment commands for your application.
        # This script doesn't actually deploy anything
