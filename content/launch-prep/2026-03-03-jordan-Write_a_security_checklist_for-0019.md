# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-03T00:19:44.471814

Okay, here's a comprehensive security checklist for launching an Express + React application to production, covering the OWASP Top 10, CSP, Rate Limiting, Input Sanitization, and Auth Hardening. This is a starting point; you’ll need to adapt it to your specific app and environment.

**I. General Security Considerations (Before Deployment)**

* **Secure Development Lifecycle (SDLC):** Integrate security into every stage of the development process – design, coding, testing, deployment, and maintenance.
* **Static Code Analysis (SAST):** Utilize tools like ESLint, SonarQube, or others to automatically identify potential vulnerabilities in your code.
* **Dynamic Application Security Testing (DAST):**  Employ tools to simulate attacks against your running application to uncover vulnerabilities.
* **Dependency Management:** Regularly update all Node.js, React, and any third-party libraries to the latest versions with security patches. Use tools like `npm audit` or `yarn audit`.
* **Secure Configuration Management:**  Store sensitive configuration details (API keys, database credentials) outside of your code repository. Use environment variables.
* **Regular Security Audits:**  Schedule periodic security audits (internal or external) to identify and address vulnerabilities.
* **Logging and Monitoring:** Implement robust logging for all application activity, including errors, access attempts, and security events.  Set up monitoring to alert you to suspicious activity.


**II. OWASP Top 10 Vulnerabilities & Mitigation**

1. **Injection (SQL, NoSQL, Command, etc.):**
   * **Mitigation:**
     * **Parameterized Queries/Prepared Statements:** *Always* use parameterized queries/prepared statements when interacting with databases.  This prevents malicious code from being injected.
     * **Input Validation & Sanitization:** Thoroughly validate *all* user inputs (even those that appear safe).  Sanitize inputs to remove potentially harmful characters.
     * **Principle of Least Privilege:** Ensure your database users have only the minimum necessary permissions.

2. **Broken Authentication:**
   * **Mitigation (Detailed in Section V - Auth Hardening)**
     * Multi-Factor Authentication (MFA)
     * Strong Password Policies
     * Secure Session Management
     * Regular Audits of Authentication Logs

3. **Sensitive Data Exposure:**
   * **Mitigation:**
     * **Data Encryption:** Encrypt sensitive data at rest (database) and in transit (HTTPS).
     * **Data Masking/Tokenization:** Mask or tokenize sensitive data where possible in non-production environments.
     * **Avoid Storing Sensitive Data:** Minimize the amount of sensitive data you store.  If you must, implement strict access controls.
     * **Secure Storage of Secrets:**  Never hardcode secrets in your application code. Use environment variables and a secure secrets management solution.

4. **XML External Entities (XXE):** (Potentially relevant if using XML in your application)
   * **Mitigation:** Disable external entity processing in your XML parsers and libraries.

5. **Broken Access Control:**
   * **Mitigation:**
     * **Role-Based Access Control (RBAC):** Implement RBAC to restrict access to resources based on user roles.
     * **Authentication + Authorization:** Ensure users are authenticated *before* they are granted access to any resource.
     * **Cross-Site Scripting (XSS) Prevention:**  (See below)

6. **Security Misconfiguration:**
   * **Mitigation:**
     * **Secure Defaults:**  Use secure default configurations for your application and servers.
     * **Regular Security Patches:** Keep your operating systems, web servers, databases, and all software components up-to-date with the latest security patches.
     * **Remove Unnecessary Features:** Disable
