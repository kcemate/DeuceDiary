# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T13:19:23.592570

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the OWASP Top 10 vulnerabilities and provides a framework for assessing your application's security posture. It's a starting point and should be tailored to your specific application, technology stack, and risk tolerance.

**Note:**  This is a high-level checklist. Each item requires deeper investigation and potentially specialized tools and expertise.

**1. Injection (SQL, NoSQL, OS Command, LDAP)**

* **[ ] Code Review:** Regularly review code for dynamic SQL queries, command injection, or other potential input vulnerabilities.
* **[ ] Input Validation:** Implement robust input validation (Whitelist – allow only expected characters/formats) for all user-supplied data.
* **[ ] Parameterized Queries:**  Use parameterized queries or prepared statements to prevent SQL injection.
* **[ ] Stored Procedures:**  Utilize stored procedures with parameterized inputs where possible.
* **[ ] Escaping (Avoid if Possible):** If parameterized queries aren't feasible, use proper escaping techniques *only* as a last resort.  Understand the limitations of escaping.
* **[ ] Least Privilege:** Database user accounts should have the minimum required privileges.

**2. Broken Authentication**

* **[ ] Strong Passwords:** Enforce strong password policies (minimum length, complexity, mixed character types).
* **[ ] Multi-Factor Authentication (MFA):** Implement MFA for all users, especially privileged accounts.
* **[ ] Account Lockout:** Implement account lockout mechanisms after multiple failed login attempts.
* **[ ] Session Management:** Securely manage user sessions (HTTPOnly, Secure flags, session timeouts, regeneration).
* **[ ] Password Reset Mechanisms:** Implement secure password reset mechanisms that prevent brute-force attacks.
* **[ ] Rate Limiting:** Implement rate limiting on login attempts and password reset requests.
* **[ ] OAuth / SAML Integration:** If using external authentication, properly configure and maintain integration security.


**3. Sensitive Data Exposure**

* **[ ] Data Classification:** Identify and classify sensitive data (PII, financial, etc.).
* **[ ] Encryption at Rest:** Encrypt sensitive data at rest using strong encryption algorithms.
* **[ ] Encryption in Transit:**  Enforce HTTPS/TLS for all data in transit.  Verify SSL/TLS certificates.
* **[ ] Data Masking/Tokenization:**  Use data masking or tokenization for sensitive data in non-production environments.
* **[ ] Access Controls:** Implement granular access controls to restrict access to sensitive data based on the principle of least privilege.
* **[ ] Audit Logging:** Log all access to sensitive data for monitoring and incident investigation.


**4. XML External Entities (XXE)**

* **[ ] Disable External Entity Resolution:** Disable external entity resolution in XML parsers.
* **[ ] Validate XML Input:**  Validate XML input to ensure it conforms to expected schemas.
* **[ ]  Use Secure XML Libraries:** Use well-maintained and secure XML parsing libraries.
* **[ ]  Regular Updates:** Keep XML parsing libraries updated to patch known vulnerabilities.


**5. Broken Access Control**

* **[ ] Authorization Checks:** Implement robust authorization checks to verify that users have the necessary permissions to access resources.
* **[ ] Role-Based Access Control (RBAC):** Use RBAC to manage user permissions.
* **[ ] Session State Management:** Ensure accurate session state management.
* **[ ] Cross-Site Scripting (XSS) Mitigation:** (See #6) – XSS can lead to unauthorized access.
* **[ ] API Security:** Secure APIs with proper authentication and authorization mechanisms.
* **[ ] Resource Hierarchy:**  Implement a clear resource hierarchy to control access levels.


**6. Cross-Site
