# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T21:53:21.326092

Okay, let's outline a CI/CD pipeline specification using GitHub Actions. This will be a moderately detailed spec, allowing you to adapt it to your specific needs.  I'll provide a starting point, and you should customize it for your project’s complexity, technologies, and desired level of automation.

**Pipeline Name:** `CI-CD-Pipeline`

**Trigger:**  "Every push to any branch" (This allows for continuous integration on every code change)

**Workflow File:** `workflows/ci-cd.yml` (Recommended: organize your workflows in a `workflows` directory)

**Overall Strategy:** This pipeline will perform tests on every push, build a container image, and deploy the image to a container registry (e.g., Docker Hub, AWS ECR, Google Container Registry).

---

**YAML Specification (`workflows/ci-cd.yml`):**

```yaml
name: CI-CD-Pipeline

on:
  push:
    branches:
      - main  # Or your primary development branch
  pull_request:
    branches:
      - main

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js (Example - Adapt for your language)
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Or your desired Node.js version

      - name: Install dependencies
        run: npm install  # Or yarn install, pip install, etc.

      - name: Run Tests
        run: npm test  # Or your test command

      - name: Build (Example - Adjust for your project)
        run: npm run build

  build-and-push:
    needs: build-test # Ensures tests pass before building
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_IMAGE_TAG }}  # Or use a tagging strategy

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Execute Deployment Script (Example - Adapt)
        run: |
          # Replace with your deployment command.  Example:
          echo "Deploying..."
          # Use SSH or a deployment tool like Ansible, Terraform, etc.
          # Example: ssh user@server "docker pull ${{ secrets.DOCKER_IMAGE_TAG }}"
          # Example: Run Terraform to deploy your infrastructure
```

**Explanation and Key Considerations:**

1. **`on:`**:
   - `push`:  Triggers the pipeline when code is pushed to the specified branch (e.g., `main`).
   - `pull_request`: Triggers the pipeline when a pull request is created or updated.

2. **`jobs:`**: Defines the individual stages of the pipeline.
   - **`build-test`**:
     - `runs-on: ubuntu-latest`: Uses the Ubuntu 20.04 (or later) virtual machine for this
