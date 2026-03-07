# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T14:07:49.596933

Okay, here's a detailed CI/CD pipeline spec using GitHub Actions, designed for a typical Node.js project but adaptable to others. I'll break it down into sections with explanations and options for customization.

**Pipeline Name:** `nodejs-ci-cd` (You can change this)

**Workflow Name:** `deploy` (This is the default name when creating a workflow)

**Triggers:**

*   **Push to all branches:** This workflow will run automatically whenever code is pushed to any branch of your repository.
*   **Pull Request:** This workflow also runs on every pull request.

**YAML Workflow File (`.github/workflows/deploy.yml`):**

```yaml
name: Node.js CI/CD

on:
  push:
    branches:
      - main  # or your primary branch
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

      - name: Run tests
        run: npm test

      - name: Build project (if applicable)
        run: npm run build  # Or your build command

      - name: Upload test reports
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json # Adjust to your test report file
          if_no_found_action: fail

  deploy:
    runs-on: ubuntu-latest
    needs: build # Ensures build step completes before deploying
    if: github.ref == 'refs/heads/main'  # Only deploy from the main branch

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install AWS CLI (for deployment - optional)
        run: npm install -g aws-cli

      - name: Configure AWS Credentials (for deployment - optional)
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: your-aws-region  # e.g., us-east-1

      - name: Deploy to S3 (for deployment - optional)
        run: |
          # Your deployment commands here, e.g.,
          # aws s3 sync . s3://your-s3-bucket/
          echo "Deployment to S3 would happen here"
          # Replace this with your actual deployment logic.  This is just a placeholder.
          #  You'll likely need to set up your S3 bucket, IAM role, and permissions.

```

**Explanation:**

1.  **`name`:**  A descriptive name for your workflow.

2.  **`on`:**  Specifies when the workflow should trigger:
    *   `push`:  When code is pushed to a branch (in this case, `main`).
    *   `pull_request`:  When a pull request is created or updated.

3.  **`jobs`:**  Defines the jobs that will run within the workflow.
    *   **`build` Job:**
        *   `runs-on: ubuntu
