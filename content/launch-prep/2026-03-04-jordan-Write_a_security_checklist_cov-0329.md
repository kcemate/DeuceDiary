# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T03:29:44.092861

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable for different application types and levels of technical expertise.  It's broken down by vulnerability category with suggested checks and remediation guidance.

**Important Note:** This checklist is a starting point.  You *must* tailor it to your specific application, technology stack, and risk tolerance.  Regularly update this checklist and perform ongoing security assessments.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL Injection, Command Injection, etc.)**

* **Check:**
    * Are user inputs validated and sanitized against expected data types and formats *before* being used in database queries, system commands, or other contexts?
    * Are parameterized queries or prepared statements consistently used to prevent the interpretation of user input as code?
    * Are error messages carefully reviewed for potential information leakage?
    * Are you protecting against command injection vulnerabilities when using OS commands?
* **Remediation:**
    * **Parameterized Queries/Prepared Statements:** This is the *primary* defense.
    * **Input Validation:** Implement strict whitelisting (allow only expected values) instead of blacklisting (block specific values).
    * **Least Privilege:**  Run applications with minimal necessary privileges.
    * **Escape User Input:**  If parameterized queries aren't possible, use robust escaping mechanisms designed for your specific language and database.


**2. Broken Authentication**

* **Check:**
    * Is password storage using a strong, salted, and hashed algorithm (e.g., bcrypt, Argon2)?
    * Are authentication mechanisms resistant to brute-force and credential stuffing attacks? (Rate limiting, account lockout policies).
    * Is multi-factor authentication (MFA) enforced for sensitive accounts?
    * Are session management mechanisms secure (e.g., secure cookies, proper session timeout, session invalidation)?
    * Is proper session management done and are users redirected after login?
* **Remediation:**
    * **Strong Password Policies:** Enforce minimum length, complexity, and rotation.
    * **Rate Limiting:** Limit login attempts to prevent brute-force attacks.
    * **MFA Implementation:** Implement MFA for all critical accounts.
    * **Secure Cookies:**  Use HTTPOnly and Secure flags.
    * **Session Timeout & Invalidation:** Implement appropriate timeout periods and secure invalidation mechanisms.



**3. Sensitive Data Exposure**

* **Check:**
    * Is sensitive data (PII, financial information, API keys, etc.) properly encrypted both in transit (TLS/SSL) and at rest (database encryption, file encryption)?
    * Are sensitive data fields masked or redacted in logs, UI, and debug information?
    * Are access controls strictly enforced to limit access to sensitive data to authorized personnel only?
    * Are you monitoring for and responding to breaches of sensitive data?
* **Remediation:**
    * **Encryption:** Implement robust encryption practices.
    * **Data Masking/Redaction:** Implement in logs, UI, and development environments.
    * **Access Control:** Implement role-based access control (RBAC).
    * **Data Loss Prevention (DLP):** Utilize DLP tools to detect and prevent sensitive data leaks.


**4. XML External Entities (XXE)**

* **Check:**
    * Are XML parsers configured to disable or restrict the parsing of external entities? External entities can lead to SSRF and code execution.
    * Is your application processing XML data from untrusted sources?
* **Remediation:**
    * **Disable External Entity Parsing:**  Configure XML parsers to disable or restrict external entity processing.
    * **Input Validation & Sanitization:**  Carefully validate and sanitize all XML
