# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T14:48:33.717193

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
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Specify the Node.js version you need

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build (Example - Adjust for your project)
        run: npm run build

      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json  # Adjust path based on your test output
          if_no_found_action: fail # Fail if no results are found

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # This job depends on the build-and-test job
    environment: staging  # Set the deployment environment
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Adjust for your project)
        #  This step will need to be replaced with your actual deployment steps.
        #  For example, deploying to AWS S3, Netlify, Vercel, etc.
        run: |
          echo "Deploying to Staging..."
          # Replace with your deployment commands.  Example:
          # npm run deploy-staging  # Assuming you have a deploy-staging script
          # or
          # aws s3 sync ./build s3://your-staging-bucket --delete
        # Consider using a deployment tool like rsync, scp, or a cloud provider's CLI
        # For example, for Netlify:
        # uses: netlify/actions/deploy@v5

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test # This job depends on the build-and-test job
    environment: production # Set the deployment environment
    if: |
      github.ref == 'refs/heads/main' && github.event_name == 'push'  # Only trigger on main branch push events
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - Adjust for your project)
        # This step will need to be replaced with your actual deployment steps.
        # For example, deploying to AWS, Google Cloud, Azure, etc.
        run: |
          echo "Deploying to Production..."
          # Replace with your deployment commands. Example:
          # npm run deploy-production
          # or
          # aws s3 sync ./build s3://your-production-bucket --delete
        # Consider using a deployment tool like rsync, scp, or a cloud provider's CLI
        # For example, for Netlify:
        # uses: netlify/actions/deploy@v5
```

**Explanation and Key Improvements:**

1. **`name`:**  Clearly defines the pipeline name.

2. **`on`:** This section specifies the triggers for the pipeline:
   - `push`:  Runs on every push to the `main` branch.
   - `pull_request`:
