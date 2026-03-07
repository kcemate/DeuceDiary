# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T01:53:50.960112

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the key areas of the OWASP Top 10 vulnerabilities, providing a framework for assessing and mitigating risks within your application. It's designed to be adaptable to different project sizes and complexities.

**Important Note:** This is a checklist, not a guarantee of security. Regular security testing, code reviews, and vulnerability scanning are crucial components of a robust security strategy.

**I. Injection (34% of Vulnerabilities)**

* **SQL Injection:**
    * [ ] Are all user inputs properly validated and sanitized *before* being used in SQL queries?
    * [ ] Is parameterized queries (prepared statements) used consistently to separate data from code?
    * [ ] Are stored procedures used to limit direct SQL access?
    * [ ] Are database connection strings stored securely (e.g., environment variables) and not directly in the application code?
    * [ ] Are database user accounts used with the principle of least privilege? (Only the minimum required permissions.)
* **NoSQL Injection:** (Similar principles apply)
    * [ ] Are all NoSQL query parameters properly validated and sanitized?
    * [ ] Is parameterized queries/native drivers utilized correctly?
* **Command Injection:**
    * [ ] Avoid constructing shell commands dynamically based on user input.
    * [ ] If command execution is necessary, use a safe API or library designed for this purpose.
    * [ ] Implement strict input validation and escape mechanisms if manual command construction is unavoidable.


**II. Broken Authentication (29% of Vulnerabilities)**

* [ ] **Weak Password Policies:**
    * [ ] Enforce strong password policies (minimum length, complexity requirements, character types).
    * [ ] Use password strength meters to guide user input.
* [ ] **Session Management:**
    * [ ] Use strong, unpredictable session IDs.
    * [ ] Implement secure session timeout mechanisms.
    * [ ] Properly invalidate sessions upon logout.
    * [ ] Protect session IDs from cross-site scripting (XSS) and other attacks.
* [ ] **Multi-Factor Authentication (MFA):**
    * [ ] Implement MFA where feasible, especially for sensitive accounts.
* [ ] **Authentication Library Usage:**
    * [ ] Utilize well-established, actively maintained authentication libraries instead of rolling your own.
    * [ ] Keep authentication libraries up-to-date with the latest security patches.
* [ ] **Brute-Force Protection:**
    * [ ] Implement rate limiting and account lockout mechanisms to prevent brute-force attacks.


**III. Sensitive Data Exposure (17% of Vulnerabilities)**

* [ ] **Data in Transit:**
    * [ ] All sensitive data (passwords, API keys, personal information) must be transmitted over HTTPS with strong TLS/SSL certificates.
    * [ ] Verify the validity and configuration of TLS/SSL certificates.
* [ ] **Data at Rest:**
    * [ ] Encrypt sensitive data stored in databases, file systems, and backups.
    * [ ] Properly manage encryption keys – store them securely and rotate them regularly.
* [ ] **Logging:**
    * [ ] Minimize logging of sensitive data.
    * [ ] Properly redact or mask sensitive information in logs.
* [ ] **Information Leakage:**
    * [ ]  Regularly review application code, configurations, and documentation for unintentional exposure of sensitive information.


**IV. XML External Entities (XXE) (13% of Vulnerabilities)**

* [ ] **Disable XXE Vulnerabilities:**
    * [ ] Configure XML parsers to disable the processing of external entities.
    * [ ] Sanitize XML input to prevent malicious external entity injections.
* [ ] **Input Validation:**  Validate
