# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T19:25:04.387478

Okay, here's a comprehensive security checklist for an Express + React application launching to production, covering the OWASP Top 10, CSP, rate limiting, input sanitization, and auth hardening. This is designed to be a starting point - adapt it to your specific application and its complexity.

**I. General Security Practices & Architecture**

* **Secure Development Lifecycle (SDLC):** Integrate security into every phase – design, development, testing, deployment, and maintenance.
* **Static Code Analysis:** Use tools like SonarQube, ESLint with security plugins to detect vulnerabilities in your code during development.
* **Dependency Management:**
    * **Regularly Update Dependencies:** Prioritize updating all Node.js, React, Express, and any other dependencies to the latest versions with security patches. Use `npm audit` or `yarn audit`.
    * **Vulnerability Scanning:** Use tools like Snyk or Dependabot to scan your dependencies for known vulnerabilities.
    * **Minimize Dependencies:** Reduce the number of dependencies to limit the attack surface.
* **Infrastructure Security:**
    * **Secure Server Environment:** Use a reputable cloud provider (AWS, Azure, GCP) with security best practices enabled.
    * **Regular Security Audits:**  Conduct regular security audits of your infrastructure.
    * **Access Control:** Implement strong access controls to your servers, databases, and other resources. Use the principle of least privilege.

**II. OWASP Top 10 & Mitigation Strategies**

1. **Injection (SQL, NoSQL, Command, etc.):**
   * **Mitigation:** Use parameterized queries or ORMs (like Sequelize, Prisma) to prevent direct injection of user input into database queries. Employ prepared statements. Validate all user input rigorously.
2. **Broken Authentication:**
   * **Mitigation (Detailed in Authentication Hardening Section Below)**
3. **Sensitive Data Exposure:**
   * **Mitigation:**
      * **Encryption in Transit:**  Always use HTTPS (TLS/SSL) for all communication.
      * **Encryption at Rest:** Encrypt sensitive data in your database.
      * **Avoid Hardcoding Secrets:** Never store API keys, passwords, or other secrets directly in the code. Use environment variables or a secure secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager).
4. **XML External Entities (XXE):**  (Less common in modern React/Express, but still a concern if parsing XML)
   * **Mitigation:**  Disable external entity resolution in your XML parsing libraries.
5. **Broken Access Control:**
    * **Mitigation:**  Implement robust access control mechanisms. Verify that users can only access the resources they are authorized to access. Use role-based access control (RBAC) and implement proper authorization logic in both the Express backend and React frontend.  Avoid using client-side-only authorization.
6. **Security Misconfiguration:**
    * **Mitigation:**  Follow security best practices for your server environment, web server (Express), and database.  Harden your server images and applications.
7. **Vulnerable and Outdated Components:** (Covered in Dependency Management above)
8. **Weak Cryptography:**
   * **Mitigation:** Use strong encryption algorithms and key lengths.  Regularly review your cryptography implementation.
9. **Insufficient Logging & Monitoring:**
   * **Mitigation:**  Implement comprehensive logging to capture security events, errors, and user activity.  Set up monitoring to detect anomalies and potential attacks. Use a centralized logging solution (e.g., ELK stack, Splunk).
10. **Server-Side Request Forgery (SSRF):** (Potentially relevant if your backend makes external API calls based on user input)
    * **Mitigation:**  Validate and sanitize all
