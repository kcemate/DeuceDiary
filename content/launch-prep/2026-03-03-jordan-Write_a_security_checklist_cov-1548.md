# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T15:48:03.057675

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable for different types of applications and organizations. It's broken down by vulnerability category and includes considerations for testing, remediation, and ongoing monitoring.

**Important Disclaimer:** This checklist is a starting point.  A thorough security assessment requires a deep understanding of your specific application, infrastructure, and business risks.  Consider engaging a security professional for a formal penetration test and risk assessment.

**I. Injection (32% of Vulnerabilities)**

* **Checklist Items:**
    * **Input Validation:** Are all user inputs (forms, URLs, API parameters, cookies, headers) rigorously validated *on both the client-side and server-side*?
        * **Type Checking:**  Are data types enforced (e.g., integers, strings, email addresses)?
        * **Length Restrictions:** Are maximum lengths enforced to prevent buffer overflows?
        * **Character Filtering:**  Are harmful characters (e.g., SQL keywords, HTML tags) stripped out?
        * **Whitelisting:**  Prefer using whitelists (allowing only known good input) over blacklists (blocking known bad input).
    * **Parameterized Queries/Prepared Statements:** Are database queries using parameterized queries or prepared statements *always*? (Essential for SQL Injection prevention)
    * **Stored Procedures:** Are stored procedures used where appropriate to abstract data access and reduce direct SQL query writing?
    * **Escaping:**  If parameterized queries aren’t possible, are all output values properly escaped for the specific context (e.g., HTML escaping)?
    * **CMS/Framework Vulnerabilities:**  Ensure your CMS (WordPress, Drupal, etc.) and frameworks are up-to-date with security patches, as they are often a target for injection attacks.
* **Testing:**  Manual testing with malicious input, automated fuzzing tools.
* **Remediation:** Implement robust input validation and parameterized queries.

**II. Broken Authentication (29% of Vulnerabilities)**

* **Checklist Items:**
    * **Strong Passwords:** Enforce strong password policies (minimum length, complexity, regular changes).
    * **Multi-Factor Authentication (MFA):** Implement MFA for all user accounts, especially administrative accounts.
    * **Session Management:**
        * **Secure Cookies:** Use HTTPOnly and Secure flags on session cookies.
        * **Session Timeout:** Implement appropriate session timeouts.
        * **Session Regeneration:** Regenerate session IDs after login and sensitive operations.
    * **Rate Limiting:** Implement rate limiting to prevent brute-force attacks.
    * **Account Lockout:** Implement account lockout after multiple failed login attempts.
    * **Authentication Protocol Security:** Are you using secure authentication protocols (OAuth 2.0, OpenID Connect) correctly?  Verify appropriate authorization flows.
* **Testing:**  Brute-force testing, credential stuffing attacks, session hijacking attempts.
* **Remediation:** Strengthen authentication mechanisms, implement MFA, improve session management practices.


**III. Sensitive Data Exposure (23% of Vulnerabilities)**

* **Checklist Items:**
    * **Data Classification:**  Identify sensitive data (PII, financial information, health records) and classify it based on sensitivity.
    * **Encryption:**
        * **Data at Rest:** Encrypt sensitive data stored in databases, file systems, and backups.
        * **Data in Transit:** Use HTTPS (TLS/SSL) for all communication channels.
    * **Token Storage:** Securely store and manage API keys, passwords, and other credentials – *never* hardcode them. Use secrets management solutions.
    * **Data Masking/Redaction:** Mask or redact sensitive data in non-production environments.
    * **Logging and
