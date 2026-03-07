# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T23:42:34.476167

Okay, here’s a detailed security checklist for launching an Express + React app to production, covering the OWASP Top 10, CSP, rate limiting, input sanitization, and authentication hardening. This is a comprehensive list; prioritize based on your application's risk profile and complexity.

**I. General Application Security & Infrastructure**

* **Secure DevOps Pipeline:**
    * **Infrastructure as Code (IaC):** Use tools like Terraform or CloudFormation to manage infrastructure securely and consistently.
    * **Automated Security Scanning:** Integrate static and dynamic analysis tools into your CI/CD pipeline (e.g., SonarQube, Snyk, OWASP ZAP).
    * **Secrets Management:** Never hardcode secrets. Use a dedicated secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, Google Cloud Secret Manager).
    * **Immutable Deployments:** Deploy new versions of your application without rolling back, minimizing the attack surface.
* **Monitoring & Logging:**
    * **Centralized Logging:** Collect logs from all components (Express server, React client, database, etc.) in a central location (e.g., Elasticsearch, Splunk, Datadog).
    * **Real-time Monitoring:** Implement monitoring tools to detect anomalies and potential security issues.
    * **Alerting:** Set up alerts for suspicious activity, errors, and performance degradation.
* **Regular Security Audits:** Conduct periodic security audits (internal or external) to identify vulnerabilities.
* **Vulnerability Scanning:** Run automated vulnerability scans on your dependencies regularly.

**II. OWASP Top 10 – Addressing Vulnerabilities**

1. **Injection (SQL, NoSQL, Command, etc.):**
   * **Express:** Parameterize all database queries using prepared statements or ORM functions (e.g., Sequelize, Mongoose).  Never concatenate user input directly into SQL queries.
   * **React:**  Sanitize all user input before using it in any database queries, even if the backend handles them.

2. **Broken Authentication:**
   * **See Section V (Auth Hardening)** – This is heavily emphasized.

3. **Sensitive Data Exposure:**
   * **Data Masking/Redaction:** Mask or redact sensitive data in logs, error messages, and UI.
   * **Encryption in Transit (TLS/SSL):** Always use HTTPS.  Verify SSL certificates.
   * **Encryption at Rest:** Encrypt sensitive data stored in the database and storage services.
   * **Token Security:**  Carefully manage JWTs (see Section V).

4. **XML External Entities (XXE):**  (Less common in modern React apps, but check if you're using XML parsing.)
   *  Input validation, restrict XML parsing to trusted sources.

5. **Broken Access Control:**
   * **Role-Based Access Control (RBAC):** Implement RBAC to restrict access to sensitive resources based on user roles.
   * **Authorization Middleware:** Use middleware to enforce access control rules.
   * **Avoid exposing internal URLs:** Ensure no direct access to server-side code or admin interfaces.

6. **Security Misconfiguration:**
   * **Secure Default Configurations:** Change default passwords and configurations.
   * **Remove Unnecessary Features:** Disable unused components and features.
   * **Regularly Patch Software:** Apply security patches to all software components.

7. **Vulnerable and Outdated Components:**
   * **Software Composition Analysis (SCA):**  Use tools to identify vulnerable components in your dependencies (e.g., Snyk, npm audit).
   * **Dependency Management:** Regularly update dependencies to the latest secure versions.
   * **Monitor for Vulnerabilities:**  Subscribe to vulnerability databases (NVD, CVE) and monitor your dependencies
