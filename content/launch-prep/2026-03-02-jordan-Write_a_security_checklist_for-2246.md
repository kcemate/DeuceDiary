# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T22:46:54.366587

Okay, here's a comprehensive security checklist for an Express + React app launching to production, covering the OWASP Top 10, CSP, Rate Limiting, Input Sanitization, and Auth Hardening. This is a detailed checklist; prioritize based on your app's risk profile and complexity.

**I. General Security Considerations**

* **Secure Development Practices:**
    * **Static Code Analysis:** Implement tools (e.g., ESLint with security rules, SonarQube) to identify vulnerabilities early in the development lifecycle.
    * **Dynamic Application Security Testing (DAST):** Use tools (e.g., OWASP ZAP, Burp Suite) to test the running application for vulnerabilities.
    * **Regular Security Audits:** Schedule both internal and external audits.
    * **Secure Coding Standards:** Enforce consistent coding standards emphasizing security.
* **Infrastructure Security:**
    * **Secure DevOps Pipeline:** Implement security checks at every stage of your CI/CD pipeline.
    * **Secrets Management:**  *Never* hardcode credentials. Utilize a secure vault (e.g., AWS Secrets Manager, HashiCorp Vault, Azure Key Vault) to store and manage sensitive information. Rotate secrets regularly.
    * **Regular Patching:** Keep all servers, libraries, and frameworks up to date with the latest security patches.
    * **Monitoring & Logging:** Implement comprehensive logging for all aspects of the application and infrastructure.  Centralize logging for easy analysis.  Set up alerts for suspicious activity.
    * **Server Configuration:** Harden your servers (Express backend, React build server, etc.) following industry best practices.

**II. OWASP Top 10 Security Checks**

1. **Injection (SQL, NoSQL, OS Command):**
   * **Review:**  Analyze all database queries and user input to prevent vulnerabilities.
   * **Implementation:**  Use parameterized queries or ORMs that handle escaping automatically. Validate all inputs thoroughly. Avoid dynamic SQL construction.
2. **Broken Authentication:**
    * **Review:** Examine user authentication and session management processes.
    * **Implementation:**  Enforce strong password policies. Implement multi-factor authentication (MFA).  Use secure session management techniques (HTTPOnly, Secure flags).  Properly handle password resets and account recovery.
3. **Sensitive Data Exposure:**
    * **Review:** Identify all sensitive data stored or transmitted (PII, credentials, API keys).
    * **Implementation:**  Encrypt sensitive data at rest and in transit (TLS/SSL).  Mask or redact sensitive data in logs and debugging output.  Implement data loss prevention (DLP) strategies.
4. **XML External Entities (XXE):** (Primarily relevant to backend)
    * **Review:** If your backend processes XML, check for potential XXE vulnerabilities.
    * **Implementation:**  Disable external entity resolution in your XML parsing libraries.
5. **Broken Access Control:**
   * **Review:**  Verify that users can only access authorized resources and data.
   * **Implementation:** Implement robust role-based access control (RBAC). Enforce authorization checks on every API endpoint and route.  Avoid relying solely on client-side authorization.
6. **Security Misconfiguration:**
    * **Review:**  Audit server configurations, web server settings, and application settings.
    * **Implementation:** Follow security best practices for your chosen technologies. Disable unnecessary features and services.  Set appropriate file permissions.
7. **Vulnerable and Outdated Components:**
   * **Review:**  Track all third-party libraries and dependencies.
   * **Implementation:** Regularly update dependencies. Use a dependency management tool (npm, yarn) to track and manage versions.  Scan dependencies for vulnerabilities using tools like Snyk or OWASP Dependency-Check.
8.
