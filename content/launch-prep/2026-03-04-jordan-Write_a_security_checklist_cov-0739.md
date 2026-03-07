# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T07:39:06.662719

## OWASP Top 10 Security Checklist - Comprehensive Review

This checklist covers the key vulnerabilities identified in the OWASP Top 10. It's designed to be used as a starting point for security assessments, penetration testing, and vulnerability scanning. **Remember, this is a high-level checklist.  Each item requires deeper investigation and tailoring to your specific application and environment.**

**I. Injection (A - 12.6% of vulnerabilities)**

* **SQL Injection:**
    * [ ] Are user inputs validated and sanitized before being used in SQL queries? (Use parameterized queries or ORMs)
    * [ ] Are stored procedures used to limit direct user input into SQL queries?
    * [ ] Are database user accounts restricted with minimal privileges?
    * [ ] Are database logging and monitoring enabled to detect suspicious activity?
* **Command Injection:**
    * [ ] Are user inputs validated and sanitized before being used in system commands? (Avoid using shell commands with user-supplied data)
    * [ ] Are there alternative, safer methods to achieve the same functionality?
    * [ ] Are system command execution logs monitored for malicious commands?
* **LDAP Injection:**
    * [ ]  Similar to SQL Injection - validate and sanitize user inputs before using them in LDAP queries.
    * [ ] Utilize parameterized queries or prepared statements.


**II. Broken Authentication (B - 13.9% of vulnerabilities)**

* **Weak Passwords:**
    * [ ]  Enforce strong password policies (minimum length, complexity requirements, etc.).
    * [ ]  Use a password complexity checker.
    * [ ]  Don’t store passwords in plain text – use a strong hashing algorithm (bcrypt, Argon2) with salting.
* **Session Management:**
    * [ ]  Use secure session identifiers (long, random, unpredictable).
    * [ ]  Implement session timeout mechanisms.
    * [ ]  Securely regenerate session identifiers after login.
    * [ ]  Protect session cookies (HTTPOnly, Secure flags).
* **Multi-Factor Authentication (MFA):**
    * [ ]  Implement MFA where possible, especially for sensitive accounts.
* **Brute-Force Protection:**
    * [ ]  Implement rate limiting on login attempts.
    * [ ]  Employ CAPTCHA challenges for suspicious login attempts.



**III. Sensitive Data Exposure (C - 13.2% of vulnerabilities)**

* **Insecure Storage:**
    * [ ]  Encrypt sensitive data both in transit (HTTPS) and at rest.
    * [ ]  Use strong encryption algorithms (AES-256 or higher).
    * [ ]  Restrict access to sensitive data based on the principle of least privilege.
    * [ ]  Regularly review and remove unnecessary sensitive data.
* **Verbose Error Messages:**
    * [ ]  Avoid displaying detailed error messages to users that could reveal information about the application’s internals.  Implement generic error handling.
* **Data Leakage via Logs:**
    * [ ]  Review application logs for sensitive data being unintentionally exposed.
    * [ ]  Implement log filtering and redaction mechanisms.



**IV. XML External Entities (XXE) (D - 8.8% of vulnerabilities)**

* [ ]  Disable or properly configure XML parsers to prevent XXE vulnerabilities.
* [ ]  Validate XML input rigorously.
* [ ]  Avoid using external XML entities altogether.  If needed, restrict their usage.


**V. Broken Access Control (E - 8.6% of vulnerabilities)**

* **Insufficient Access Checks:**
    * [ ]  Verify that users only have access to the resources they are authorized to use.
    * [ ]  Implement robust access control
