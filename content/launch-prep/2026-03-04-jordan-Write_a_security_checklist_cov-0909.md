# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T09:09:43.857760

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to help you assess your web application's security posture. This is a starting point, and you'll need to adapt it to your specific application, technologies, and risk tolerance.

**OWASP Top 10 Security Checklist**

**I. Injection (All Versions)**

* **[ ] Input Validation:**  Are all user inputs (including those from forms, URLs, cookies, headers) rigorously validated *on both the client-side and, critically, the server-side*?
    * **Specific Checks:** Validate data types, lengths, formats, and character ranges.  Use whitelisting (allowing known good values) rather than blacklisting (blocking known bad values – blacklists are easily bypassed).
* **[ ] Parameterized Queries/Prepared Statements:**  Are you using parameterized queries or prepared statements for all database interactions? (This prevents SQL injection.)
* **[ ] Escaping/Encoding:** If parameterized queries aren't feasible, are you properly escaping all data before including it in SQL queries or other potentially vulnerable contexts (e.g., command-line arguments)? (Less secure than parameterized queries, but better than unescaped data).
* **[ ] Stored Procedures:** Are stored procedures used instead of dynamic SQL where appropriate?  (Stored procedures, when properly designed and used with parameters, can mitigate injection risks).


**II. Broken Authentication (Critical)**

* **[ ] Strong Password Policies:** Are strong password policies enforced (minimum length, complexity requirements, etc.)?
* **[ ] Multi-Factor Authentication (MFA):** Is MFA implemented for all user accounts, particularly privileged accounts?
* **[ ] Account Lockout:** Is there an account lockout mechanism after multiple failed login attempts?
* **[ ] Session Management:**
    * **[ ] Secure Session IDs:** Are session IDs generated securely (e.g., cryptographically random)?
    * **[ ] Session Expiration:** Are sessions timed out after periods of inactivity?
    * **[ ] Session Fixation Protection:** Are you protecting against session fixation attacks (e.g., using the `Session_Regenerate` HTTP header)?
    * **[ ] Session Hijacking Prevention:**  Are you protecting against session hijacking through techniques like HTTPOnly cookies and secure connections?
* **[ ] Password Reset Mechanisms:**  Are password reset mechanisms secure and resistant to abuse (e.g., using unique, time-limited tokens)?


**III. Sensitive Data Exposure (High)**

* **[ ] Data Classification:** Have you classified the sensitivity of the data you handle?
* **[ ] Data Minimization:** Are you collecting and storing only the data that's absolutely necessary?
* **[ ] Encryption at Rest:** Is sensitive data encrypted when stored (e.g., database, file storage)?  Use strong encryption algorithms.
* **[ ] Encryption in Transit:**  Is all communication between the client and server encrypted using HTTPS (TLS)?  Verify proper certificate configuration.
* **[ ] Secure Storage of Credentials:**  Are credentials (passwords, API keys, etc.) stored securely (e.g., using a secrets management system, not in code or configuration files)?
* **[ ] Masking/Redaction:**  Are sensitive data fields masked or redacted when displayed in logs, UI elements, or reports?



**IV. XML External Entities (XXE) (High)**

* **[ ] Disable XXE:**  Have you disabled the processing of external entities in your XML parsers? (This is the most effective mitigation).
* **[ ] Input Validation:** If disabling XXE is not possible, rigorously validate XML input to prevent external entity references.
* **[ ] Namespace Handling:** Ensure proper namespace handling to prevent unintended external entity references.
