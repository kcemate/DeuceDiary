# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-06T18:21:12.779522

```yaml
name: CI/CD Pipeline - Example Project

on:
  push:
    branches:
      - main # Trigger on push to the 'main' branch
  pull_request:
    branches:
      - main # Trigger on pull requests to the 'main' branch

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'  # Specify the Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build # Or your build command

      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build/  # Adjust path to your build output directory

  deploy:
    runs-on: ubuntu-latest
    needs: build # This job depends on the 'build' job completing successfully
    environment:
      name: production # Or your environment name (staging, development, etc.)
      url: ${{ secrets.PRODUCTION_URL }} # Optional: If you have a URL to deploy to
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Production
        # This is a placeholder - replace with your actual deployment steps
        run: |
          echo "Deploying to production..."
          # Add your deployment commands here.  Examples:
          # - SSH to your server and run deployment commands
          # - Use a cloud deployment service (e.g., AWS, Azure, GCP)
          # - Run scripts to deploy your application
          # Example using SSH (requires SSH key in GitHub Secrets)
          # ssh -o StrictHostKeyChecking=no user@your_server "cd /path/to/your/app && npm install && npm run deploy"
```

**Explanation and Key Improvements:**

1. **`name`:**  Clearly defines the pipeline's name.

2. **`on:`:** Specifies when the pipeline will trigger:
   - `push`: Triggers on every push to the `main` branch.
   - `pull_request`: Triggers on pull requests targeting the `main` branch.  This is good practice for code review.

3. **`jobs:`:** Defines the individual jobs that make up the pipeline.

4. **`build` Job:**
   - `runs-on: ubuntu-latest`:  Specifies the runner (virtual machine) to use.
   - `steps:`: Contains a sequence of tasks to execute.
     - `Checkout code`: Uses the `actions/checkout@v4` action to check out the code from your repository.
     - `Set up Node.js`: Uses the `actions/setup-node@v4` action to install Node.js.  The `node-version` specifies the version.
     - `Install dependencies`:  Runs `npm install` to install the project's dependencies.
     - `Run tests`:  Runs your test suite using `npm test`.  *Crucially, this assumes you have a `test` script defined in your `package.json`.*
     - `Build`: Runs your build command (e.g., `npm run build`).  *This assumes you have a `build` script defined in your `package.json`.*
     - `Upload Artifacts`:  This is a
