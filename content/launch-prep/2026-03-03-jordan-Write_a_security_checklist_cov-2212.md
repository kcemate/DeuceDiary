# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T22:12:49.559815

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to help you assess and improve your application's security posture.  It's broken down by vulnerability, with specific checks and considerations.

**Important Disclaimer:** This is a high-level checklist. Implementing these checks effectively requires a deep understanding of your specific application, technology stack, and business context.  This should be used as a starting point for a more thorough security assessment, potentially including penetration testing and code reviews.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, Command, etc.)**

* **Check:**
    * **Input Validation:** Are all user inputs validated and sanitized before being used in database queries, operating system commands, or other sensitive contexts?  (Implement whitelisting whenever possible).
    * **Parameterized Queries/Prepared Statements:** Are you using parameterized queries or prepared statements for all database interactions?  (This is *essential*).
    * **Stored Procedures:**  Are stored procedures used instead of dynamic SQL where possible?  (Stored procedures can offer some level of protection if constructed correctly).
    * **Command Injection Checks:** Are you sanitizing user-supplied data before constructing OS commands? (Avoid using user input directly in commands).
* **Tools:** Static analysis tools, SQL injection scanner.

**2. Broken Authentication**

* **Check:**
    * **Strong Passwords:** Enforce strong password policies (minimum length, complexity, history).
    * **Multi-Factor Authentication (MFA):**  Implement MFA where feasible, especially for sensitive accounts.
    * **Session Management:** Securely manage user sessions (random session IDs, HTTPOnly and Secure flags for cookies, session timeouts).
    * **Credential Storage:** Never store passwords in plain text. Use strong hashing algorithms (e.g., bcrypt, Argon2) with salts.
    * **Rate Limiting:**  Implement rate limiting to prevent brute-force attacks.
    * **Account Lockout:** Implement account lockout policies after multiple failed login attempts.
* **Tools:** Authentication testing tools, vulnerability scanners.


**3. Sensitive Data Exposure**

* **Check:**
    * **Data Classification:** Identify and classify all sensitive data (PII, financial, medical, etc.).
    * **Encryption:** Encrypt sensitive data at rest (databases, file storage) and in transit (HTTPS).  Use strong encryption algorithms.
    * **Tokenization/Masking:** Consider tokenization or data masking for non-production environments.
    * **Secure Storage:** Ensure sensitive data is stored securely, limiting access to authorized personnel only.
    * **Logging & Monitoring:**  Enable detailed logging of access to sensitive data and monitor for suspicious activity.
* **Tools:** Data loss prevention (DLP) tools, data discovery tools.

**4. XML External Entities (XXE)**

* **Check:**
    * **Disable External Entity Processing:** Disable XML external entity processing in your application and web servers. This is the *most* important step.
    * **Input Validation:**  Validate XML input thoroughly.
    * **Contextual Awareness:**  Understand the potential risks of XXE based on how you’re using XML data.
* **Tools:** XXE scanner, static analysis tools.

**5. Broken Access Control**

* **Check:**
    * **Authentication & Authorization:** Verify users are properly authenticated *before* granting access to resources.
    * **Role-Based Access Control (RBAC):** Implement RBAC to control access based on user roles.
    * **Access Control Lists (ACLs):**  Use ACLs to restrict access to specific resources.
    * **Cross-Site Scripting (XSS) Prevention:** (Related – XSS can be used
