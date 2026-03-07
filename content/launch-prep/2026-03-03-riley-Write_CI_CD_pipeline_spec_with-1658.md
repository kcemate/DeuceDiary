# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T16:58:57.536978

```yaml
name: CI/CD Pipeline - MyProject

on:
  push:
    branches:
      - main # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main # Trigger on pull requests targeting the main branch
  schedule:
    - cron: '0 0 * * *' # Run every day at midnight (adjust as needed)

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build # Adjust this based on your build command

      - name: Upload Test Reports (Optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json # Adjust the path to your test report file
          if_no_files_found: fail # Fail if no test results are found

  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test # Ensures build_and_test completes successfully
    environment: staging # This environment name is used by GitHub Actions
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Deployment Dependencies
        run: npm install -g --production pm2 # Example: Use pm2 for deployment, install it globally

      - name: Deploy to Staging
        run: |
          # Replace with your deployment commands
          pm2 stop all # Stop the existing process
          pm2 deploy production:master # Deploy the production code
          pm2 start all # Start the process

  deploy_production:
    runs-on: ubuntu-latest
    needs: build_and_test # Ensures build_and_test completes successfully
    environment: production # This environment name is used by GitHub Actions
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Deployment Dependencies
        run: npm install -g --production pm2 # Example: Use pm2 for deployment, install it globally

      - name: Deploy to Production
        run: |
          # Replace with your deployment commands
          pm2 stop all
          pm2 deploy production:master
          pm2 start all
```

**Explanation and Key Considerations:**

1.  **`name:`**: Defines the name of your CI/CD pipeline.

2.  **`on:`**:  Specifies when the pipeline should trigger:
    *   **`push:`**:  Triggers on pushes to the `main` branch.
    *   **`pull_request:`**: Triggers on pull requests to the `main` branch.  This is a good practice for code review.
