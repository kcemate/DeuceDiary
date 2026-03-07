# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T21:07:55.037103

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, covering various aspects from basic builds to more advanced deployments. I'll provide a YAML file (`.github/workflows/ci-cd.yml`) and then explain each section.

**`*.github/workflows/ci-cd.yml`**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the 'main' branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the 'main' branch
  schedule:
    - cron: '0 0 * * *' # Run daily at midnight (UTC) - for scheduled builds/tests


jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js 18
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build Project
        run: npm run build  # Adapt this command to your project's build script

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build  # This job depends on the 'build' job
    if: github.ref == 'refs/heads/main' # Only deploy from main
    steps:
      - name: Deploy to Staging
        uses: akhilesh/aws-exec@v1.3 # Or your preferred deployment method
        with:
          region: us-east-1   # Replace with your AWS region
          exec: |
            # Your deployment commands here (e.g., SSH, rsync, etc.)
            echo "Deploying to staging..."
            # Example: ssh user@staging-server 'rsync -avz ./dist/ user@staging-server:/var/www/my-app'
            # Replace with your actual deployment commands
            exit 0

  deploy-production:
    runs-on: ubuntu-latest
    needs: build  # This job depends on the 'build' job
    if: github.ref == 'refs/heads/main' # Only deploy from main
    environment: production  #  Specify the production environment
    steps:
      - name: Deploy to Production
        uses: akhilesh/aws-exec@v1.3
        with:
          region: us-east-1   # Replace with your AWS region
          exec: |
            # Your deployment commands here (e.g., SSH, rsync, etc.)
            echo "Deploying to production..."
            # Example: ssh user@production-server 'rsync -avz ./dist/ user@production-server:/var/www/my-app'
            # Replace with your actual deployment commands
            exit 0
```

**Explanation:**

1.  **`name: CI/CD Pipeline`**:  Defines the name of the workflow.

2.  **`on:`**:  Specifies when the workflow should be triggered.
    *   `push`: Triggers the workflow on any push to the `main` branch.
    *   `pull_request`: Triggers the workflow on pull requests to the `main` branch.
    *   `schedule`:  A cron schedule to run the workflow daily at midnight (UTC).  This can be useful for regular builds, tests, or scheduled deployments if needed.

3.  **`
