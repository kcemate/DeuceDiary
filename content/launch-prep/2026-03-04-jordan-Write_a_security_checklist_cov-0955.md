# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T09:55:15.116125

## OWASP Top 10 Security Checklist

This checklist covers the key vulnerabilities identified in the OWASP Top 10, categorized for easier organization and implementation. It's designed as a starting point and should be tailored to your specific application and environment.

**I. Injection (A - 15% of vulnerabilities)**

* **SQL Injection:**
    * [ ] Input Validation:  Strictly validate all user inputs against expected data types and formats. Use parameterized queries or prepared statements.
    * [ ] Stored Procedures: Utilize stored procedures instead of directly constructing SQL queries.
    * [ ] Least Privilege: Grant database users only the minimum necessary permissions.
    * [ ] Escaping:  If parameterized queries are not possible, meticulously escape all user inputs. (Discouraged due to complexity and potential for errors).
* **NoSQL Injection:**
    * [ ] Input Validation:  Validate all user inputs against expected data types and formats specific to your NoSQL database.
    * [ ] Parameterized Queries:  Utilize parameterized queries with your NoSQL database driver.
    * [ ] Sanitize Data: Properly sanitize data to prevent unexpected characters from entering the database.


**II. Broken Authentication (B - 13% of vulnerabilities)**

* **Weak Passwords:**
    [ ] Password Policies: Enforce strong password policies (minimum length, complexity, etc.).
    [ ] Password Hashing:  Use strong, salted hashing algorithms (e.g., bcrypt, Argon2) for password storage.  Never store passwords in plain text.
    [ ] Multi-Factor Authentication (MFA): Implement MFA for all users, especially privileged accounts.
* **Session Management:**
    [ ] Secure Session IDs: Generate cryptographically strong session IDs.
    [ ] Session Timeout: Implement appropriate session timeouts.
    [ ] Secure Session Cookies:  Set secure and HTTPOnly flags on session cookies.
    [ ] Session Regeneration: Regenerate session IDs after authentication.
* **API Authentication:**
    [ ] OAuth 2.0 or OpenID Connect: Utilize standardized authentication protocols like OAuth 2.0 or OpenID Connect.
    [ ] JWT Validation:  Carefully validate JSON Web Tokens (JWTs) on the server-side, including the signature, expiration time, and issuer.



**III. Sensitive Data Exposure (C - 12% of vulnerabilities)**

* **Data in Transit:**
    [ ] TLS/SSL: Use TLS/SSL encryption for all communication, including web traffic and API calls.  Ensure the latest TLS version is used.
    [ ] HSTS: Implement HTTP Strict Transport Security (HSTS) to enforce HTTPS connections.
* **Data at Rest:**
    [ ] Encryption: Encrypt sensitive data at rest, both in databases and in file storage.
    [ ] Data Masking: Implement data masking or tokenization for sensitive data in non-production environments.
    [ ] Access Control:  Restrict access to sensitive data based on the principle of least privilege.
* **Logging & Monitoring:**
    [ ] Audit Logging: Implement comprehensive audit logging to track access to sensitive data.
    [ ] Data Leak Detection: Implement tools and processes for detecting and responding to data leaks.



**IV. XML External Entities (XXE) (D - 8% of vulnerabilities)**

* [ ] Disable External Entity Processing: Disable external entity processing in your XML parsers.
* [ ] Input Validation:  Strictly validate XML input to prevent malicious entities.
* [ ] Use a Secure XML Parser:  Utilize a parser with built-in protection against XXE vulnerabilities.



**V. Broken Access Control (E - 7% of vulnerabilities)**

* **Insufficient Authentication Checks:**
    [ ] Verify User Roles:  Always verify user roles and permissions before
