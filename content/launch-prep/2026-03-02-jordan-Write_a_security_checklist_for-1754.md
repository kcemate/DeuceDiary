# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T17:54:17.507685

Okay, here's a comprehensive security checklist for launching an Express + React app to production, covering the OWASP Top 10, CSP, rate limiting, input sanitization, and auth hardening. This is a detailed checklist – prioritize based on your app’s specific risks and complexity.

**I. General Security Posture & Infrastructure**

*   **Secure Development Lifecycle (SDLC):** Implement a security-focused SDLC.
*   **Code Reviews:** Mandatory security reviews for all code changes.
*   **Static Application Security Testing (SAST):** Integrate SAST tools into your CI/CD pipeline to automatically scan for vulnerabilities in code. (e.g., ESLint with security plugins, SonarQube)
*   **Dynamic Application Security Testing (DAST):** Conduct DAST scans of your running application to identify vulnerabilities that SAST might miss. (e.g., OWASP ZAP, Burp Suite)
*   **Dependency Management:**
    *   **Regular Updates:** Maintain all dependencies (Node.js, React, Express, libraries) to the latest secure versions.
    *   **Vulnerability Scanning:** Utilize tools like `npm audit` or `yarn audit` to identify vulnerabilities in your dependencies.
    *   **Software Bill of Materials (SBOM):**  Generate an SBOM to track all components and dependencies.
*   **Secrets Management:** Never hardcode secrets (API keys, database passwords, etc.) in your code. Use a secrets management system (e.g., HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).
*   **Logging & Monitoring:** Implement comprehensive logging and monitoring to detect suspicious activity, errors, and performance issues.  Set up alerts for critical events.
*   **Regular Backups:**  Implement a robust backup and recovery strategy.
*   **Secure Hosting Environment:** Choose a reputable and secure hosting provider with appropriate security controls (SSL/TLS, DDoS protection, firewalls).

**II. OWASP Top 10 Security Checks**

1.  **Injection (SQL, NoSQL, Command, etc.):**
    *   **Input Validation:** Rigorously validate *all* user input, including data from forms, API requests, and cookies.
    *   **Parameterized Queries/Prepared Statements:**  Use parameterized queries or prepared statements in your database interactions to prevent SQL injection.
    *   **Avoid Dynamic SQL:**  Minimize the use of dynamic SQL queries where user input is directly incorporated.
    *   **NoSQL Injection:**  Properly sanitize and validate NoSQL queries, especially when using MongoDB or similar.

2.  **Broken Authentication:**
    *   **Strong Password Policies:** Enforce strong password policies (minimum length, complexity requirements).
    *   **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially administrators.
    *   **Rate Limiting:** Implement rate limiting on login attempts.
    *   **Session Management:** Use secure session management techniques (HTTPOnly cookies, secure flags).
    *   **Password Reset Flows:**  Securely implement password reset flows, including token generation and expiration.

3.  **Sensitive Data Exposure:**
    *   **Data Classification:** Identify and classify sensitive data.
    *   **Encryption:** Encrypt sensitive data both in transit (HTTPS) and at rest (database, storage).
    *   **Tokenization/Masking:**  Use tokenization or masking techniques for sensitive data when it's not needed in its raw form.
    *   **Data Minimization:** Only collect and store the data that is strictly necessary.

4.  **XML External Entities (XXE):**
    *   **Disable External Entities:**  Configure your XML parsers to disable the processing of external entities.  This is particularly important if your
