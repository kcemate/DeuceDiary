# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T03:10:16.348225

Okay, let's craft a comprehensive CI/CD pipeline spec using GitHub Actions.  This will cover a basic example, focusing on key stages and considerations.  I'll provide a YAML file with detailed explanations and suggestions for customization.

**Pipeline Spec: CI/CD for a Sample Node.js Application**

This pipeline assumes you have a repository on GitHub with a Node.js application (e.g., using `package.json` and `index.js` or similar).  It aims to:

1.  **Build:**  Install dependencies and run tests.
2.  **Static Analysis:** Perform code linting.
3.  **Build Artifact:** Create a deployable artifact (e.g., a zip file).
4.  **Deploy (to a Staging Environment):**  Upload the artifact to a staging environment.

**YAML File: `.github/workflows/ci-cd.yml`**

```yaml
name: CI/CD Pipeline - Node.js App

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
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Specify your Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Lint Code
        run: npm run lint  # Assuming you have a 'lint' script in package.json

      - name: Build Artifact
        run: |
          # Create a zip file
          zip -r app.zip . -x "*.git*"  # Exclude .git directory
          # You might need to adjust this based on your build process

      - name: Upload Artifact to Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: app-artifact
          path: app.zip

  deploy-to-staging:
    needs: build-and-test  # This job depends on the build-and-test job
    runs-on: ubuntu-latest

    steps:
      - name: Download Artifact
        uses: actions/download-artifact@v3
        with:
          name: app-artifact
          path: ./artifact

      - name: Deploy to Staging
        # Replace with your actual deployment steps.  This is just an example.
        run: |
          echo "Deploying to staging..."
          # Example: SCP (requires SSH access and key setup)
          # scp ./artifact/* user@staging-server:/path/to/deploy/
          # Or use a cloud deployment service here (e.g., AWS, Azure, Google Cloud)
          # This is a placeholder -  you MUST adapt it to your deployment needs.
          echo "Deployment complete!"
```

**Explanation and Key Considerations:**

1.  **`name`:**  A descriptive name for the workflow.

2.  **`on`:**  Specifies when the workflow should be triggered:
    *   `push`: Triggers on every push to the `main` branch.
    *   `pull_request`: Triggers on pull requests to the `main` branch.  This enables pre-merge testing and linting.

3.  **`jobs`:**  Contains one or more
