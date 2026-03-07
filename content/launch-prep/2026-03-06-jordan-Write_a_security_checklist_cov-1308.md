# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-06T13:08:52.819624

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist covers the core vulnerabilities identified in the OWASP Top 10, providing a framework for assessing and mitigating risks in your applications and systems. It's designed to be adaptable to different project sizes and complexities.

**I. Injection (A1)**

* **Description:** Attackers inject malicious code into an application, typically through user input, leading to data breaches, system compromise, or denial of service.
* **Checklist Items:**
    * [ ] **Input Validation:** Are all user inputs validated rigorously on both the client-side and server-side? (Whitelist approach preferred – define what *is* allowed, rather than what’s forbidden).
    * [ ] **Parameterized Queries/Prepared Statements:** Are database queries and stored procedures using parameterized queries or prepared statements? (Crucial for preventing SQL Injection).
    * [ ] **Escaping Output:**  Are all output values properly escaped to prevent cross-site scripting (XSS) vulnerabilities in contexts where output is displayed.
    * [ ] **Avoid Dynamic SQL:** Minimize or eliminate the use of dynamic SQL construction where user input influences the query structure.
    * [ ] **Review Third-Party Libraries:**  Are all third-party libraries and frameworks regularly updated to address known vulnerabilities related to injection?



**II. Broken Authentication (A2)**

* **Description:** Vulnerabilities in authentication mechanisms allow attackers to impersonate users, steal credentials, or bypass security controls.
* **Checklist Items:**
    * [ ] **Strong Password Policies:** Are strong password policies enforced (length, complexity, rotation)?
    * [ ] **Multi-Factor Authentication (MFA):** Is MFA implemented for sensitive accounts and operations?
    * [ ] **Session Management:** Are sessions securely managed (e.g., using short-lived tokens, HTTPOnly cookies, secure flags)?
    * [ ] **Account Lockout:** Are accounts locked out after multiple failed login attempts?
    * [ ] **Brute-Force Protection:** Is there protection against brute-force attacks (e.g., rate limiting, CAPTCHAs)?
    * [ ] **User Account Management:**  Are user accounts properly managed (creation, modification, deletion, password resets)?



**III. Sensitive Data Exposure (A3)**

* **Description:**  Applications inadvertently expose sensitive data (credentials, personal information, etc.) through insecure storage, transmission, or processing.
* **Checklist Items:**
    * [ ] **Data Classification:** Has sensitive data been properly classified (e.g., public, internal, confidential)?
    * [ ] **Encryption at Rest:** Is sensitive data encrypted when stored? (Consider AES or similar).
    * [ ] **Encryption in Transit:** Is sensitive data encrypted during transmission (HTTPS/TLS)? (Enforce HSTS)?
    * [ ] **Secure Storage:** Is sensitive data stored securely (e.g., using hardware security modules - HSMs)?
    * [ ] **Data Masking/Tokenization:** Are sensitive data masked or tokenized in non-production environments?
    * [ ] **Logging & Auditing:** Are security-related events logged and audited effectively?



**IV. Broken Access Control (A4)**

* **Description:**  Allows users to access resources or perform actions they shouldn’t be authorized to, due to misconfigured access controls.
* **Checklist Items:**
    * [ ] **Role-Based Access Control (RBAC):** Is RBAC implemented to restrict access based on user roles?
    * [ ] **Authorization Checks:** Are authorization checks performed consistently throughout the application for all data access and functionality?
    * [ ] **Least Privilege:** Are users granted only the minimum necessary privileges to perform their tasks?
    * [ ] **Cross-
