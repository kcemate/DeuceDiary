# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T20:01:16.110510

Okay, here’s a comprehensive security checklist for launching an Express + React application to production, covering the OWASP Top 10, CSP, rate limiting, input sanitization, and authentication hardening. This is a starting point; you’ll need to tailor it to your specific application's architecture and complexity.

**I. Application Architecture & Infrastructure Security**

*   **Secure Deployment Environment:**
    *   Use a reputable cloud provider (AWS, Azure, Google Cloud) with appropriate security configurations.
    *   Employ Infrastructure as Code (IaC) – tools like Terraform or CloudFormation to ensure consistent and secure deployments.
    *   Regularly scan infrastructure for vulnerabilities.
*   **Network Security:**
    *   Use a Web Application Firewall (WAF) – Cloudflare, AWS WAF, Azure Application Gateway – to filter malicious traffic.
    *   Implement network segmentation to isolate the application server from other systems.
    *   Regularly review and update firewall rules.
*   **Monitoring & Logging:**
    *   Implement centralized logging for all application components (Express, React, database).
    *   Set up real-time monitoring for performance, errors, and security events. Utilize tools like Prometheus, Grafana, or cloud-native monitoring services.
    *   Alerting: Configure alerts for critical security events.

**II. Addressing the OWASP Top 10**

1.  **Injection (SQL, NoSQL, OS):**
    *   **Backend (Express):** Use parameterized queries or ORMs (Sequelize, Mongoose) to prevent SQL/NoSQL injection.  Never concatenate user input directly into queries.
    *   **Frontend (React):**  Carefully design input fields.  Validate data thoroughly.
    *   **Testing:**  Perform penetration testing to identify injection vulnerabilities.
2.  **Broken Authentication:**
    *   (Covered in detail under Auth Hardening)
3.  **Sensitive Data Exposure:**
    *   **Data Classification:** Identify and classify all sensitive data (PII, financial, etc.).
    *   **Encryption:** Encrypt sensitive data at rest (database) and in transit (HTTPS).
    *   **Token Storage:**  Properly handle API keys and secrets – never commit them to source control. Use environment variables.
4.  **XML External Entities (XXE):** (Less common in React, but important for backend XML processing)
    *   Validate XML input carefully. Avoid processing untrusted XML.
5.  **Broken Access Control:**
    *   **RBAC (Role-Based Access Control):**  Implement a robust RBAC system to control user access to resources.
    *   **Authorization Middleware:** Use middleware to enforce access controls before any API endpoint is called.
    *   **Prevent Horizontal Privilege Escalation:** Ensure users cannot access resources they shouldn't.
6.  **Security Misconfiguration:**
    *   **Secure Defaults:**  Use secure default configurations for all components.
    *   **Regular Updates:**  Keep all software (Express, React, Node.js, database) up-to-date with the latest security patches.
    *   **Server Hardening:** Secure the operating system and web server. Disable unnecessary services.
7.  **Vulnerable and Outdated Components:**
    *   **Software Composition Analysis (SCA):** Use tools like Snyk or OWASP Dependency-Check to identify vulnerable components in your project.
    *   **Dependency Management:** Regularly update dependencies to the latest versions, addressing security vulnerabilities.
8.  **Security Logging & Monitoring Issues:**
    *   (Covered in Monitoring & Logging section above)
9.  **Server-Side Request Forgery (SSRF):**
    *
