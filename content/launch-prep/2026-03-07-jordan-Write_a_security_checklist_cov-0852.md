# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T08:52:17.407491

## OWASP Top 10 Security Checklist - Comprehensive

This checklist is designed to help you assess your application’s security posture against the OWASP Top 10 vulnerabilities. It’s a starting point and should be tailored to your specific application, technology stack, and risk tolerance.  Each section includes key areas to investigate and potential mitigation strategies.

**Note:** This is a high-level checklist.  Each item should be investigated in detail with appropriate testing and documentation.

**I. Injection (34%)**

* **Goal:** Prevent attackers from inserting malicious code into your application.
* **Checklist Items:**
    * [ ] **SQL Injection:**
        *  Are user inputs properly sanitized and validated before being used in SQL queries? (Parameterized queries, prepared statements)
        *  Are stored procedures used where appropriate to minimize direct user input in database queries?
        *  Are you regularly scanning your database for vulnerabilities?
    * [ ] **NoSQL Injection:** (If using NoSQL databases)
        *  Are you validating all input against the expected data type and format?
        *  Are you using appropriate escaping mechanisms?
    * [ ] **Command Injection:** (If your application executes commands on the server)
        *  Avoid constructing commands dynamically from user input.
        *  If command execution is unavoidable, thoroughly validate and sanitize input.
* **Tools:** SQLMap, OWASP ZAP, Burp Suite

**II. Broken Authentication (25%)**

* **Goal:**  Ensure strong and reliable authentication mechanisms.
* **Checklist Items:**
    * [ ] **Weak Passwords:** Enforce strong password policies (minimum length, complexity, regular changes).
    * [ ] **Session Management:**
        *  Use secure session identifiers.
        *  Implement proper session timeout mechanisms.
        *  Regenerate session IDs after login.
        *  Protect session cookies with the `HttpOnly` and `Secure` flags.
    * [ ] **Multi-Factor Authentication (MFA):** Implement MFA where possible, particularly for sensitive accounts.
    * [ ] **Brute-Force Protection:** Implement rate limiting and CAPTCHAs to prevent brute-force attacks.
* **Tools:**  Burp Suite, OWASP ZAP

**III. Sensitive Data Exposure (17%)**

* **Goal:** Protect sensitive data (PII, credentials, etc.) in transit and at rest.
* **Checklist Items:**
    * [ ] **Encryption in Transit:**  Are all sensitive data transmitted over HTTPS/TLS with strong cipher suites?
    * [ ] **Encryption at Rest:**  Are sensitive data stored securely, using encryption techniques appropriate for the data type? (Full disk encryption, database encryption)
    * [ ] **Data Masking/Tokenization:**  Consider masking or tokenizing sensitive data in non-production environments.
    * [ ] **Key Management:** Securely store and manage encryption keys.
* **Tools:** TLS Inspector,  Key Management Systems (AWS KMS, Azure Key Vault)

**IV. XML External Entities (XXE) (13%)**

* **Goal:** Prevent attackers from exploiting XML parsers to access internal resources or execute arbitrary code.
* **Checklist Items:**
    * [ ] **Disable External Entity Resolution:**  Configure XML parsers to disallow the processing of external entities.
    * [ ] **Input Validation:**  Carefully validate any XML data received from external sources.
* **Tools:**  Burp Suite, OWASP ZAP

**V. Broken Access Control (13%)**

* **Goal:** Ensure users can only access the resources they are authorized to use.
* **Checklist Items:**
    * [ ] **Authorization Checks:**  Are authorization
