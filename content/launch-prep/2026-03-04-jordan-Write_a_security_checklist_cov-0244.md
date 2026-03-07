# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T02:44:31.599637

## OWASP Top 10 Security Checklist - Comprehensive Review

This checklist covers the core vulnerabilities identified in the OWASP Top 10 (as of late 2023). It's designed to be used as a starting point for security assessments and should be tailored to your specific application and environment.  **This is not a comprehensive security solution; it's a starting point for building a robust security posture.**

**I. Injection (A - 10% of Vulnerabilities)**

* **SQL Injection:**
    * [ ] Input validation on all user-supplied data (client-side and server-side).
    * [ ] Use parameterized queries or prepared statements to separate code from data.
    * [ ] Employ an Object-Relational Mapper (ORM) that supports escaping and parameterization.
    * [ ] Regularly test for SQL injection vulnerabilities using automated scanners.
    * [ ] Least privilege principle - database users should only have the necessary permissions.
* **Command Injection:**
    * [ ] Avoid constructing commands dynamically based on user input.
    * [ ] Use safe libraries/functions designed for interacting with the OS.
    * [ ] If dynamic command construction is necessary, use input validation and escaping thoroughly.
    * [ ] Implement a whitelist approach, allowing only known and safe commands.
* **LDAP Injection:**
    * [ ] Treat LDAP queries as potentially malicious.
    * [ ] Validate and sanitize all user-provided input before inclusion in LDAP queries.
    * [ ] Use parameterized queries or prepared statements specifically designed for LDAP.
* **No Injection Testing - General:**
    * [ ] Conduct regular penetration testing and security audits focusing on injection vulnerabilities.


**II. Broken Authentication (B - 14% of Vulnerabilities)**

* **Weak Passwords:**
    * [ ] Enforce strong password policies (minimum length, complexity, character types).
    * [ ] Implement password strength estimation and feedback.
    * [ ] Consider multi-factor authentication (MFA) for all users, especially privileged accounts.
* **Session Management:**
    * [ ] Use secure cookies (HTTPOnly, Secure, SameSite).
    * [ ] Implement proper session expiration and invalidation.
    * [ ] Avoid storing sensitive information in cookies.
    * [ ] Use strong session identifiers (long, random strings).
    * [ ] Regularly regenerate session IDs.
* **Broken Credentials:**
    * [ ] Monitor for compromised credentials through brute-force attempts and password reuse.
    * [ ] Implement account lockout policies after failed login attempts.
    * [ ] Utilize rate limiting to prevent credential stuffing attacks.
* **Insecure Storage of Credentials:**
    * [ ] Never store passwords in plaintext.  Use strong hashing algorithms (e.g., bcrypt, Argon2) with salts.
    * [ ] Rotate encryption keys regularly.


**III. Sensitive Data Exposure (C - 13% of Vulnerabilities)**

* **Data in Transit:**
    * [ ] Use HTTPS for all data transmissions (SSL/TLS).
    * [ ] Enforce strong cipher suites and protocols.
    * [ ] Implement HSTS (HTTP Strict Transport Security) to prevent downgrade attacks.
* **Data at Rest:**
    * [ ] Encrypt sensitive data in databases, files, and backups.
    * [ ] Implement access control mechanisms to restrict access to sensitive data.
    * [ ] Regularly review and update encryption keys.
* **Verbose Error Messages:**
    * [ ] Avoid displaying detailed error messages to end-users – they can reveal sensitive information.
    * [ ] Use generic error messages and log detailed errors securely.
* **Unsecured API Keys/Secrets:**
    * [ ] Never commit API keys or secrets to version control.
