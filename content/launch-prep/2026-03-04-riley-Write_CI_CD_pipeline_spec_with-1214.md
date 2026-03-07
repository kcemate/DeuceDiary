# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T12:14:35.956003

```yaml
name: CI/CD Pipeline - MyProject

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
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18  # Or your desired Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (Optional - Customize for your project)
        run: npm run build # Or your build command

      - name: Upload Artifacts (Optional - Customize for your project)
        if: success()
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build  # Or the directory containing your build output

  deploy-to-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensures build-and-test has completed successfully
    environment: staging
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Customize this step!)
        # This is a placeholder. Replace with your actual deployment steps.
        # This example assumes you are deploying to a server using SSH
        run: |
          echo "Deploying to Staging..."
          # Replace with your actual deployment commands
          # Example using SSH:
          # ssh user@staging-server "cd /path/to/app && git pull origin main && npm install && npm run build"
          #  Ensure SSH keys are properly configured in your GitHub secrets
          echo "Deployment complete!"

  deploy-to-production:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensures build-and-test has completed successfully
    environment: production
    # This step is triggered only if the staging deployment is successful.
    # You might want to add more checks here, like manual approval.
    if: github.event_name == 'push' && github.ref == 'refs/heads/main' # Trigger only on main branch pushes
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production (Customize this step!)
        # This is a placeholder. Replace with your actual deployment steps.
        # This example assumes you are deploying to a server using SSH
        run: |
          echo "Deploying to Production..."
          # Replace with your actual deployment commands
          # Example using SSH:
          # ssh user@production-server "cd /path/to/app && git pull origin main && npm install && npm run build"
          #  Ensure SSH keys are properly configured in your GitHub secrets
          echo "Deployment complete!"
```

Key improvements and explanations:

* **YAML Format:**  This is a valid YAML file, necessary for GitHub Actions.
* **`on:` section:** This section defines when the workflow will run.  It now includes:
    * `push`:  Triggers on pushes to the `main` branch.
    * `pull_request`: Triggers on pull requests targeting the `main` branch.
* **`jobs:` section:** Defines the different jobs in the workflow.
    * `build
