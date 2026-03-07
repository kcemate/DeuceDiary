# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T19:43:09.852707

Okay, here’s a comprehensive security checklist for launching your Express + React app to production, covering the OWASP Top 10, CSP headers, rate limiting, input sanitization, and auth hardening. This checklist is designed to be a starting point; you should tailor it to your specific application and environment.

**I. General Security Posture & Infrastructure**

*   **Secure Development Environment:**
    *   Use a secure CI/CD pipeline.
    *   Implement Infrastructure as Code (IaC) for consistent and secure deployments.
    *   Regularly audit and update development environments.
*   **Logging & Monitoring:**
    *   Centralized logging system (e.g., ELK stack, Splunk).  Log all requests, errors, and security-related events.
    *   Real-time monitoring for suspicious activity (using tools like Datadog, New Relic, Prometheus).
    *   Alerting system configured for critical events.
*   **Patch Management:** Implement a rigorous patch management process for all servers, databases, and dependencies.  Automate where possible.
*   **Regular Security Audits:** Conduct both automated and manual security audits.
*   **Incident Response Plan:** Have a documented plan in place for responding to security incidents.  Test it regularly.



**II. OWASP Top 10 Remediation**

1.  **Injection (SQL, NoSQL, Command)**
    *   **Express:** Use parameterized queries or ORMs (e.g., Sequelize, Mongoose) to prevent SQL injection.  Never concatenate user input directly into queries.
    *   **React:**  Sanitize data used in API calls. Ensure all data passed to your backend is validated.
2.  **Broken Authentication**
    *   (Covered in detail under Auth Hardening)
3.  **Sensitive Data Exposure**
    *   **Encryption:**
        *   Encrypt sensitive data at rest (database, file storage).  Use strong encryption algorithms.
        *   Encrypt sensitive data in transit (HTTPS – always!).
        *   Properly handle and store API keys, passwords, and other secrets. Don’t hardcode them. Use environment variables.
    *   **Data Masking/Tokenization:** Consider data masking or tokenization for sensitive data displayed to users.
4.  **XML External Entities (XXE)**
    *   (Less relevant for modern React/Express, but important if you’re using XML in any part of your architecture.  Ensure XML parsing libraries are secure.)
5.  **Broken Access Control**
    *   **Express:** Implement robust access control mechanisms using middleware (e.g., JWT validation, role-based access control – RBAC).  Enforce authorization checks on every route.
    *   **React:** Ensure client-side components don’t unintentionally expose sensitive data or allow unauthorized actions.
6.  **Security Misconfiguration**
    *   Secure default configurations for all components.
    *   Remove or disable unnecessary features and services.
    *   Regularly review security configurations.
7.  **Vulnerable and Outdated Components**
    *   Maintain a bill of materials (SBOM) to track all dependencies.
    *   Regularly scan dependencies for vulnerabilities using tools like Snyk, Sonatype Nexus, or OWASP Dependency-Check.
    *   Update to the latest secure versions of all components promptly.
8.  **Insufficient Logging & Monitoring**
    *   (Covered under Logging & Monitoring in Section I)
9.  **Server-Side Request Forgery (SSRF)**
    *   Carefully validate and sanitize any data used to make outbound requests.  Restrict access to internal resources.
10. **Security Logging**
     * Implement comprehensive
