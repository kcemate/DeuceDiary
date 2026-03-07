# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T02:21:50.604213

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to help you assess and improve your application's security posture.  It's broken down by vulnerability category and includes suggested actions.  **This is a starting point – tailor it to your specific application and environment.**

**Important Notes:**

*   **Risk Levels:** This checklist suggests risk levels (High, Medium, Low) for each item. Adjust these based on your organization’s risk tolerance and the criticality of the affected systems.
*   **Tools:** This checklist references tools – use them appropriately and understand their limitations.
*   **Continuous Monitoring:** Security isn’t a one-time fix.  Regular scanning, testing, and monitoring are crucial.

---

**I. Injection (High Risk)**

*   **Description:** Injecting malicious code (SQL, XSS, Command Injection) into an application to gain unauthorized access or execute commands.
*   **Checklist Items:**
    *   [ ] **SQL Injection:**
        *   Are all user inputs properly sanitized and validated before being used in SQL queries? (Use parameterized queries/prepared statements religiously)
        *   Are stored procedures used to minimize direct user interaction with the database?
        *   Is database access restricted to only the users and applications that need it? (Least Privilege)
    *   [ ] **Cross-Site Scripting (XSS):**
        *   Are all user inputs properly encoded when displaying them in the browser? (Output Encoding – Context-Aware)
        *   Are HTTP headers like Content-Security-Policy (CSP) configured to restrict the execution of inline scripts?
    *   [ ] **Command Injection:**
        *   Are user inputs never directly incorporated into system commands? (Avoid entirely if possible)
        *   If command execution is necessary, use a whitelist approach with carefully vetted commands and parameters.
*   **Tools:** SQLMap, XSSer, Burp Suite, OWASP ZAP

**II. Broken Authentication (High Risk)**

*   **Description:** Weaknesses in authentication mechanisms that allow attackers to compromise user accounts.
*   **Checklist Items:**
    *   [ ] **Weak Passwords:**
        *   Is there a password complexity policy enforced?
        *   Is multi-factor authentication (MFA) implemented for all users, especially privileged accounts?
    *   [ ] **Session Management:**
        *   Are sessions properly invalidated on logout?
        *   Are session IDs generated securely and rotated?
        *   Are session cookies marked as HttpOnly and Secure?
    *   [ ] **Brute-Force Protection:**
        *   Is there rate limiting in place to prevent brute-force attacks on login pages?
        *   Is account lockout implemented after a certain number of failed attempts?
    *   [ ] **API Authentication:**  Are APIs using robust authentication schemes (OAuth 2.0, JWT) instead of simple API keys?
*   **Tools:**  Nessus, Burp Suite, OWASP ZAP, ModSecurity

**III. Sensitive Data Exposure (High Risk)**

*   **Description:** Unprotected exposure of sensitive data (PII, credentials, API keys) in transit or at rest.
*   **Checklist Items:**
    *   [ ] **Data in Transit:**
        *   Is all data transmitted over the network encrypted using TLS/SSL? (Enforce HTTPS – HSTS)
        *   Are weak ciphers disabled?
    *   [ ] **Data at Rest:**
        *   Is sensitive data encrypted at rest (database, file systems, backups)?
        *   Are access controls in place to restrict access to sensitive data?
        *   Is Personally Identifiable
