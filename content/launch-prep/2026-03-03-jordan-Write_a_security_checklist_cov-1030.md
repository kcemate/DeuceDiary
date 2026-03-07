# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T10:30:39.305836

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed for a layered approach. It's broken down by category, with explanations and suggested actions.  **This is a starting point – you'll need to tailor it to your specific application and environment.**

**Important Disclaimer:** This checklist is for informational purposes only. It's not a substitute for a full penetration test or a robust security program.

---

**I. Injection (OWASP Top 3 - Most Critical)**

* **Description:** Attackers inject malicious code (SQL, command, XSS) into your application, manipulating its behavior or gaining access to sensitive data.
* **Checklist Items:**
    * **SQL Injection:**
        * [ ]  Always use parameterized queries (prepared statements) instead of string concatenation to build SQL queries.
        * [ ]  Implement input validation on *all* user-supplied data entering SQL queries.  Whitelist expected input.
        * [ ]  Employ a Web Application Firewall (WAF) to detect and block common SQL injection patterns.
        * [ ]  Regularly scan your database for vulnerabilities and apply patches.
    * **Cross-Site Scripting (XSS):**
        * [ ]  Sanitize and encode all user-supplied data before displaying it on a web page. Use context-aware escaping.
        * [ ]  Implement Content Security Policy (CSP) to control the sources from which the browser can load resources.
        * [ ]  Educate developers on the different types of XSS (Stored, Reflected, DOM-based).
    * **Command Injection:**
        * [ ] Avoid using system commands directly based on user input.
        * [ ] If command injection is unavoidable, use strict input validation, whitelisting, and proper escaping.
        * [ ] Implement a privilege separation scheme to limit the potential damage from successful injection.


**II. Authentication & Authorization**

* **Description:** Weaknesses in authentication and authorization allow attackers to impersonate users, access unauthorized data, or escalate privileges.
* **Checklist Items:**
    * **Weak Passwords:**
        * [ ]  Enforce strong password policies (minimum length, complexity, character types).
        * [ ]  Implement a password strength meter to guide users.
        * [ ]  Use a password policy enforcement library.
    * **Session Management:**
        * [ ]  Use secure session identifiers (long, random).
        * [ ]  Implement session timeouts to limit the risk of session hijacking.
        * [ ]  Regenerate session IDs after authentication and privilege changes.
        * [ ]  Use HTTPS for all sessions.
    * **Multi-Factor Authentication (MFA):**
        * [ ]  Implement MFA wherever possible (especially for administrative accounts).
    * **Authorization Checks:**
        * [ ]  Enforce proper authorization checks before granting access to resources.  Follow the principle of least privilege.
        * [ ]  Use robust access control mechanisms (RBAC - Role-Based Access Control).
        * [ ]  Audit authorization decisions to identify potential weaknesses.



**III. Cryptography**

* **Description:** Improper use of cryptography exposes sensitive data to compromise.
* **Checklist Items:**
    * **Data Encryption at Rest:**
        * [ ]  Encrypt sensitive data stored in databases, file systems, and backups.
        * [ ]  Use strong encryption algorithms (e.g., AES-256).
        * [ ]  Properly manage encryption keys – store them securely and rotate them regularly.
    * **Data Encryption in Transit:**
        * [ ]  Always use HTTPS for all communication between the client and server.
        * [ ]  Configure TLS/SSL certificates
