# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T20:45:18.483415

```yaml
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
          node-version: '18' # Or your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Lint code
        run: npm run lint  # Assumes you have a lint script in your package.json

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build  # Assumes you have a build script in your package.json

      - name: Upload test artifacts
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json  # Adjust if your test output is different

  deploy:
    runs-on: ubuntu-latest
    needs: build # Ensures the build job completes successfully before deploying

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install AWS CLI
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: us-east-1 # Or your desired AWS region

      - name: Deploy to S3
        run: |
          # Replace with your S3 bucket and deployment commands
          aws s3 sync ./dist s3://your-bucket-name --delete

      - name: Deploy to Server (Example - SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SERVER_PRIVATE_KEY }}  # Use private key for secure access
          script: |
            # Your deployment script here.  This is just an example.
            echo "Running deployment script..."
            # Example:  git pull origin main
            #  Restart services if necessary.
            #  ...
  # Optional: Add a stage for manual approvals
  #  approval:
  #    type: pull_request_target
  #    required_contexts:
  #      - deploy

```

**Explanation and Key Components:**

1.  **`name: CI/CD Pipeline`**:  Defines the name of the workflow.
2.  **`on:`**: Specifies when the workflow is triggered.
    *   `push:` Triggers the workflow on pushes to the `main` branch.
    *   `pull_request:` Triggers the workflow on pull requests targeting the `main` branch.
3.  **`jobs:`**: Defines the different jobs that will be executed.
    *   **`build:`**: This job focuses on the build process:
        *   `runs-on: ubuntu-latest`: Uses the latest Ubuntu virtual machine.
        *   `steps:`  A sequence of tasks to perform within the job.
            *   `actions/checkout@v3`: Checks out the code from your repository.
            *   `actions/setup-node@v3`:  Sets up Node.js
