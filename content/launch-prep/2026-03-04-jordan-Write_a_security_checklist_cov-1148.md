# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T11:48:29.527033

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist covers the core vulnerabilities identified in the OWASP Top 10. It's designed to be used as a starting point for assessing your applications and systems.  Each section includes key considerations and recommended actions. **This is not exhaustive and should be tailored to your specific application and environment.**

**I. Injection (SQL, XSS, Command, etc.) - Risk: High**

* **[ ]  Input Validation:** Are all user-supplied inputs validated on *both* the client and server-side? Use a whitelist approach (allowing only known good characters/patterns) rather than a blacklist (blocking known bad ones).
* **[ ]  Parameterized Queries/Prepared Statements:** Are parameterized queries or prepared statements consistently used to prevent SQL injection? (Verify against all database interaction points.)
* **[ ]  Output Encoding:** Is output properly encoded to prevent Cross-Site Scripting (XSS) attacks? Consider using Content Security Policy (CSP) to further mitigate this.
* **[ ]  Command Injection Prevention:**  Are dynamic command constructions avoided entirely? If necessary, use safe command-line libraries and validate all input rigorously.
* **[ ]  Authentication & Authorization Checks:** Are authentication and authorization mechanisms consistently applied and tightly coupled with input validation?


**II. Broken Authentication - Risk: Critical**

* **[ ]  Strong Password Policies:** Are strong password policies enforced (length, complexity, rotation)?
* **[ ]  Multi-Factor Authentication (MFA):** Is MFA implemented for all users, especially administrators?
* **[ ]  Session Management:** Are sessions properly managed (session identifiers, timeout, regeneration, HTTP-only flag)?  Avoid transmitting session identifiers in URLs.
* **[ ]  Brute-Force Protection:** Are rate limiting and account lockout mechanisms in place to mitigate brute-force attacks?
* **[ ]  Credential Storage:** Are credentials stored securely (hashed and salted)? Never store plain text passwords.
* **[ ]  API Key Security:**  Are API keys properly managed, rotated, and protected from exposure?


**III. Sensitive Data Exposure - Risk: High**

* **[ ]  Data Classification:** Is data classified based on sensitivity levels (public, internal, confidential)?
* **[ ]  Encryption in Transit:** Is all sensitive data transmitted over the network encrypted using TLS/SSL? (Verify certificate validity and proper configuration.)
* **[ ]  Encryption at Rest:** Is sensitive data stored securely, encrypted at rest? (Consider full-disk encryption for servers).
* **[ ]  Secure Storage Practices:** Are sensitive data stored securely (databases, file systems, cloud storage)? Use access control and proper permissions.
* **[ ]  Data Masking/Tokenization:**  Are techniques like data masking or tokenization used to protect sensitive data when it’s not actively needed?
* **[ ]  Logging & Monitoring:**  Are sensitive data access events logged and monitored for suspicious activity?


**IV. Broken Access Control - Risk: Critical**

* **[ ]  Role-Based Access Control (RBAC):** Is RBAC implemented correctly, with clear roles and permissions defined?
* **[ ]  Authorization Checks:** Are authorization checks performed consistently *before* accessing any resource or functionality?
* **[ ]  Access Control Logic:** Is the access control logic clear, concise, and rigorously tested? Avoid complex or confusing logic.
* **[ ]  Preventing Privilege Escalation:** Are mechanisms in place to prevent users from escalating their privileges?
* **[ ]  Cross-Site Request Forgery (CSRF) Protection:**  Are CSRF tokens used to protect against CSRF attacks?  (Verify proper implementation and secure token generation).


**V. Security Misconfiguration - Risk: High**

* **
