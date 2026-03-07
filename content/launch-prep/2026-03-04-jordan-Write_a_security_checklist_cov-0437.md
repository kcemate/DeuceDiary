# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T04:37:44.881014

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the key areas outlined in the OWASP Top 10 vulnerabilities. It’s designed to be a starting point and should be tailored to your specific application and environment. Regularly review and update this checklist as threats evolve.

**I. Injection (Critical)**

* **Checklist Items:**
    * **Input Validation:** Are all user inputs rigorously validated at *every* stage of the application, both client-side and server-side? (Implement whitelisting whenever possible)
    * **Parameterized Queries/Prepared Statements:** Are all database queries using parameterized queries or prepared statements to prevent SQL injection?
    * **Escaping:** Are all user-supplied data escaped correctly before being used in any context (HTML, JavaScript, shell commands, etc.)?
    * **Stored Procedures:** Are stored procedures used instead of dynamic SQL where feasible?
    * **Command Injection:** Are you avoiding direct use of system commands? If not, are those commands carefully sanitized and validated?
* **Tools:** Static Analysis Tools (e.g., Fortify, SonarQube), Dynamic Analysis Tools (Penetration Testing)

**II. Broken Authentication (Critical)**

* **Checklist Items:**
    * **Strong Passwords:** Enforce strong password policies (length, complexity, expiry).
    * **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially administrators.
    * **Session Management:** Implement secure session management practices – use secure cookies (HTTPOnly, Secure), regenerate session IDs after login, and invalidate sessions on logout.
    * **Rate Limiting:** Implement rate limiting on login attempts to mitigate brute-force attacks.
    * **Account Lockout:**  Implement account lockout after multiple failed login attempts.
* **Tools:** Security Auditing Tools, Penetration Testing

**III. Sensitive Data Exposure (High)**

* **Checklist Items:**
    * **Data Classification:** Categorize data based on sensitivity levels (Public, Internal, Confidential, Restricted).
    * **Encryption at Rest:**  Encrypt all sensitive data stored in databases, file systems, and backups.
    * **Encryption in Transit:**  Use HTTPS (TLS/SSL) for all communication channels.
    * **Token Management:** Securely manage and store API keys, tokens, and other sensitive credentials – don’t hardcode them. Use a secure vault.
    * **Data Masking/Redaction:** Mask or redact sensitive data in non-production environments.
* **Tools:**  Key Management Systems (KMS), Data Loss Prevention (DLP) solutions, Encryption Tools

**IV. Broken Access Control (High)**

* **Checklist Items:**
    * **Least Privilege Principle:** Users and applications should only have access to the resources they need to perform their tasks.
    * **Role-Based Access Control (RBAC):** Implement RBAC to manage permissions based on user roles.
    * **Authorization Checks:**  Are authorization checks performed consistently and accurately on *every* request?
    * **Cross-Site Scripting (XSS) Prevention:** (While technically a separate vulnerability, XSS can be used to bypass access control)  Properly escape all user input to prevent XSS attacks.
* **Tools:**  Access Control Monitoring Tools, Penetration Testing

**V. Security Misconfiguration (High)**

* **Checklist Items:**
    * **Default Configurations:**  Change all default usernames and passwords.
    * **Unnecessary Services:** Disable or remove unnecessary services and features.
    * **Directory Listings:** Prevent directory listings – configure web servers to hide directory structures.
    * **Error Handling:**  Implement proper error handling that doesn’t expose sensitive information.
    * **Log Management:**  Configure logging to capture relevant
