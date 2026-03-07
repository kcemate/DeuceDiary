# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T13:41:59.216987

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be used as a starting point for your application security assessments.  It's broken down by vulnerability and includes recommended checks, tools, and considerations.

**Important Disclaimer:** This checklist is a starting point.  The depth of assessment needed will vary dramatically based on the application's complexity, risk profile, and regulatory requirements.  It should be used in conjunction with expert security assessments and penetration testing.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, Command, OS)**

* **Description:** Attackers inject malicious code into an application, typically through user input, to execute unintended commands on the server or database.
* **Checks:**
    * **Input Validation:**  Implement robust input validation at *all* points of data entry (forms, APIs, database queries, etc.). Use whitelisting (allowing only known good characters/patterns) rather than blacklisting (trying to block bad ones).
    * **Parameterized Queries/Prepared Statements:**  *Always* use parameterized queries or prepared statements when interacting with databases.  This separates data from code.
    * **Escaping:** If parameterized queries aren't possible, use proper escaping mechanisms specific to the database and programming language. (Understand the limitations of escaping!)
    * **Stored Procedures:** Use stored procedures for database operations to reduce direct database exposure.
    * **Principle of Least Privilege:** Database users should have only the minimum necessary permissions.
* **Tools:** Static Analysis Security Testing (SAST) tools, Dynamic Analysis Security Testing (DAST) tools, SQL Injection Scanning Tools (e.g., OWASP ZAP, Burp Suite).
* **Risk Level:** High

**2. Broken Authentication**

* **Description:** Weak or poorly implemented authentication mechanisms allowing attackers to impersonate users or gain unauthorized access.
* **Checks:**
    * **Strong Passwords:** Enforce strong password policies (length, complexity, history).  Discourage password reuse.
    * **Multi-Factor Authentication (MFA):** Implement MFA wherever possible – this is *critical*.
    * **Session Management:**  Securely manage sessions (use secure cookies, HTTPOnly and Secure flags, regenerate session IDs after login, and properly invalidate sessions on logout).
    * **Password Storage:**  Never store passwords in plaintext.  Use strong, salted, and hashed passwords (e.g., Argon2, bcrypt).
    * **Rate Limiting:** Limit the number of login attempts to prevent brute-force attacks.
    * **Account Lockout:** Implement account lockout after multiple failed login attempts.
* **Tools:**  SAST, DAST, Authentication Security Scanners.
* **Risk Level:** High

**3. Sensitive Data Exposure**

* **Description:**  Failure to protect sensitive data (PII, credentials, API keys) in transit, storage, or in use.
* **Checks:**
    * **Data Classification:** Identify what data is sensitive and apply appropriate protection levels.
    * **Encryption in Transit:** Use TLS/SSL for all communication channels (HTTPS).  Enforce strong cipher suites.
    * **Encryption at Rest:** Encrypt sensitive data stored in databases, file systems, and backups.
    * **Data Masking/Tokenization:** Mask or tokenize sensitive data when it’s not needed in its full form.
    * **Access Control:**  Implement strict access control policies based on the principle of least privilege.
    * **Secure Configuration Management:**  Ensure servers and databases are not configured with default credentials or unnecessary services running.
* **Tools:**  Vulnerability Scanners, Configuration Management Tools, Key Management Systems (KMS).
* **Risk Level:** High

**4. XML External Entities
