# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T04:15:02.127718

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the OWASP Top 10 vulnerabilities and provides a framework for assessing and improving your application's security posture.  It’s designed to be used iteratively, focusing on priority areas based on your application's risk profile.

**Note:** This is a high-level checklist. Each vulnerability requires detailed investigation and tailored remediation strategies.

**I. Injection (Critical)**

* **[ ] Input Validation & Sanitization:**
    * **All Inputs:**  Are *all* user inputs (URL parameters, forms, cookies, database queries, API calls) rigorously validated on both the client-side and server-side?
    * **Whitelisting:**  Prefer whitelisting acceptable characters/patterns rather than blacklisting dangerous ones.
    * **Data Type Enforcement:** Are input types (e.g., integer, email, date) correctly validated and enforced?
    * **Encoding/Escaping:**  Are all outputs encoded or escaped appropriately based on the context (HTML, JavaScript, SQL, URL)?
* **[ ] Parameterized Queries (Prepared Statements):** Are database queries always constructed using parameterized queries (prepared statements) to prevent SQL injection?
* **[ ] Stored Procedures:**  If used, are stored procedures properly parameterized?
* **[ ] Command Injection:**  Are any commands executed using user input (shell commands, system calls) properly escaped and/or parameterized?


**II. Broken Authentication (Critical)**

* **[ ] Strong Password Policies:**  Are strong password policies enforced (length, complexity, character types)?
* **[ ] Multi-Factor Authentication (MFA):**  Is MFA implemented, especially for critical accounts and sensitive data?
* **[ ] Secure Session Management:**
    * **Secure Cookies:** Are session cookies marked as `HttpOnly` and `Secure`?
    * **Session Timeout:**  Are session timeouts configured and enforced?
    * **Session Hijacking Prevention:** Are techniques like changing session IDs after login and using WAF to detect and block suspicious session activity used?
* **[ ] Rate Limiting:**  Is rate limiting implemented to prevent brute-force attacks against login endpoints?
* **[ ] Account Lockout:**  Is account lockout implemented after multiple failed login attempts?
* **[ ]  PAM (Privileged Access Management):** Is PAM implemented for managing privileged accounts?



**III. Sensitive Data Exposure (High)**

* **[ ] Data Classification:**  Is data classified based on sensitivity (public, internal, confidential, restricted)?
* **[ ] Data Encryption at Rest:** Is sensitive data encrypted at rest using strong encryption algorithms?
* **[ ] Data Encryption in Transit:** Is all sensitive data transmitted over HTTPS with TLS 1.2 or higher?
* **[ ] Data Masking/Redaction:**  Are sensitive data elements masked or redacted in non-production environments (development, testing)?
* **[ ] Secrets Management:**  Are credentials and API keys securely stored and managed using a secrets management solution (HashiCorp Vault, AWS Secrets Manager, etc.) – *never* hardcoded.
* **[ ]  PCI DSS Compliance:** If handling credit card data, is the application compliant with PCI DSS requirements?



**IV. XML External Entities (XXE) (High)**

* **[ ]  Disable XXE Vulnerabilities:** Is XXE disabled or mitigated in all XML parsers? (e.g., using the `Double-Check` XML parser in Java)
* **[ ] Input Validation:**  If XXE cannot be entirely disabled, is XML input rigorously validated to prevent external entity references?
* **[ ]  Content-Security-Policy (CSP):** Is CSP used to restrict the execution of inline scripts and external resources, mitigating some XXE impacts?
