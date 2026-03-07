# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T06:08:22.961438

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the key vulnerabilities identified in the OWASP Top 10, providing a framework for assessing and mitigating risks in your application. It's designed to be adaptable to various application types and technologies.

**I. Injection (A1, A2)**

* **SQL Injection:**
    * [ ] Input validation for all user-supplied data.  Use parameterized queries or prepared statements.
    * [ ] Avoid constructing SQL queries dynamically using string concatenation.
    * [ ] Use Object-Relational Mapping (ORM) libraries correctly to prevent SQL injection.
    * [ ] Regularly scan for SQL injection vulnerabilities.
* **NoSQL Injection:**
    * [ ] Validate and sanitize all user inputs before feeding them to NoSQL databases.
    * [ ] Utilize parameterized queries/prepared statements specific to the NoSQL database.
    * [ ] Understand the unique injection vectors for each NoSQL database type (MongoDB, Cassandra, etc.).


**II. Broken Authentication (A3)**

* **Weak Credentials:**
    * [ ] Enforce strong password policies (minimum length, complexity, etc.).
    * [ ] Utilize hashing algorithms (bcrypt, Argon2) with salting to store passwords securely. *Never* store passwords in plain text.
    * [ ] Implement Multi-Factor Authentication (MFA) wherever possible.
* **Session Management:**
    * [ ] Use secure session management techniques (e.g., HTTPOnly, Secure flags).
    * [ ] Regularly regenerate session IDs.
    * [ ] Implement session timeouts.
    * [ ] Properly invalidate sessions upon logout.
* **API Authentication:**
    * [ ] Implement robust authentication and authorization for all APIs (e.g., OAuth 2.0, JWT).
    * [ ]  Enforce rate limiting to prevent abuse.



**III. Sensitive Data Exposure (A4)**

* **Data in Transit:**
    * [ ] Enforce HTTPS for all sensitive data transmission (including API communication).
    * [ ] Use TLS 1.2 or higher.
    * [ ] Properly configure TLS settings.
* **Data at Rest:**
    * [ ] Encrypt sensitive data stored in databases, files, and backups.
    * [ ]  Use key management systems for secure storage and rotation of encryption keys.
    * [ ]  Regularly review and remove unnecessary sensitive data.
* **Logging:**
    * [ ] Minimize logging of sensitive information.  Be mindful of PII (Personally Identifiable Information).
    * [ ] Securely store logs.



**IV. Broken Access Control (A5)**

* **Authentication vs. Authorization:**
    * [ ] Properly separate authentication (verifying identity) from authorization (controlling access).
    * [ ] Implement role-based access control (RBAC) or attribute-based access control (ABAC).
* **Cross-Site Scripting (XSS) Protection:**  (See XSS –  A7 as related)
    * [ ] Implement Content Security Policy (CSP) to control the sources from which scripts can be loaded.
    * [ ] Properly sanitize and escape all user-generated content before displaying it on the page.
* **Path Traversal:**
    * [ ] Validate and sanitize all user inputs that could potentially be used to access files or directories outside of the intended application paths.



**V. Security Misconfiguration (A6)**

* **Default Configurations:**
    * [ ] Change default passwords and settings for all applications, servers, and databases.
    * [ ] Harden operating systems and web servers.
* **Unnecessary Services:**
    * [ ] Disable or remove unnecessary services and components.
* **Directory Listing:**
    * [ ] Disable directory listing
