# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T22:09:47.715584

Okay, here's a comprehensive security checklist for launching your Express + React app to production, covering the OWASP Top 10, CSP, rate limiting, input sanitization, and authentication hardening. This is a starting point; you'll need to adapt it to your specific application and environment.

**I. General Infrastructure & Environment Security**

*   **Secure Server Environment:**
    *   **HTTPS Only:** Enforce HTTPS for all traffic. Ensure a valid SSL/TLS certificate is installed and properly configured.
    *   **Firewall:** Implement a Web Application Firewall (WAF) like Cloudflare, AWS WAF, or ModSecurity to protect against common web attacks.
    *   **Regular Updates:** Keep your server OS, Node.js, Express, React, and all dependencies up to date with the latest security patches. Automate this where possible.
    *   **Monitoring & Logging:**  Implement robust logging and monitoring for all application components.  Use a centralized logging system (e.g., ELK stack, Splunk) for analysis.  Set up alerts for suspicious activity.
    *   **Secure Deployment Pipeline:**  Use a secure CI/CD pipeline. Scan your code for vulnerabilities at each stage.

**II. OWASP Top 10 & Mitigation Strategies**

1.  **Injection (SQL, NoSQL, OS Command)**
    *   **Input Validation:**  Implement strict input validation on *all* user inputs, both client-side and server-side. Utilize parameterized queries or ORM features to prevent direct SQL injection.
    *   **Prepared Statements:**  Always use prepared statements when interacting with databases.
    *   **Principle of Least Privilege:**  Grant database users only the necessary permissions.
2.  **Broken Authentication**
    *   **(See Authentication Hardening section below)**
3.  **Sensitive Data Exposure**
    *   **Encryption:** Encrypt sensitive data at rest (database, files) and in transit (HTTPS).
    *   **Token Management:** Use strong token generation and management practices (JWT, OAuth).  Rotate keys regularly.
    *   **Data Masking/Redaction:** Mask or redact sensitive data in logs and error messages.
4.  **XML External Entities (XXE)**  (Less common in modern web apps, but check)
    *   **Disable External Entities:**  Configure XML parsers to disable the processing of external entities.
5.  **Broken Access Control**
    *   **Authorization Checks:** Implement rigorous authorization checks *before* allowing users to access resources or perform actions.
    *   **Role-Based Access Control (RBAC):**  Use RBAC to manage user permissions effectively.
    *   **Cross-Site Scripting (XSS) Mitigation:** (See below)
6.  **Security Misconfiguration**
    *   **Default Credentials:**  Never use default credentials.
    *   **Error Handling:**  Implement proper error handling to avoid revealing sensitive information in error messages.  Log errors internally, but display generic error messages to users.
    *   **Development Environment:**  Ensure your development and staging environments are *not* accessible to the public.
7.  **Vulnerable and Outdated Components**
    *   **Dependency Scanning:** Use tools like Snyk, OWASP Dependency-Check, or npm audit to identify vulnerabilities in your dependencies.
    *   **Regular Updates:** Patch vulnerable dependencies promptly.
8.  **Lack of Logging & Monitoring**
    *   **(See Monitoring & Logging section above)**
9.  **Server-Side Request Forgery (SSRF)**
    *   **Input Validation:**  Strictly validate URLs used in requests to prevent SSRF.
    *   **Whitelist Domains:**  Configure your server to
