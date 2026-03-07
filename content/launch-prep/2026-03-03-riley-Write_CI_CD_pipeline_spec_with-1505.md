# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T15:05:58.158762

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main # Trigger on pull requests targeting the main branch
  schedule:
    - cron: '0 * * * *' # Run every hour - adjust for your needs

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x' # Specify Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build  # Or your build command

      - name: Upload test reports
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json # Adjust path based on your test output

  deploy_staging:
    needs: build_and_test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install AWS CLI (if needed for deployment)
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: us-east-1 # Adjust to your deployment region

      - name: Deploy to Staging
        run: |
          # Replace this with your actual deployment commands
          echo "Deploying to staging..."
          # Example using rsync:
          # rsync -avz ./dist/ s3://your-staging-bucket/
          echo "Deployment complete!"

  deploy_production:
    needs: build_and_test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install AWS CLI (if needed for deployment)
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: us-east-1 # Adjust to your deployment region

      - name: Deploy to Production
        run: |
          # Replace this with your actual deployment commands
          echo "Deploying to production..."
          # Example using rsync:
          # rsync -avz ./dist/ s3://your-production-bucket/
          echo "Deployment complete!"
```

**Explanation and Key Improvements:**

* **`name`**:  A descriptive name for your CI/CD pipeline.
* **`on`**: This section defines when the workflow will be triggered:
    * **`push`**: Triggered on pushes to the `main` branch.
    * **`pull_request`**: Triggered on pull requests targeting the `main` branch.
    * **`schedule`**: (Optional) This allows you to schedule the pipeline to run at a specific interval.  The example runs every hour (`0 * * *
