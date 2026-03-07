# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T18:29:25.070462

```yaml
# .github/workflows/ci-cd-pipeline.yml

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
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Specify desired Node.js version

      - name: Install Dependencies
        run: npm install  # Or yarn install

      - name: Run Tests
        run: npm test  # Or yarn test

      - name: Build (Example - Assuming a build script)
        run: npm run build # Or yarn build

      - name: Upload Test Report (Optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json  # Adjust path based on your test runner output
          if_no_found_action: ignore

  deploy:
    runs-on: ubuntu-latest
    needs: build  # This job depends on the 'build' job completing successfully
    environment: production  # Use this to deploy to a production environment
    permissions:
      id-token: write  # Required for deploying to some services (e.g., AWS, Azure)
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - AWS S3)
        # This is a placeholder.  Replace with your actual deployment steps.
        run: |
          # Example - Replace with your S3 deployment command
          # aws s3 sync ./dist s3://your-bucket-name --delete
          echo "Deploying to production..."
          # Add your deployment commands here (e.g., to a server, using a CI/CD tool)

  # Optional:  Notifications
  # This section shows how to send a notification on successful completion.
  notification:
    runs-on: ubuntu-latest
    needs: [build, deploy]
    steps:
      - name: Send Slack Notification (Example)
        uses: rtCamp/action-slack-notify@v2.2.0
        with:
          title: "CI/CD Pipeline - Success"
          message: "The build and deploy steps have completed successfully!"
          slack-token: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Explanation and Key Improvements:**

1. **`on:` Trigger:**
   - `push`:  Triggers the pipeline on every push to the `main` branch.
   - `pull_request`: Triggers the pipeline when a pull request is created or updated against the `main` branch.  This is crucial for testing changes before merging.

2. **`jobs:`:** Defines the different stages of your pipeline.
   - `build`: The primary build and test stage.
     - **`runs-on: ubuntu-latest`:** Specifies the runner (virtual machine) to use.
     - **`steps:`:** The sequence of actions to execute within the job.
       - `Checkout Code`:  Checks out the code from the repository.
       - `Set up Node.js`: Sets up the correct Node.js version.  Using a specific version is *highly* recommended.
       - `Install Dependencies`: Installs your project
