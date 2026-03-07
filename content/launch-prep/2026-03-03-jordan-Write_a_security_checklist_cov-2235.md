# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T22:35:25.427757

## OWASP Top 10 Security Checklist

This checklist covers the vulnerabilities identified in the OWASP Top 10, 2021. It’s designed to help you systematically assess your application’s security posture.  Adapt it to your specific application, technology stack, and risk tolerance.

**Frequency:** This checklist should be reviewed and updated regularly (at least annually), and after any significant code changes or infrastructure updates.

**Sections:**

1. **Injection**
2. **Broken Authentication**
3. **Sensitive Data Exposure**
4. **XML External Entities (XXE)**
5. **Broken Access Control**
6. **Security Misconfiguration**
7. **Vulnerable and Outdated Components**
8. **Insufficient Logging & Monitoring**
9. **Server-Side Request Forgery (SSRF)**
10. **Rate Limiting**


---

**1. Injection**

* **☐  Input Validation:**  All user input (including form data, URL parameters, API requests, etc.) must be rigorously validated on both the client-side (as a first line of defense) and the server-side (critical).  Implement whitelisting (allow only known safe characters) rather than blacklisting.
* **☐  Parameterized Queries/Prepared Statements:**  Utilize parameterized queries or prepared statements in all database interactions to prevent SQL injection.
* **☐  Encoding Output:**  Encode all output before displaying it to the user to prevent Cross-Site Scripting (XSS) injection.
* **☐  Command Injection Prevention:**  Avoid using user input directly in system commands. If unavoidable, use robust escaping and consider alternative, safer approaches.


**2. Broken Authentication**

* **☐  Strong Password Policies:** Enforce strong password policies (length, complexity, expiration) and encourage multi-factor authentication (MFA).
* **☐  Unique Passwords:**  Ensure each user has a unique password.
* **☐  Secure Password Storage:**  Store passwords using strong hashing algorithms (e.g., Argon2, bcrypt) with proper salting.  Never store passwords in plaintext.
* **☐  Session Management:** Implement secure session management techniques:
    *  Use strong session IDs.
    *  Set appropriate session expiration times.
    *  Invalidate sessions upon logout.
    *  Protect against session fixation attacks.
* **☐  Multi-Factor Authentication (MFA):**  Implement MFA where possible.
* **☐  Account Lockout:**  Implement account lockout mechanisms after multiple failed login attempts.



**3. Sensitive Data Exposure**

* **☐  Data Classification:**  Identify and categorize sensitive data (PII, financial information, etc.).
* **☐  Encryption at Rest:** Encrypt sensitive data stored in databases, files, and backups.
* **☐  Encryption in Transit:** Use HTTPS (TLS/SSL) for all communication involving sensitive data.  Verify SSL/TLS certificates.
* **☐  Data Masking/Tokenization:** Employ data masking or tokenization techniques for non-production environments.
* **☐  Secure Data Storage:**  Store sensitive data in secure locations with restricted access.
* **☐  Regular Data Audits:** Conduct regular audits to identify and address data exposure risks.



**4. XML External Entities (XXE)**

* **☐  Disable External Entity Resolution:**  Disable the processing of external entity resolution in XML parsers. This prevents attackers from potentially accessing local files or remote resources.  Configure your XML parser to treat external entities as data, not URIs.
* **☐  Validate XML Input:**  Validate XML input against a well-defined schema to prevent malformed XML from exploiting vulnerabilities.


**5. Broken Access Control**

* **☐  Authentication & Authorization Separation:**  Clearly separate authentication (
