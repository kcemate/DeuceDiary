# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T07:30:28.599361

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the OWASP Top 10 web application security risks, providing a framework for identifying and mitigating vulnerabilities.  It’s designed to be adaptable to different application types and sizes. **This is not exhaustive and should be used in conjunction with professional security assessments.**

**I. Injection (A1, A2, A6)**

* **SQL Injection:**
    * [ ] **Input Validation:** Strict input validation on *all* user-supplied data entering the database. Use parameterized queries or prepared statements.
    * [ ] **Escaping:** Properly escape data before using it in queries. (Less effective than parameterized queries, but a secondary measure).
    * [ ] **Least Privilege:** Database users have the *minimum* necessary privileges.
    * [ ] **Stored Procedures:** Utilize stored procedures where appropriate to reduce direct SQL access.
    * [ ] **Regular Audits:**  Review database queries and user permissions regularly.
* **NoSQL Injection:**
    * [ ] **Input Validation:** Strict input validation for all NoSQL query parameters.
    * [ ] **Parameterization:** Use parameterized queries or prepared statements for NoSQL database interactions.
    * [ ] **Avoid Dynamic Queries:** Minimize the use of dynamic queries that build queries from user input.
* **Command Injection:**
    * [ ] **Avoid Dynamic Command Execution:**  Eliminate the need to execute operating system commands based on user input.
    * [ ] **If Necessary, Strict Validation:**  If command execution is absolutely necessary, perform extremely rigorous input validation and sanitization.
    * [ ] **Least Privilege:** Run processes with the lowest possible privileges.

**II. Authentication (A2, A3, A7, A8)**

* **Broken Authentication:**
    * [ ] **Strong Password Policies:** Enforce strong password policies (length, complexity, history).
    * [ ] **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially privileged accounts.
    * [ ] **Rate Limiting:** Implement rate limiting on login attempts to mitigate brute-force attacks.
    * [ ] **Session Management:** Securely manage user sessions (e.g., HttpOnly flag, secure cookies, session timeouts).
    * [ ] **Password Reset Mechanisms:** Secure password reset mechanisms with strong verification.
* **Credential Stuffing:**
    * [ ] **Monitor for Compromised Credentials:** Implement monitoring for leaked credentials from other breaches.
    * [ ] **Strong Password Hashing:**  Use strong, adaptive hashing algorithms (e.g., Argon2, bcrypt) with a unique salt for each password.
* **Insufficient Identity Protection:**
    * [ ] **Secure User Storage:** Protect user credentials during storage and transmission.
    * [ ] **Regular Password Rotation (Carefully Considered):**  Consider password rotation strategies, balancing security with user convenience and potential for password fatigue.
* **Broken Account Recovery:**
    * [ ] **Secure Recovery Process:** Implement a secure and verified account recovery process.  Avoid easy-to-guess recovery questions.



**III. Sensitive Data Exposure (A3, A5)**

* **Exposed Sensitive Data:**
    * [ ] **Data Classification:**  Identify and classify all sensitive data (PII, financial, etc.).
    * [ ] **Encryption in Transit:** Use TLS/SSL for all communication channels.
    * [ ] **Encryption at Rest:** Encrypt sensitive data at rest, both in databases and file systems.
    * [ ] **Data Masking/Tokenization:**  Use data masking or tokenization for non-production environments.
    * [ ] **Secure Data Storage:** Implement secure storage solutions with appropriate access controls.
* **Lack of Data Retention Policy:**
    * [
