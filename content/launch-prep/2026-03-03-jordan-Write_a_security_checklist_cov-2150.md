# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T21:50:04.108770

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable to various applications and environments.  It’s broken down by vulnerability, with specific checks and recommendations.

**Important Disclaimer:** This checklist is a starting point.  The level of detail and specific checks required will vary depending on your application's complexity, risk tolerance, and regulatory requirements.  Regular penetration testing and vulnerability scanning are *crucial* for ongoing security.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, XSS, Command, etc.)**

* **Check:**
    * **Input Validation:** Are all user inputs (including API requests, URL parameters, form data, etc.) rigorously validated and sanitized?  Use whitelisting (allowing only known good characters/patterns) whenever possible.
    * **Parameterized Queries/Prepared Statements:**  Are SQL queries built using parameterized queries or prepared statements in all database interactions? (This is the *primary* defense against SQL injection)
    * **Output Encoding:** Are all outputted values (especially those displayed to users) correctly encoded to prevent Cross-Site Scripting (XSS)?
    * **Command Injection Prevention:** Are any user-supplied data used to construct shell commands? If so, are they thoroughly validated and escaped?
    * **API Input Validation:** Is input validation applied consistently to all APIs, including external APIs?
* **Tools:** Static analysis tools, dynamic application security testing (DAST) tools, manual code review.
* **Remediation:** Implement parameterized queries, output encoding, robust input validation, use escaping libraries, implement input sanitization.

**2. Broken Authentication**

* **Check:**
    * **Strong Password Policies:** Are strong password policies enforced (minimum length, complexity, etc.)?
    * **Multi-Factor Authentication (MFA):** Is MFA implemented for all critical accounts and sensitive data access?
    * **Session Management:** Are session IDs securely generated, managed, and invalidated upon logout or inactivity? Are sessions tied to secure cookies (HttpOnly, Secure)?
    * **Brute-Force Protection:**  Are rate limiting, account lockout, and CAPTCHAs implemented to prevent brute-force attacks?
    * **Password Reset Mechanisms:**  Are password reset mechanisms secure and resistant to abuse?
* **Tools:** Security scanners, penetration testing.
* **Remediation:**  Implement MFA, robust session management, rate limiting, CAPTCHAs, strong password policies, secure password reset flows.

**3. Sensitive Data Exposure**

* **Check:**
    * **Data Classification:**  Is data classified based on sensitivity (e.g., public, internal, confidential, restricted)?
    * **Encryption:** Is sensitive data encrypted both in transit (using TLS/HTTPS) and at rest (database, storage)?
    * **Token Theft:** Are tokens (API keys, session tokens) properly secured and rotated regularly? Are they not hardcoded in the application?
    * **Exposed Secrets:** Are secrets (database passwords, API keys, etc.) not exposed in source code, configuration files, or logs?
    * **Data Masking/Redaction:**  Is sensitive data masked or redacted in non-production environments (development, testing)?
* **Tools:** Security scans, configuration audits, source code analysis.
* **Remediation:** Implement encryption (TLS, database, storage), secure token management, secure secret storage, data masking/redaction, and regular secrets rotation.

**4. XML External Entities (XXE)**

* **Check:**
    * **XML Parsing Restrictions:**  Does the application strictly restrict XML parsing to allow only trusted external entities or disable external entity processing entirely?
    * **Validation:** Are XML inputs validated to prevent malicious
