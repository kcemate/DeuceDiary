# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T07:07:58.639697

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and with actionable steps. This is a starting point – you'll need to adapt it to your specific application and environment.

**Important Note:** This checklist isn't a substitute for a full security assessment. It's designed to prompt you to think critically about security and guide your remediation efforts.

---

**I. Injection (Critical)**

* **Description:** Exploiting vulnerabilities where user-supplied data is used to construct SQL queries, OS commands, or other code.
* **Checklist Items:**
    * **SQL Injection:**
        * [ ] Input Validation: Are all user inputs validated against expected data types and formats? (Whitelist approach is preferred)
        * [ ] Parameterized Queries/Prepared Statements: Are you consistently using parameterized queries/prepared statements to prevent the interpretation of user input as code?
        * [ ] Stored Procedures: Are stored procedures used properly and parameterized?
        * [ ] Least Privilege: Does the database user account used by the application have only the necessary permissions?
    * **Command Injection:**
        [ ] Input Validation: Are all user inputs validated to prevent potentially malicious commands?
        [ ] Escaping: Is output properly escaped to prevent commands from being interpreted by the OS?
        [ ] Avoid Executing External Commands: Can you eliminate the need to execute external commands entirely?
    * **NoSQL Injection:** (If applicable – JSON APIs, NoSQL databases)
        [ ] Input Validation: Are user-provided values validated against the expected data types and formats?
        [ ] Parameterized Queries:  Are parameterized queries used to pass data safely to the NoSQL database?


**II. Broken Authentication (Critical)**

* **Description:** Weaknesses in authentication and session management, allowing attackers to impersonate users.
* **Checklist Items:**
    * **Strong Passwords:**
        [ ] Password Policies: Do you enforce strong password policies (minimum length, complexity, etc.)?
        [ ] Password Hashing: Are passwords securely hashed (using bcrypt, Argon2, or similar) with a strong salt? *Never store passwords in plain text.*
    * **Multi-Factor Authentication (MFA):**
        [ ] MFA Implementation: Is MFA implemented for all critical accounts, especially admin accounts?
    * **Session Management:**
        [ ] Secure Session IDs: Are session IDs randomly generated and sufficiently long?
        [ ] Session Timeout: Are sessions automatically timed out after a period of inactivity?
        [ ] Secure Session Storage: Are session data stored securely (e.g., HTTPOnly, Secure flags set)?
        [ ] Session Fixation Prevention: Are you protecting against session fixation attacks?
        [ ]  Logout Functionality: Is a reliable logout mechanism available that invalidates all session data?


**III. Sensitive Data Exposure (High)**

* **Description:**  Failure to properly protect sensitive information (credentials, PII, etc.) at rest and in transit.
* **Checklist Items:**
    * **Data Classification:** Have you identified and classified the types of sensitive data you handle?
    * **Encryption at Rest:** Is sensitive data encrypted at rest (e.g., using database encryption, file encryption)?
    * **Encryption in Transit:** Is all data transmitted between the client and server encrypted using TLS/SSL (HTTPS)?  Ensure correct certificate configuration.
    * **Data Masking/Tokenization:** Are sensitive data masked or tokenized when displayed or stored in non-production environments?
    * **Logging:** Are access logs monitored for suspicious activity?  Ensure logs don't capture sensitive data unnecessarily.


**IV. XML External Entities (XXE) (High)**

* **Description:** Exploiting vulnerabilities in XML parsers
