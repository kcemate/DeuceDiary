# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T01:39:46.739345

Okay, let's craft a comprehensive CI/CD pipeline specification using GitHub Actions.  This will cover a basic example, but you can easily customize it for your specific project and needs.

**Pipeline Name:** `ci-cd`

**Trigger:** Every push to the `main` branch (can be adjusted for different branches)

**Description:** This pipeline performs automated builds, tests, and deployments whenever changes are pushed to the `main` branch.

**Workflow:**

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
  build_test_deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install  # Or yarn install

      - name: Run Tests
        run: npm test  # Or yarn test  (Make sure you have a test script in your package.json)

      - name: Build Project
        run: npm run build # Or yarn build (Adjust to your build command)

      - name: Deploy to Production (Example -  Requires Configuration!)
        if: github.ref == 'refs/heads/main'  # Only deploy from main
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to production..."
          # Example: Deploy to AWS S3, Heroku, Netlify, etc.
          # You'll likely need to configure environment variables and secrets here.
          # For example, to deploy to AWS S3:
          # aws s3 sync ./dist s3://your-bucket-name --delete
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**Explanation & Key Components:**

1. **`name: ci-cd`**:  A descriptive name for the workflow.

2. **`on:`**:  Defines when the workflow is triggered.
   - `push:`: Triggers on every push to the `main` branch.
   - `pull_request:`: Triggers on pull requests targeting the `main` branch.

3. **`jobs:`**: Defines the actual tasks to be executed.
   - `build_test_deploy:`:  A single job to orchestrate the build, testing, and deployment.  You can have multiple jobs and define dependencies between them.

4. **`runs-on: ubuntu-latest`**:  Specifies the runner environment (in this case, a Ubuntu instance).  GitHub Actions provides various runners (Windows, macOS, etc.).

5. **`steps:`**:  A sequence of tasks within the job.  Each step can execute a command or use an action.
   - **`actions/checkout@v3`**:  Checks out your repository code into the runner.
   - **`actions/setup-node@v3`**: Sets up the Node.js environment, ensuring that your project's dependencies can be installed.
   - **`npm install` / `yarn install`**: Installs your project's dependencies using npm or yarn.
   - **`npm test` / `yarn test`**: Executes your project
