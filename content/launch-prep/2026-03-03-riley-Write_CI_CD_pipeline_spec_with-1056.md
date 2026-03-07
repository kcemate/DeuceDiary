# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T10:56:25.297989

```yaml
name: CI/CD Pipeline - MyProject

on:
  push:
    branches:
      - main  # Trigger on push to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting the main branch

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Specify Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build Project
        run: npm run build  # Assuming you have a build script

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-test  # Ensure build-test completes successfully
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Specify Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Deploy to Staging
        run: |
          # Replace with your actual deployment commands
          npm run deploy-staging # Assuming a deployment script exists
          echo "Deployed to Staging!"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-test, deploy-staging # Ensure build-test and deploy-staging complete
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Specify Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Deploy to Production
        run: |
          # Replace with your actual deployment commands
          npm run deploy-production # Assuming a deployment script exists
          echo "Deployed to Production!"
```

**Explanation and Key Improvements:**

* **`on:`:** Defines when the workflow should trigger.  This example triggers on `push` to the `main` branch and on `pull_request` to the `main` branch. This is a standard pattern for CI/CD pipelines.
* **`jobs:`:** Contains the tasks that make up the pipeline.
* **`build-test` Job:**
    * **`runs-on:`:** Specifies the runner environment (Ubuntu in this case).
    * **`steps:`:**  A sequence of tasks to perform within the job.
        * **`actions/checkout@v3`:**  Checks out your code from the repository.  Crucial for every action.
        * **`actions/setup-node@v3`:**  Sets up a Node.js environment.  Very important for projects using Node.js.  You can specify the Node.js version.
        * **`npm install`:**  Installs the project's dependencies.
        * **`npm test`:**  Runs your project's tests.  This is a vital part of the CI process.
        * **`npm run build`:**  Exec
