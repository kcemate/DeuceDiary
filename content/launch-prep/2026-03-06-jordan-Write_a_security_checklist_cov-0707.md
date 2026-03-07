# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-06T07:07:06.826074

## OWASP Top 10 Security Checklist - Comprehensive Review

This checklist covers the OWASP Top 10 vulnerabilities. It’s designed to be a starting point for security assessments. Adjust it based on your application’s specific technology stack and risk profile.

**Frequency:**  This checklist should be reviewed and executed regularly (e.g., quarterly for a comprehensive review, monthly for specific areas).

**Sections:** Each vulnerability is broken down into checks, with severity levels (High, Medium, Low) indicating potential impact.

---

**1. Injection (High - Critical)**

* **Check:**  Are all user inputs validated and sanitized *before* being used in database queries, system commands, or external API calls?
* **Check:** Are parameterized queries or prepared statements used to prevent SQL injection?
* **Check:** Are data type checks enforced for all user inputs to prevent type confusion attacks?
* **Check:** Are system calls secured to prevent command injection?
* **Tools:** Static analysis tools, dynamic application security testing (DAST), manual code review.

**2. Broken Authentication (High - Critical)**

* **Check:**  Is strong password policy enforced (length, complexity, rotation)?
* **Check:**  Is Multi-Factor Authentication (MFA) implemented for all sensitive accounts?
* **Check:**  Is session management secure (HTTPOnly, Secure flags, session timeout, regeneration)?
* **Check:**  Are authentication tokens securely stored and handled (JWT validation, expiration)?
* **Check:**  Is there proper account lockout after multiple failed login attempts?
* **Check:**  Are default credentials checked and changed immediately?
* **Tools:**  Security scanners, penetration testing, vulnerability assessments.


**3. Sensitive Data Exposure (High - Critical)**

* **Check:**  Is all sensitive data (PII, financial data, credentials) encrypted at rest and in transit? (Use TLS/SSL for transmission)
* **Check:**  Are secrets (API keys, database passwords) stored securely using a secrets management solution (Vault, AWS Secrets Manager, Azure Key Vault)? *Never* hardcode secrets in code.
* **Check:**  Are sensitive data fields masked or redacted in logs, debug information, and error messages?
* **Check:**  Are data retention policies defined and enforced to minimize the storage of sensitive data?
* **Tools:**  Secrets management tools, static analysis, runtime application self-protection (RASP).

**4. XML External Entities (XXE) (Medium - Critical)**

* **Check:**  Is XML parsing disabled or restricted to trusted sources?  *Never* allow the parsing of external entities.
* **Check:**  Is proper input validation and sanitization performed on XML data?
* **Check:**  Are XML libraries regularly updated to address known vulnerabilities?
* **Tools:**  Static analysis, DAST, manual code review.


**5. Broken Access Control (High - Critical)**

* **Check:**  Are access control mechanisms correctly implemented and enforced for all API endpoints and resources? (Role-Based Access Control – RBAC)
* **Check:**  Is Cross-Site Scripting (XSS) prevented using proper input validation and output encoding? (Related to Access Control - Improper authorization can lead to XSS)
* **Check:**  Are user privileges appropriately managed (least privilege principle)?
* **Check:**  Are there safeguards to prevent horizontal privilege escalation?
* **Tools:**  Penetration testing, access control assessments, security code reviews.

**6. Security Misconfiguration (High - Critical)**

* **Check:**  Are default configurations changed for all software and services?
* **Check:**  Are unnecessary services and ports disabled?
* **Check:**  Are application directories and files protected from public access?
* **Check:**
