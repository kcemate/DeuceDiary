# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T22:58:10.489320

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist is designed to help you systematically assess your web application for vulnerabilities aligned with the OWASP Top 10. It's a starting point; tailor it to your specific application and environment.

**Note:** This is a high-level checklist. Each item requires deeper investigation and testing.

**I. Injection (Overall Risk: High)**

* **SQL Injection:**
    * [ ] Input validation performed on all user input (including POST, GET, and URL parameters).
    * [ ] Parameterized queries or Object-Relational Mappers (ORMs) are used to prevent direct concatenation of user input into SQL queries.
    * [ ] Stored procedures are reviewed for potential vulnerabilities.
    * [ ] Database user accounts have minimal privileges.
    * [ ] Regularly audit SQL queries for security best practices.
* **Cross-Site Scripting (XSS):**
    * [ ] Input validation performed on all user input, especially before displaying in HTML.
    * [ ] Output encoding/escaping is used to prevent the execution of malicious scripts. (Context-aware encoding – HTML, JavaScript, URL)
    * [ ] Content Security Policy (CSP) is implemented to restrict the sources from which the browser can load resources.
    * [ ] Regularly review third-party libraries for XSS vulnerabilities.
* **Command Injection:**
    * [ ] Avoid using user input directly in system commands.
    * [ ] If command injection is unavoidable, strictly sanitize and validate user input to prevent malicious commands.
    * [ ] Use safe alternatives to shell commands whenever possible (e.g., built-in functions).


**II. Broken Authentication (Overall Risk: High)**

* **Weak Passwords:**
    * [ ] Enforce strong password policies (minimum length, complexity, etc.).
    * [ ] Implement password strength meters and feedback to users.
    * [ ] Use password hashing algorithms (e.g., bcrypt, Argon2) with salting.
* **Session Management:**
    * [ ] Use secure, unique session identifiers.
    * [ ] Implement proper session timeout mechanisms.
    * [ ] Securely regenerate session IDs after authentication.
    * [ ]  Consider HTTPOnly and Secure flags on session cookies.
* **Multi-Factor Authentication (MFA):**
    * [ ] Implement MFA for all users, especially administrators.
    * [ ] Choose a robust MFA method (e.g., TOTP, SMS, hardware tokens).
* **Brute-Force Protection:**
   * [ ] Implement rate limiting on login attempts.
   * [ ] Utilize CAPTCHAs or other challenge-response mechanisms.



**III. Sensitive Data Exposure (Overall Risk: High)**

* **Insecure Storage:**
    * [ ] Sensitive data (passwords, API keys, credit card numbers) should NEVER be stored in plaintext.
    * [ ] Utilize encryption at rest for sensitive data.
    * [ ]  Utilize secure key management practices.
* **Transmission Issues:**
    * [ ]  All data transmitted over the network should be encrypted using TLS/SSL.
    * [ ]  Ensure TLS/SSL certificates are valid and properly configured.
    * [ ]  Regularly audit TLS configuration for vulnerabilities.
* **Data Leakage:**
    * [ ]  Review logs for sensitive information being exposed.
    * [ ]  Implement data loss prevention (DLP) mechanisms where appropriate.



**IV. XML External Entities (XXE) (Overall Risk: Medium)**

* [ ] Disable or restrict the parsing of external XML entities.
* [ ] Validate XML input carefully to prevent malicious entities.
* [ ] Use a secure XML processing library that handles entities securely.
