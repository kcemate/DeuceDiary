# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T19:11:32.518184

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable for various types of applications and organizations. It’s broken down by vulnerability category and includes tasks to assess, mitigate, and monitor.

**Important Notes Before You Start:**

* **This is a starting point.** Tailor this checklist to your specific application, technology stack, and risk tolerance.
* **Prioritize.** Not all vulnerabilities are equal. Assess the potential impact and likelihood of each to focus your efforts.
* **Regularity:** Security is not a one-time fix. This checklist should be reviewed and updated regularly (at least quarterly, or after major changes).
* **Automation:** Utilize automated scanning tools to supplement manual testing.

---

**I. Injection (OWASP Top 3)**

* **Task 1: Input Validation & Sanitization:**
    * **Assessment:** Are all user inputs (from forms, APIs, databases, etc.) validated on *all* sides (client-side, server-side, database)?  Is input sanitized to remove or neutralize potentially malicious characters?
    * **Mitigation:** Implement robust input validation using whitelists (allowing only known good characters) rather than blacklists (trying to block bad characters – blacklists are easily bypassed).  Use parameterized queries or prepared statements to prevent SQL injection. Use appropriate encoding for HTML, JavaScript, and other contexts.
    * **Monitoring:** Implement monitoring for unusual input patterns, excessive error rates, or unexpected SQL queries.
* **Task 2:  Stored Injection Checks:**  Specifically look for vulnerabilities where user-supplied data is stored in a database and then later retrieved and executed (e.g., stored procedures, dynamic SQL).  Review database schema and query construction.
* **Task 3:  Command Injection Checks:**  Any code that executes operating system commands based on user input is a high risk.  Avoid this entirely if possible. If unavoidable, use carefully controlled execution environments and strict input validation.


**II. Broken Authentication**

* **Task 1: Password Storage:**
    * **Assessment:** Are passwords stored securely using strong hashing algorithms (e.g., Argon2, bcrypt) with salting?  Is weak password detection implemented?
    * **Mitigation:** Enforce strong password policies (minimum length, complexity). Use a key derivation function (KDF) to generate salts.  Never store passwords in plain text.
* **Task 2: Session Management:**
    * **Assessment:** Are sessions secured with strong, random session IDs? Are session timeouts implemented? Is session fixation prevented? Are sessions invalidated on logout?
    * **Mitigation:** Use secure cookies (HttpOnly, Secure) to prevent XSS and session hijacking. Implement robust session management mechanisms.
* **Task 3: Multi-Factor Authentication (MFA):**  Implement MFA where feasible, especially for sensitive accounts and systems.
* **Task 4: Account Lockout Policies:** Implement lockout after multiple failed login attempts.


**III. Sensitive Data Exposure**

* **Task 1: Data Classification:**  Identify and classify all sensitive data (PII, financial data, trade secrets) held by the application.
* **Task 2: Data Encryption:**
    * **Assessment:** Is sensitive data encrypted at rest (in databases, storage) and in transit (using TLS/SSL)?  Are appropriate key management practices in place?
    * **Mitigation:**  Use strong encryption algorithms.  Manage encryption keys securely – avoid storing them in code.
* **Task 3: Data Masking/Tokenization:**  Consider masking or tokenizing sensitive data when it's not needed in its entirety (e.g., in reports or testing environments).
* **Task 4: Access Control:** Implement granular access controls to restrict access to
