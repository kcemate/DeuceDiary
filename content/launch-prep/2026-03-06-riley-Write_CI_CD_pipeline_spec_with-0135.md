# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-06T01:35:35.864964

Okay, here's a comprehensive CI/CD pipeline spec using GitHub Actions, designed to be adaptable to various projects.  I'll break it down into different sections with explanations and considerations.

**Pipeline Name:** `ci-cd-pipeline`

**Trigger:** GitHub Events - Specifically, "Pull Request" events.  This ensures the pipeline runs whenever code is pushed to a pull request.

**Workflow File:** `workflows/ci-cd.yml` (This is a common naming convention for GitHub Actions workflows)

```yaml
name: CI/CD Pipeline

on:
  pull_request:
    types: [opened, synchronize, reopened]  # Trigger on PR creation, updates, and reopens

jobs:
  build-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Or your desired Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-test  # Ensure build-test passes before deploying
    environment: staging  # Set the deployment environment (helpful for labels)

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Production Dependencies
        run: npm install --production

      - name: Build Application
        run: npm run build  # Adapt this to your build command (e.g., `npm run build:prod`)

      - name: Deploy to Staging
        # Replace with your staging deployment command/script
        run: |
          echo "Deploying to Staging..."
          # Example: Deploying to a server using SSH (replace with your actual command)
          # ssh user@staging-server "cd /path/to/app && git pull origin main && npm install && npm run build && pm2 restart app"
          # This is just an example.  Use your actual deployment method.
          echo "Deployment completed.  Remember to manually review changes in the staging environment."
```

**Explanation & Key Components:**

1. **`name:`**:  Provides a name for the workflow.  This is what you'll see in the GitHub Actions UI.

2. **`on:`**:  Defines the events that trigger this workflow.
   - `pull_request:`: This workflow is triggered on pull requests.
   - `types: [opened, synchronize, reopened]`: This specifies the types of pull request events that will trigger the workflow.
     - `opened`: When a new pull request is opened.
     - `synchronize`: When a pull request is updated (e.g., new commits are added).
     - `reopened`: When a closed pull request is reopened.

3. **`jobs:`**:  Defines the jobs that make up the workflow.  Jobs run concurrently (unless explicitly defined otherwise).

4. **`build-test` Job:**
   - `runs-on: ubuntu-latest`: Specifies the runner (virtual machine) to use.  Ubuntu is a common and well-supported choice.
   - `steps:`: A sequence of tasks to perform.
     - `Checkout Code`: Uses the `actions/checkout@v3` action to check out your repository's code.
     - `Set up Node.js`: Uses the `actions/setup-node@v3` action to install the specified Node.js version.
