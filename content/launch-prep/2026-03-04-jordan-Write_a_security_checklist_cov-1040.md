# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T10:40:42.304724

## OWASP Top 10 Security Checklist - Comprehensive

This checklist is designed to help you assess your application's security posture against the OWASP Top 10 vulnerabilities. It’s a starting point and should be adapted to your specific application and environment.

**Frequency:** Regular scans (quarterly/bi-annually) combined with code reviews and penetration testing.

**Sections:**

* **I. Injection** (SQL, Command, LDAP)
* **II. Broken Authentication**
* **III. Sensitive Data Exposure**
* **IV. XML External Entities (XXE)**
* **V. Broken Access Control**
* **VI. Security Misconfiguration**
* **VII. Cross-Site Scripting (XSS)**
* **VIII. Insecure Deserialization**
* **IX. Using Components with Known Vulnerabilities**
* **X. Insufficient Logging & Monitoring**


---

**I. Injection (OWASP Top 10 - Priority 1)**

* [ ] **Input Validation:**  Implement robust input validation on all user-supplied data (client-side and server-side).  Use whitelisting instead of blacklisting.
* [ ] **Parameterized Queries/Prepared Statements:**  Utilize parameterized queries or prepared statements for all database interactions to prevent SQL injection. (Verify correct usage!)
* [ ] **Command Injection Prevention:** Escape or sanitize all user-supplied data before constructing shell commands. Avoid using shell commands whenever possible.
* [ ] **LDAP Injection Prevention:** Sanitize and validate all LDAP queries to prevent injection vulnerabilities.
* [ ] **Regular Testing:**  Employ static and dynamic analysis tools to detect injection vulnerabilities.


**II. Broken Authentication (OWASP Top 10 - Priority 1)**

* [ ] **Strong Password Policies:** Enforce strong password policies (length, complexity, rotation).
* [ ] **Multi-Factor Authentication (MFA):** Implement MFA wherever possible, especially for sensitive accounts.
* [ ] **Secure Storage:** Store passwords securely using hashing algorithms (e.g., bcrypt, Argon2) with salts. *Never* store passwords in plain text.
* [ ] **Session Management:**  Use secure session identifiers, implement session timeouts, and invalidate sessions upon logout.
* [ ] **Brute-Force Protection:**  Implement rate limiting and account lockout mechanisms to prevent brute-force attacks.
* [ ] **API Authentication:** Secure APIs with proper authentication and authorization mechanisms.


**III. Sensitive Data Exposure (OWASP Top 10 - Priority 1)**

* [ ] **Data Classification:** Identify and classify sensitive data (PII, financial data, etc.).
* [ ] **Encryption at Rest:** Encrypt sensitive data at rest using strong encryption algorithms.
* [ ] **Encryption in Transit:**  Use HTTPS for all communication channels, ensuring proper certificate management.
* [ ] **Data Masking/Tokenization:**  Utilize data masking or tokenization techniques when appropriate to protect sensitive data in non-production environments.
* [ ] **Secure Storage of Secrets:**  Manage secrets (API keys, passwords) securely using a dedicated secrets management solution.


**IV. XML External Entities (XXE) (OWASP Top 10 - Priority 2)**

* [ ] **Disable External Entity Support:**  Disable the processing of external entities in XML parsers and libraries.
* [ ] **Input Validation:** If external entity processing is absolutely necessary, rigorously validate and sanitize the input.
* [ ] **Use Safe XML Libraries:** Utilize XML libraries that provide built-in protections against XXE attacks.


**V. Broken Access Control (OWASP Top 10 - Priority 2)**

* [ ] **Principle of Least Privilege:** Grant users only the minimum level of access necessary to perform their tasks.
* [
