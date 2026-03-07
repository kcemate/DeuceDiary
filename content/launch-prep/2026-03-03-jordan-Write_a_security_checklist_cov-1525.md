# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T15:25:16.657137

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed for developers, security teams, and anyone involved in building and maintaining web applications. This checklist is a starting point; you'll need to tailor it to your specific application and environment.

**OWASP Top 10 Security Checklist**

**I. Injection (All)**

*   **[ ] Input Validation Everywhere:**
    *   **Blacklisting:** Avoid blacklisting (generally ineffective).
    *   **Whitelisting:** Define and enforce *exactly* what is allowed.  Treat all input as potentially malicious.
    *   **Data Type Validation:** Ensure inputs are the correct data type (e.g., integer, email, date).
    *   **Length Restrictions:**  Set maximum lengths for all inputs.
    *   **Format Validation:** Validate formats against expected patterns (e.g., regular expressions for email, URL).
*   **[ ] Parameterized Queries/Prepared Statements:** *Always* use parameterized queries or prepared statements to prevent SQL injection.  Never concatenate user input directly into SQL queries.
*   **[ ] NoSQL Injection Prevention:** Employ parameterized queries or ORM features that handle escaping/sanitization for NoSQL databases like MongoDB or Cassandra.
*   **[ ] Command Injection Prevention:**  Avoid using `exec()` or similar functions with user-supplied data. If unavoidable, rigorously sanitize and validate the input.  Consider using safer alternatives like a dedicated command execution library.
*   **[ ] XML External Entity (XXE) Injection Prevention:** Disable external entity resolution in XML parsers or use a robust XML parsing library with features to mitigate XXE vulnerabilities.
*   **[ ] LDAP Injection Prevention:**  Similar to SQL injection, use parameterized queries and proper escaping mechanisms for LDAP queries.



**II. Broken Authentication (Top)**

*   **[ ] Strong Password Policies:** Enforce complex password requirements (length, characters, etc.).
*   **[ ] Multi-Factor Authentication (MFA):** Implement MFA wherever possible, especially for privileged accounts.
*   **[ ] Secure Session Management:**
    *   **Session IDs:** Use strong, unpredictable, and long session IDs.
    *   **Session Timeout:** Set appropriate session timeouts.
    *   **HTTPOnly and Secure Flags:**  Set the `HTTPOnly` flag on session cookies to prevent JavaScript access and the `Secure` flag to ensure transmission over HTTPS.
*   **[ ] Rate Limiting:** Implement rate limiting on login attempts to prevent brute-force attacks.
*   **[ ] Account Lockout:**  Lock accounts after multiple failed login attempts.
*   **[ ] Password Reset Mechanisms:** Implement secure password reset flows (e.g., using unique, time-limited tokens).  Avoid predictable reset flows.
*   **[ ] Disable Default Accounts:**  Remove or disable default accounts with known credentials.



**III. Sensitive Data Exposure (Top)**

*   **[ ] Data Classification:**  Identify and categorize sensitive data (PII, financial data, etc.).
*   **[ ] Encryption at Rest:** Encrypt sensitive data stored in databases, filesystems, and backups. Use strong encryption algorithms.
*   **[ ] Encryption in Transit:** Use HTTPS (TLS/SSL) for all data transmitted over the network.  Ensure certificates are valid and properly configured.
*   **[ ] Tokenization/Masking:**  Use tokenization or masking to protect sensitive data in logs, databases, and user interfaces.
*   **[ ] Secure File Storage:** Protect sensitive files (e.g., configuration files) with appropriate access controls and encryption.
*   **[ ] Logging & Monitoring:**  Implement comprehensive logging and monitoring to detect and respond to data breaches.  Carefully control what is logged – avoid logging
