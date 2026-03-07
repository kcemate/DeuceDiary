# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T10:33:52.285627

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main # Trigger on push to the main branch
  pull_request:
    branches:
      - main # Trigger on pull requests targeting the main branch

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Specify the Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build # Assuming you have a build script defined in package.json

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensures build-and-test has completed successfully
    if: github.ref == 'refs/heads/main' # Only deploy when pushing to main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging
        run: |
          # Replace with your staging deployment commands
          echo "Deploying to staging..."
          # Example: Deploy to a server using SSH
          # ssh user@staging-server "cd /path/to/app && git pull && npm install && npm run build && pm2 restart app"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensures build-and-test has completed successfully
    if: github.ref == 'refs/heads/main' # Only deploy when pushing to main branch
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production
        run: |
          # Replace with your production deployment commands
          echo "Deploying to production..."
          # Example: Deploy to a server using SSH
          # ssh user@production-server "cd /path/to/app && git pull && npm install && npm run build && pm2 restart app"
```

**Explanation:**

* **`name: CI/CD Pipeline`**: This defines the name of the workflow.
* **`on:`**: This section specifies the triggers that initiate the workflow.
    * **`push:`**:  Triggers the workflow whenever code is pushed to the `main` branch.
    * **`pull_request:`**: Triggers the workflow whenever a pull request is created or updated targeting the `main` branch.
* **`jobs:`**:  This section defines the individual jobs within the workflow.
    * **`build-and-test:`**: This job is responsible for building and testing the application.
        * **`runs-on: ubuntu-latest`**: Specifies the virtual machine environment to run the job on (Ubuntu).
        * **`steps:`**: A list of individual steps to execute within the job.
            * **`actions/checkout@v3`**: Checks out the code from the repository.
            * **`actions/setup-node@v3`**: Sets up the Node.js environment with the specified version.
            * **`npm install`**: Installs the project's dependencies.
            * **`npm test`**: Runs the project's tests.
            * **`npm run build`**: Executes the build script (assuming you have one defined in your `package.json`).
    * **
