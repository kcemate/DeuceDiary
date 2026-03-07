# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T18:30:39.885806

Okay, here's a comprehensive security checklist for an Express + React application launching to production, covering the OWASP Top 10, CSP headers, rate limiting, input sanitization, and authentication hardening. This checklist is designed to be a starting point; your specific requirements will depend on the application's complexity, data sensitivity, and target audience.

**I. General Security Practices & Architecture**

*   **Secure Development Lifecycle (SDLC):** Implement a robust SDLC incorporating security at every stage – planning, design, development, testing, deployment, and maintenance.
*   **Dependency Management:**
    *   Use a package manager (npm, yarn) consistently.
    *   Regularly audit dependencies for vulnerabilities using tools like `npm audit`, `yarn audit`, or Snyk.
    *   Keep dependencies up-to-date – prioritize security patches.
*   **Infrastructure Security:**
    *   Use a reputable cloud provider (AWS, Azure, GCP) and follow their security best practices.
    *   Employ Infrastructure as Code (IaC) to ensure consistent and secure configurations.
    *   Regularly scan your infrastructure for vulnerabilities.
*   **Monitoring & Logging:** Implement comprehensive logging and monitoring for all application components.  Use a centralized logging solution for analysis and alerting. Include request IDs for tracing.
*   **Secrets Management:**  Never hardcode secrets (API keys, database credentials) into code. Use a secrets management system (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, Google Cloud Secret Manager).


**II. Addressing the OWASP Top 10**

1.  **Injection:**
    *   **Input Validation & Sanitization:** (See Section IV) –  *Critical*
    *   Use parameterized queries or ORM features to prevent SQL injection.
    *   Carefully sanitize all user inputs, including HTML, JavaScript, and command-line arguments.
    *   Implement escaping for output (e.g., using template literals in React).

2.  **Broken Authentication:**
    *   **Authentication Hardening:** (See Section V) – *Critical*
    *   Multi-Factor Authentication (MFA): Strongly consider implementing MFA.
    *   Rate Limiting: (See Section III) – *Critical*
    *   Session Management: Securely manage user sessions – use short session timeouts, secure cookies (HTTPOnly, Secure flags), and consider token-based authentication (JWT).
    *   Password Policies: Enforce strong password policies (length, complexity, rotation).
    *   Account Lockout: Implement account lockout after multiple failed login attempts.

3.  **Sensitive Data Exposure:**
    *   Data Encryption: Encrypt sensitive data both in transit (HTTPS) and at rest (database).
    *   Data Masking/Tokenization:  Mask or tokenize sensitive data when displaying or processing it.
    *   Secure Storage: Store data securely, following regulations (GDPR, CCPA, etc.).

4.  **XML External Entities (XXE):**  (If using XML)
    *   Disable external entity resolution in your XML parsers.
    *   Carefully validate any XML data received from external sources.

5.  **Broken Access Control:**
    *   Role-Based Access Control (RBAC): Implement RBAC to control user access to resources.
    *   Authorization Checks:  Always verify user permissions before granting access to data or functionality.
    *   Secure API Endpoints:  Protect API endpoints with authentication and authorization.

6.  **Security Misconfiguration:**
    *   Secure Configuration:  Follow security best practices for your web server, database, and operating system.
    *   Remove Unnecessary Features: Disable or remove unnecessary features and services.
    *
