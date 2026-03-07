# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T18:26:11.334117

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist covers the 10 critical web application security risks identified by the OWASP (Open Web Application Security Project). It's designed to be a starting point and should be tailored to your specific application and environment.  Consider this a guide for planning, testing, and remediation.

**I.  Application Security Assessment - Initial Steps**

* [ ] **Define Scope:** Clearly identify the application(s) and systems included in the assessment.
* [ ] **Risk Assessment:** Determine the potential impact and likelihood of each vulnerability.
* [ ] **Secure Development Lifecycle (SDLC) Integration:** Ensure security is baked into every stage of the development process, not just the testing phase.
* [ ] **Developer Training:** Provide regular security training for developers to understand common vulnerabilities and secure coding practices.


**II. OWASP Top 10 Risks - Detailed Checklist**

**1. Injection (A1 - High Priority)**

* [ ] **SQL Injection:**
    * [ ] Are input values properly sanitized and validated before use in SQL queries?
    * [ ] Are parameterized queries or ORM used to prevent dynamic SQL construction?
    * [ ] Are stored procedures used to mitigate risks?
    * [ ] Are database accounts overly privileged?
* [ ] **Cross-Site Scripting (XSS):**
    * [ ] Is all user-supplied data properly encoded/escaped before rendering in the HTML?
    * [ ] Are content security policies (CSP) enforced to restrict sources of scripts?
    * [ ] Are HTML input filters used to prevent malicious code insertion?
* [ ] **Command Injection:**
    * [ ]  Are system commands never directly executed based on user input?
    * [ ] Are external APIs and services securely called, avoiding command execution?


**2. Broken Authentication (A2 - High Priority)**

* [ ] **Weak Passwords:**
    * [ ] Enforce strong password policies (minimum length, complexity, etc.).
    * [ ] Use a password policy enforcement mechanism.
* [ ] **Session Management:**
    * [ ] Are session identifiers randomly generated and securely stored?
    * [ ] Are session expiration times appropriately configured?
    * [ ] Are sessions invalidated upon logout?
* [ ] **Multi-Factor Authentication (MFA):**  Implement MFA where appropriate.
* [ ] **Brute-Force Protection:** Employ rate limiting and account lockout mechanisms.


**3. Sensitive Data Exposure (A3 - High Priority)**

* [ ] **Data Classification:** Classify data based on sensitivity (e.g., confidential, public).
* [ ] **Encryption in Transit:** Use HTTPS (TLS) for all communication.
* [ ] **Encryption at Rest:** Encrypt sensitive data stored in databases, files, and backups.
* [ ] **Data Masking/Tokenization:**  Mask or tokenize sensitive data when not actively being used.
* [ ] **Secure Storage:**  Securely store credentials and API keys.


**4. Broken Access Control (A4 - High Priority)**

* [ ] **Role-Based Access Control (RBAC):** Implement RBAC to restrict access based on user roles.
* [ ] **Authorization Checks:** Verify that users have the necessary permissions before granting access to resources.
* [ ] **Prevent Default Access:**  Remove default usernames and passwords.
* [ ] **Secure Cookies:** Properly set and validate cookie attributes (HttpOnly, Secure).



**5. Security Misconfiguration (A5 - High Priority)**

* [ ] **Secure Default Configurations:** Use secure default configurations for all software and systems.
* [ ] **Remove Unnecessary Features:** Disable unnecessary features and services to reduce the attack surface.
* [ ] **Regular Security Aud
