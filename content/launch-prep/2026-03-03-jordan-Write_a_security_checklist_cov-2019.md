# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T20:19:28.982052

## OWASP Top 10 Security Checklist

This checklist covers the top 10 web application security risks as identified by OWASP (Open Web Application Security Project). It’s designed to be a starting point for assessing and improving the security posture of your web applications.  **This is not exhaustive and should be tailored to your specific application and environment.**

**Frequency:** This checklist should be reviewed and updated regularly (at least annually) and triggered after any significant changes to the application or infrastructure.

**Sections:**

* **A. Injection**
* **B. Broken Authentication**
* **C. Sensitive Data Exposure**
* **D. XML External Entities (XXE)**
* **E. Broken Access Control**
* **F. Security Misconfiguration**
* **G. Cross-Site Scripting (XSS)**
* **H. Insecure Deserialization**
* **I. Using Components with Known Vulnerabilities**
* **J. Insufficient Logging & Monitoring**


---

**A. Injection (Risk Level: High)**

* **☐ Code Review:** Review all code for dynamic data insertion into database queries, shell commands, or other contexts without proper validation and sanitization.
* **☐ Parameterized Queries/Prepared Statements:** Are parameterized queries or prepared statements consistently used for all database interactions?
* **☐ Input Validation:** Are *all* user inputs rigorously validated on both the client-side and server-side? Validation rules should include:
    * **Whitelist:** Prefer listing approved characters/patterns.
    * **Blacklist:** Avoid relying solely on blacklists (less effective).
* **☐ Output Encoding:** Is output properly encoded to prevent interpretation as code in the context where it’s being displayed?


**B. Broken Authentication (Risk Level: Critical)**

* **☐ Strong Password Policies:** Are strong password policies enforced (length, complexity, expiration)?
* **☐ Multi-Factor Authentication (MFA):** Is MFA implemented for all user accounts, especially privileged ones?
* **☐ Secure Session Management:** Are session IDs securely generated, transmitted, and invalidated upon logout or inactivity?
* **☐ Rate Limiting:** Are login attempts rate-limited to prevent brute-force attacks?
* **☐ Password Reset Mechanisms:** Are password reset mechanisms secure, preventing abuse?
* **☐ OAuth/OIDC Implementation:** Are OAuth and OpenID Connect implemented securely and following best practices (e.g., proper authorization and scope validation)?


**C. Sensitive Data Exposure (Risk Level: Critical)**

* **☐ Data Classification:**  Is data classified based on sensitivity (e.g., public, confidential, restricted)?
* **☐ Data Encryption:** Is sensitive data encrypted both in transit (TLS/SSL) and at rest (database encryption)?
* **☐ Secure Storage:** Is sensitive data stored securely (e.g., using key management systems)?
* **☐ Data Masking/Redaction:** Is sensitive data masked or redacted when displayed to non-authorized users?
* **☐ Access Control:** Are access controls implemented to restrict access to sensitive data based on the principle of least privilege?


**D. XML External Entities (XXE) (Risk Level: Medium)**

* **☐ Disable External Entities:** Are external entity processing capabilities disabled in XML parsers? This is the most effective mitigation.
* **☐ Validate XML:**  Are XML inputs validated to ensure they conform to a defined schema and do not contain malicious entities.


**E. Broken Access Control (Risk Level: High)**

* **☐ Authorization Checks:** Are authorization checks consistently performed for all sensitive operations?
* **☐ Role-Based Access Control (RBAC):** Is RBAC implemented to manage user permissions?
* **☐ Access Control Lists (ACLs):** Are ACLs properly configured to restrict access to resources?
* **☐ Session
