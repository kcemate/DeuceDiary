# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T12:56:43.386286

## OWASP Top 10 Security Checklist - Comprehensive Review

This checklist covers the key areas of the OWASP Top 10 vulnerabilities and provides a framework for your security assessment.  It's designed to be a starting point and should be tailored to your specific application and environment.

**Note:** This is a detailed checklist.  Not all items will apply to every application. Prioritize based on your risk tolerance and the nature of your application.

**I. Injection (A1, A2)**

* **SQL Injection:**
    * [ ] Input validation for all user-supplied data (SQL queries, stored procedures, etc.).
    * [ ] Use parameterized queries or prepared statements to prevent SQL injection.
    * [ ] Regularly review and update database schemas and stored procedures for vulnerabilities.
    * [ ] Employ a Web Application Firewall (WAF) with SQL injection rules.
    * [ ] Implement least privilege access for database users.
* **NoSQL Injection:**
    * [ ] Validate all user-supplied data used in NoSQL queries (MongoDB, Cassandra, etc.).
    * [ ] Use parameterized queries or prepared statements specific to the NoSQL database.
    * [ ] Understand the specific injection vectors for the chosen NoSQL database.

**II. Broken Authentication (A2, A3, A5)**

* **Weak Passwords:**
    * [ ] Enforce strong password policies (minimum length, complexity, regular updates).
    * [ ] Implement password salting and hashing algorithms (bcrypt, Argon2).  *Never* store passwords in plain text.
    * [ ]  Use multi-factor authentication (MFA) where feasible.
* **Session Management:**
    * [ ] Use secure session identifiers (long, random strings).
    * [ ] Implement session timeout mechanisms.
    * [ ] Regenerate session identifiers after login and sensitive actions.
    * [ ] Securely store session data (HTTPOnly, Secure cookies).
    * [ ] Properly invalidate sessions on logout and error conditions.
* **Brute Force Attacks:**
    * [ ] Implement rate limiting on login attempts.
    * [ ] Utilize CAPTCHA or other challenge-response mechanisms.
    * [ ] Monitor login attempts for suspicious activity.
* **Credential Stuffing:**
    * [ ] Monitor for known breached credentials.
    * [ ] Implement account lockout policies after multiple failed login attempts.

**III. Sensitive Data Exposure (A4, A6)**

* **Data in Transit:**
    * [ ] **HTTPS:** Enforce HTTPS for all communication.  Verify certificate validity.
    * [ ]  Use TLS 1.2 or higher.  Disable older, insecure TLS versions.
* **Data at Rest:**
    * [ ] **Encryption:** Encrypt sensitive data at rest (databases, storage).  Use strong encryption algorithms.
    * [ ] **Data Masking/Tokenization:**  Mask or tokenize sensitive data in non-production environments.
    * [ ] **Access Control:** Implement strict access control policies to limit access to sensitive data.
    * [ ] **Secure Storage:**  Store sensitive data in secure storage locations with appropriate physical and logical security controls.
* **Error Handling:**
    * [ ]  Implement robust error handling that doesn’t reveal sensitive information to users or logs.
    * [ ]  Log detailed error information to a secure location for debugging purposes (without exposing sensitive data).


**IV. XML External Entities (XXE) (B1)**

* [ ] Sanitize all XML input to prevent XXE attacks.
* [ ] Disable external entity resolution in XML parsers.
* [ ] Use a XML parser with built-in XXE protection.
* [ ] Review and update XML processing libraries.

**V.
