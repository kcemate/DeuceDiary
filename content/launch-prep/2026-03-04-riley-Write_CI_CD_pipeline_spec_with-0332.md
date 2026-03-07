# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T03:32:57.999370

Okay, here's a CI/CD pipeline specification for GitHub Actions, designed to be a starting point and adaptable to your specific project's needs. I'll include explanations and best practices.

**Pipeline Name:** `ci-cd` (or something more descriptive for your project)

**Triggers:**

*   **Push to all Branches:**  This will trigger the pipeline whenever code is pushed to any branch of the repository.
*   **Pull Request:**  Triggers the pipeline when a pull request is created or updated.  This is key for pre-integration testing.

**Jobs:**

This pipeline will have three main jobs:  `build`, `test`, and `deploy`.

**1. Build Job**

*   **Name:** `build`
*   **Runs on:** `ubuntu-latest` (or your preferred OS)
*   **Steps:**
    *   `actions/checkout@v3`:  Checks out the code from the repository.
    *   `setup-node@v3`: Sets up Node.js (or other required dependencies, e.g., Python, Java).
    *   `npm install`: Installs dependencies (or the equivalent for your language).
    *   `npm run build`:  Runs the build process (e.g., `npm run build`, `mvn clean install`, `gradle build`).  This step *must* be tailored to your project.
    *   `tar:gz . -C tmp`: Creates a compressed archive of the built artifact.
    *   `actions/upload-artifact@v3`: Uploads the archive (`.tar.gz` or equivalent) as an artifact.  This artifact will be used in later stages.

**YAML for the Build Job:**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: tar -czvf tmp.tar.gz .
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifact
          path: tmp.tar.gz
```

**2. Test Job**

*   **Name:** `test`
*   **Runs on:** `ubuntu-latest`
*   **Dependencies:** Requires the `build` job to successfully complete and upload the artifact.
*   **Steps:**
    *   `actions/download-artifact@v3`: Downloads the build artifact.
    *   `npm install`:  Re-installs dependencies (important for consistent test environments).
    *   `npm test`: Runs your project's tests. (This assumes you have a `test` script defined in your package.json).
    *   `npm run coverage`:  (Optional) Runs a code coverage tool (e.g., `nyc`) to measure code coverage.  You'll need to configure your `package.json` to use this.

**YAML for the Test Job:**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build-artifact
          path: tmp
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run coverage # Optional
```

**3. Deploy Job (Example - to a Server)**

*   **Name:** `deploy`
*   **Runs on:** `ubuntu-latest` (or a server-specific OS)
