# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T15:27:22.873869

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to help you assess and mitigate risks. This is a starting point and needs to be adapted to your specific application and environment.

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, Command, LDAP)**

* **[ ] Code Review:** Review all user input points, especially database queries and system commands.
* **[ ] Parameterized Queries/Prepared Statements:** Ensure all database interactions use parameterized queries or prepared statements to prevent SQL injection.
* **[ ] Input Validation & Sanitization:** Implement robust input validation *before* processing any user-supplied data. Sanitize data to remove potentially harmful characters.
* **[ ] Least Privilege:** Database users should have the minimum necessary permissions.
* **[ ] Escaping (Last Resort):**  Avoid relying solely on escaping, as it's often error-prone.
* **[ ] Regular Updates:** Keep database software and libraries up to date with the latest security patches.


**2. Broken Authentication**

* **[ ] Strong Password Policies:** Enforce strong password policies (minimum length, complexity, rotation).
* **[ ] Multi-Factor Authentication (MFA):** Implement MFA wherever possible, especially for privileged accounts.
* **[ ] Account Lockout:**  Implement account lockout mechanisms after multiple failed login attempts.
* **[ ] Session Management:** Secure session management (HTTPOnly, Secure flags, session expiration, session fixation protection, and regular session regeneration).
* **[ ] Password Storage:** Use strong, salted, and hashed password storage (e.g., bcrypt, Argon2).  *Never* store passwords in plain text.
* **[ ] OAuth/OIDC Implementation:**  Ensure proper configuration and security practices when using OAuth/OIDC for authentication.
* **[ ] API Key Management:**  Securely store, rotate, and manage API keys.


**3. Sensitive Data Exposure**

* **[ ] Data Classification:** Identify and classify sensitive data (PII, financial, health, etc.).
* **[ ] Encryption at Rest:** Encrypt sensitive data at rest using appropriate algorithms and key management practices.
* **[ ] Encryption in Transit:**  Use HTTPS/TLS for all communication, ensuring strong cipher suites.
* **[ ] Data Masking/Tokenization:** Consider data masking or tokenization for non-production environments or when data doesn’t require full access.
* **[ ] Access Controls:** Implement strict access controls based on the principle of least privilege.
* **[ ] Data Loss Prevention (DLP):**  Implement DLP measures to prevent sensitive data from leaving the organization.
* **[ ] Regular Audits:** Conduct regular audits of data access and usage.


**4. XML External Entities (XXE)**

* **[ ] Disable External Entity Processing:** Disable XML external entity processing in your applications. This is a critical security measure.
* **[ ] Input Validation:**  Carefully validate XML input to prevent malicious entities.
* **[ ] Use Secure XML Libraries:** Use XML libraries that are known to be secure and properly handle external entities.
* **[ ]  Regular Updates:**  Keep XML libraries updated.


**5. Broken Access Control**

* **[ ] Authorization Checks:** Implement robust authorization checks at every level of your application.
* **[ ] Role-Based Access Control (RBAC):** Use RBAC to manage user permissions effectively.
* **[ ] Prevent Cross-Site Scripting (XSS) Exploitation:** Access control should be designed to prevent XSS attacks from being used to bypass security measures.
* **[ ] Input Validation (Related):** Input validation can play a role in preventing access control issues.
* **[ ] Session Management (Related):** Secure session management is
