# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T05:45:45.448378

Okay, here’s a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be used as a starting point for your application security assessments. It’s broken down by vulnerability, with considerations for different levels of effort and potential mitigation strategies.

**Important Note:** This is a *checklist*, not a substitute for a thorough security assessment conducted by qualified professionals. Adapt this checklist to your specific application, environment, and risk tolerance.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, Command, LDAP)**

* **Risk Level:** High
* **Description:** Vulnerabilities where attackers can inject malicious code (SQL, shell commands, LDAP queries) into an application’s data flow.
* **Checklist Items:**
    * [ ] **Input Validation:** Are all user inputs (forms, API requests, URLs, file uploads) rigorously validated for expected data types, lengths, and formats *before* being used in any database queries, command execution, or LDAP operations?
    * [ ] **Parameterized Queries/Prepared Statements:** Are database queries and LDAP operations consistently using parameterized queries or prepared statements to prevent the interpretation of user input as code?
    * [ ] **Stored Procedures:** Are stored procedures used instead of direct queries whenever possible, and are they properly parameterized?
    * [ ] **Escaping:** Are proper escaping mechanisms in place for all user-controlled data when using string concatenation or other methods to construct queries? (Note: Escaping alone isn't sufficient - parameterized queries are preferred.)
    * [ ] **Least Privilege:** Do database users and application processes have the minimum necessary privileges required for their functions?
* **Effort:** Medium - High (depending on code refactoring)
* **Mitigation:** Parameterized queries, input validation, principle of least privilege.


**2. Broken Authentication**

* **Risk Level:** Critical
* **Description:** Vulnerabilities related to weak or missing authentication mechanisms, allowing attackers to impersonate users.
* **Checklist Items:**
    [ ] **Strong Password Policies:** Are strong password policies enforced (length, complexity, change frequency)?
    [ ] **Multi-Factor Authentication (MFA):** Is MFA implemented for sensitive accounts and operations?
    [ ] **Session Management:** Are session IDs securely generated and managed (using strong random values, HttpOnly, Secure flags)?
    [ ] **Rate Limiting:** Are requests limited to prevent brute-force attacks?
    [ ] **Account Lockout:** Is there an account lockout mechanism after multiple failed login attempts?
    [ ] **Authentication Protocol:** Are modern authentication protocols (OAuth 2.0, OpenID Connect) used where appropriate?  Avoid older protocols like basic authentication without TLS.
    [ ] **Proper Logout:** Does the application have a robust logout function that invalidates session data across all channels?
* **Effort:** Low - Medium (depending on existing systems)
* **Mitigation:** MFA, secure session management, rate limiting, strong authentication protocols.


**3. Sensitive Data Exposure**

* **Risk Level:** High
* **Description:** Vulnerabilities where sensitive data (credentials, personal information, API keys) is exposed or mishandled.
* **Checklist Items:**
    [ ] **Data Classification:** Is sensitive data properly classified (e.g., Confidential, Restricted, Public)?
    [ ] **Encryption in Transit:** Is all sensitive data transmitted over the network encrypted using TLS/SSL? (Verify proper certificate configuration)
    [ ] **Encryption at Rest:** Is sensitive data stored securely, with encryption at rest (database encryption, file encryption)?
    [ ] **Key Management:** Are encryption keys stored and managed securely (using a Hardware Security Module - HSM or similar)?
    [ ] **Data Masking/Redaction:** Is sensitive data masked or
