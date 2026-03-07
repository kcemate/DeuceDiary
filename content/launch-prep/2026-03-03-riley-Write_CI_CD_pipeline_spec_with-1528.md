# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T15:28:35.424763

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Specify your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build project (if applicable)
        run: npm run build  # Adjust this command based on your project's build process

      - name: Upload test results (optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json  # Assuming your test results are in a JSON file

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensure build-and-test has completed successfully
    environment: staging # Specify deployment environment

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - adjust for your environment)
        # This is a placeholder.  Replace this with your actual deployment steps.
        #  You'll likely use a tool like AWS CLI, SSH, or a deployment service.
        run: |
          echo "Deploying to Staging..."
          # Example using SSH (replace with your credentials and target server)
          # ssh -o StrictHostKeyChecking=no user@staging-server "cd /path/to/app && ./deploy.sh"
          # Or, if using a service like Netlify, you would use their CLI.

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensure build-and-test has completed successfully
    environment: production # Specify deployment environment
    if: github.ref == 'refs/heads/main' # Deploy only on main branch push

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - adjust for your environment)
        # This is a placeholder. Replace this with your actual deployment steps.
        # You'll likely use a tool like AWS CLI, SSH, or a deployment service.
        run: |
          echo "Deploying to Production..."
          # Example using SSH (replace with your credentials and target server)
          # ssh -o StrictHostKeyChecking=no user@production-server "cd /path/to/app && ./deploy.sh"
          # Or, if using a service like Netlify, you would use their CLI.
```

Key improvements and explanations:

* **`on:` section:**  Defines when the workflow runs.  Crucially, this now triggers on both `push` and `pull_request` events on the `main` branch.  This is the standard behavior for most projects.  You can customize this to trigger on other branches as needed.
* **`jobs:` section:**  Defines the individual jobs that make up the pipeline.
* **`build-and-test:` job:**
    * `runs-on: ubuntu-latest`:  Specifies the runner (virtual machine) to use
