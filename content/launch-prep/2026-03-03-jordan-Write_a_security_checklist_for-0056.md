# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-03T00:56:52.784188

## Security Checklist: Express + React Production Launch

This checklist covers key security considerations for launching an Express + React application to production, aligning with the OWASP Top 10 and best practices. It's designed to be a starting point, and your specific implementation will require further tailored checks.

**I. Overall Security & Architecture**

* [ ] **Secure Development Lifecycle (SDL):** Implement a robust SDL that includes threat modeling, security reviews, and continuous security testing.
* [ ] **Static Code Analysis (SAST):** Integrate SAST tools into your CI/CD pipeline to identify vulnerabilities in your code.
* [ ] **Dynamic Application Security Testing (DAST):** Periodically run DAST tools to test the running application for vulnerabilities.
* [ ] **Infrastructure Security:**  Secure your server environment (cloud provider or on-premise) – firewalls, network segmentation, access control, regular patching.
* [ ] **Logging & Monitoring:** Implement comprehensive logging and monitoring for security events, errors, and performance.  Set up alerts for suspicious activity.
* [ ] **Incident Response Plan:**  Have a documented plan for handling security incidents – containment, eradication, recovery, and post-incident analysis.


**II. OWASP Top 10 Considerations**

1. **Injection (SQL, NoSQL, Command)**
    * [ ] **Parameterized Queries/Prepared Statements:**  Use parameterized queries or prepared statements in your Express routes to prevent SQL injection.
    * [ ] **Input Validation & Sanitization:**  Rigorous input validation and sanitization for *all* user inputs (forms, APIs, etc.) to prevent command injection and NoSQL injection.
    * [ ] **Stored Procedures:** Where appropriate, utilize stored procedures to mitigate the impact of potential vulnerabilities.

2. **Broken Authentication & Session Management**
    * [ ] **Strong Password Policies:** Enforce strong password policies (length, complexity, character requirements).
    * [ ] **Multi-Factor Authentication (MFA):** Implement MFA for administrative accounts and consider it for user accounts.
    * [ ] **Secure Session Management:** Use secure cookies (HttpOnly, Secure, SameSite), properly regenerate session IDs after login, implement session timeouts, and avoid storing sensitive information in session.
    * [ ] **Logout Functionality:**  Ensure a secure logout functionality properly destroys session data.
    * [ ] **Authentication Flow Review:** Thoroughly review your authentication flow for vulnerabilities, including OAuth, JWT, and API key authentication.

3. **Sensitive Data Exposure**
    * [ ] **Data Encryption at Rest:** Encrypt sensitive data at rest using appropriate encryption algorithms and key management practices.
    * [ ] **Data Encryption in Transit:**  Use HTTPS (TLS/SSL) for all communication between the client and server.  Enforce HSTS (HTTP Strict Transport Security).
    * [ ] **Data Masking/Tokenization:** Implement data masking or tokenization for sensitive data displayed to users or stored in non-production environments.
    * [ ] **Regular Data Audits:** Conduct regular audits of data access and usage to identify potential vulnerabilities.

4. **XML External Entities (XXE)**
    * [ ] **Disable External Entity Processing:** Configure your Express server to disable XML external entity processing.  If this isn't possible, carefully validate and sanitize any XML data.

5. **Broken Access Control**
    * [ ] **Role-Based Access Control (RBAC):** Implement RBAC to control user access to resources and functionality.
    * [ ] **Least Privilege Principle:**  Grant users only the minimum necessary permissions to perform their tasks.
    * [ ] **Authorization Checks:**  Implement authorization checks *before* executing any sensitive operations. Verify user roles, permissions, and data access rights.
    * [ ] **Cross-Site
