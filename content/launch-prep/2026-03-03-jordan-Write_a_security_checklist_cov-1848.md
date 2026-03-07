# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T18:48:52.001815

Okay, here’s a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be used as a starting point for your application security assessments. It's broken down by vulnerability and includes steps for detection, remediation, and verification.

**Important Disclaimer:** This checklist is a guideline. The specific items you need to focus on will vary depending on your application's architecture, technology stack, and risk tolerance.  It's not a substitute for expert security audits.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, NoSQL, OS Command, LDAP)**

* **Detection:**
    * **Static Analysis:** Look for user input used directly in database queries, shell commands, or LDAP searches without proper sanitization or parameterization.
    * **Dynamic Analysis:**  Penetration testing focused on injecting malicious payloads (SQLi, OS Command Injection, etc.)
    * **Code Review:**  Thorough review of all code handling user input.
    * **Database Logs:** Monitor database logs for suspicious queries or errors.
* **Remediation:**
    * **Parameterized Queries/Prepared Statements:**  Always use parameterized queries or prepared statements for database interactions. This is the *primary* defense.
    * **Input Validation:**  Strictly validate all user input against expected formats, data types, and lengths. White-listing is preferred over black-listing.
    * **Output Encoding:** Properly encode output to prevent the interpretation of special characters.
    * **Least Privilege:** Database users should have the minimum necessary permissions.
* **Verification:**
    * **Penetration Testing:**  Attempt to inject payloads.
    * **Manual Review:**  Verify the implementation of parameterized queries and validation rules.


**2. Broken Authentication**

* **Detection:**
    * **Weak Passwords:**  Lack of password complexity requirements, no password policies.
    * **Session Management Issues:**  Predictable session IDs, no session timeout, insecure session handling.
    * **Credential Stuffing/Brute Force:** Unprotected APIs or login forms.
    * **Multi-Factor Authentication (MFA) Absence:** Lack of MFA for sensitive accounts.
* **Remediation:**
    * **Strong Password Policies:** Enforce strong password requirements (length, complexity, rotation).
    * **Secure Session Management:** Implement secure session IDs (random, long), enforce session timeouts, and use secure cookies (HttpOnly, Secure).
    * **Rate Limiting:** Implement rate limiting on login attempts.
    * **MFA Implementation:** Implement MFA wherever possible.
    * **Account Lockout:** Implement account lockout after multiple failed attempts.
* **Verification:**
    * **Penetration Testing:** Attempt to bypass authentication mechanisms.
    * **Security Audits:** Review session management code.



**3. Sensitive Data Exposure**

* **Detection:**
    * **Unencrypted Data Storage:** Sensitive data (PII, API keys, credentials) stored in plain text.
    * **Verbose Error Messages:** Revealing sensitive information in error messages.
    * **Debug Logging:**  Debugging logs containing sensitive data.
    * **Insecure File Storage:** Sensitive data stored in unencrypted files.
* **Remediation:**
    * **Encryption:** Encrypt sensitive data at rest and in transit (TLS/SSL).
    * **Secure Logging:**  Implement secure logging practices - redact sensitive data in logs.
    * **Disable Debugging in Production:**  Disable debugging features in production environments.
    * **Secure File Storage:**  Store sensitive files in secure locations with appropriate access controls.
* **Verification:**
    * **Vulnerability Scanning:**  Look for exposed sensitive data.
    * **Code Review:**  Review all storage and logging mechanisms.
