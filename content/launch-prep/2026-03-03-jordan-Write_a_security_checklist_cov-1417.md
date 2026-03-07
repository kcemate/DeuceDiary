# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T14:17:12.305850

## OWASP Top 10 Security Checklist

This checklist is designed to help you identify potential vulnerabilities based on the OWASP Top 10 threats. It’s a starting point and needs to be adapted to your specific application, environment, and risk tolerance.  Each section includes key areas to investigate and potential remediation strategies.

**I. Injection (34% of Vulnerabilities)**

* **Description:**  Attackers inject malicious code into an application to manipulate its behavior.
* **Checklist Items:**
    * **SQL Injection:**
        * [ ] Are user inputs properly sanitized and validated *before* being used in SQL queries?
        * [ ] Are parameterized queries or prepared statements used consistently?
        * [ ] Are database users granted only the necessary privileges? (Principle of Least Privilege)
        * [ ] Are stored procedures used instead of dynamic SQL where possible?
    * **Cross-Site Scripting (XSS):**
        * [ ]  Is all user-supplied data properly encoded/escaped when output to a web page? (Different contexts require different encoding – HTML, JavaScript, URL)
        * [ ] Are user-controlled attributes in HTML tags properly sanitized?
        * [ ] Are Content Security Policies (CSP) implemented and configured appropriately?
    * **Command Injection:**
        * [ ] Are user inputs validated against a whitelist of allowed commands?
        * [ ]  Are shell commands constructed dynamically from user input?  If so, are they properly escaped and sanitized?
        * [ ] Can attacker inject system commands through vulnerable applications?


**II. Broken Authentication (29% of Vulnerabilities)**

* **Description:**  Weaknesses in how an application identifies and authenticates users.
* **Checklist Items:**
    * [ ]  Is strong password enforcement used (length, complexity, regular changes)?
    * [ ]  Is multi-factor authentication (MFA) supported?
    * [ ]  Is session management secure (HTTPOnly, Secure flags, session timeouts, proper session ID generation)?
    * [ ]  Are authentication tokens securely managed and validated? (Avoid storing passwords!)
    * [ ]  Are default credentials changed upon installation?
    * [ ]  Is account lockout implemented after multiple failed login attempts?
    * [ ]  Are user accounts disabled when they leave the organization?


**III. Sensitive Data Exposure (13% of Vulnerabilities)**

* **Description:**  Failure to protect sensitive data in transit and at rest.
* **Checklist Items:**
    * [ ]  Is sensitive data (PII, financial data, etc.) properly encrypted at rest (database, file storage)?
    * [ ]  Is sensitive data properly encrypted in transit (HTTPS/TLS)?
    * [ ]  Are access controls in place to restrict access to sensitive data?
    * [ ]  Are secrets (API keys, passwords) properly managed (e.g., using a secrets management system)?
    * [ ]  Are logs monitored for sensitive data leaks?



**IV. Broken Access Control (13% of Vulnerabilities)**

* **Description:**  Insufficient restrictions on user access to application features and data.
* **Checklist Items:**
    * [ ]  Are access controls consistently enforced across the entire application?
    * [ ]  Is role-based access control (RBAC) implemented and properly configured?
    * [ ]  Are authorization checks performed before allowing users to access resources? (Beyond simply checking user IDs)
    * [ ]  Is cross-site request forgery (CSRF) protected against?
    * [ ]  Are API endpoints properly authenticated and authorized? (Authentication + Authorization)



**V. Security Misconfiguration (9% of Vulnerabilities)**

* **Description:**  Incorrect or incomplete
