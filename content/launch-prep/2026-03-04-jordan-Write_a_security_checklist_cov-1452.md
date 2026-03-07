# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T14:52:00.939209

## OWASP Top 10 Security Checklist

This checklist covers the key areas of the OWASP Top 10 vulnerabilities. It's designed to be used as a starting point for assessing your applications and systems.  Remember, this is a *checklist* – it’s not a comprehensive penetration test.  It’s intended to highlight areas requiring deeper investigation and remediation.

**Note:** This checklist is designed to be adaptable to different application types (web, mobile, API).  Prioritize based on your specific context and risk tolerance.

**I. Injection (Top Priority - Critical)**

* [ ] **Input Validation:** Are all user inputs (forms, URL parameters, cookies, etc.) rigorously validated on the server-side? (Whitelist is preferred over blacklisting)
* [ ] **SQL Injection Protection:**  Are you using parameterized queries or an ORM that prevents SQL injection? Are stored procedures used properly?
* [ ] **NoSQL Injection Protection:** Are you validating and sanitizing all NoSQL input (e.g., MongoDB, Cassandra)?
* [ ] **Command Injection Prevention:** Are you avoiding the use of `system()` or similar functions with user-provided input?
* [ ] **LDAP Injection Prevention:** Are you validating all LDAP queries with user-supplied data?
* [ ] **XPath Injection Prevention:** Are you validating all XPath queries with user-supplied data?


**II. Broken Authentication (Top Priority - Critical)**

* [ ] **Strong Password Policies:** Are strong password policies enforced (length, complexity, rotation)?
* [ ] **Multi-Factor Authentication (MFA):** Is MFA implemented for all users, especially those with privileged access?
* [ ] **Secure Session Management:** Are sessions properly managed (short timeouts, secure cookies, HttpOnly flags, SameSite attributes)?
* [ ] **Brute-Force Protection:** Are you employing mechanisms to prevent brute-force attacks (rate limiting, account lockout)?
* [ ] **Password Reset Functionality:** Is password reset functionality secure and resistant to abuse? (Consider using strong tokens and time-based validations)
* [ ] **Authentication Logic Review:**  Is authentication logic correctly implemented and thoroughly tested?


**III. Sensitive Data Exposure (High Priority - Critical)**

* [ ] **Data Classification:** Has data been classified based on sensitivity (public, internal, confidential, restricted)?
* [ ] **Data Encryption at Rest:** Is sensitive data encrypted at rest using strong encryption algorithms?
* [ ] **Data Encryption in Transit:** Is all sensitive data transmitted over the network encrypted using HTTPS/TLS with strong ciphers?
* [ ] **Secure Storage:**  Is sensitive data stored securely, avoiding default configurations and using appropriate access controls?
* [ ] **Token Management:** Are tokens (API keys, OAuth tokens) properly managed, rotated, and revoked when necessary?
* [ ] **Logging & Monitoring:**  Are access to sensitive data logged and monitored for suspicious activity?



**IV. XML External Entities (XXE) (High Priority - Critical)**

* [ ] **Disable XXE Vulnerabilities:** Is XXE disabled in the application and any relevant libraries?
* [ ] **Input Validation:**  Are all XML inputs validated to prevent the inclusion of external entities?
* [ ] **Content-Security-Policy (CSP):** Is CSP configured to mitigate XXE attacks?


**V. Broken Access Control (High Priority - Critical)**

* [ ] **Authorization Checks:** Are authorization checks enforced consistently throughout the application? (Principle of Least Privilege - users should only have access to what they need)
* [ ] **Session Management:** (See Broken Authentication)
* [ ] **Cross-Site Scripting (XSS) Protection:** (See XSS) –  XSS can bypass access controls.
* [ ] **Role-Based Access Control
