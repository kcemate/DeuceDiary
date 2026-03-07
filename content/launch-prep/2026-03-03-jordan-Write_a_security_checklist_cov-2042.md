# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T20:42:01.416934

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and including considerations for different levels of technical expertise. This checklist is a starting point – you'll need to tailor it to your specific application, technology stack, and risk appetite.

**I. Executive Summary & General Security Practices**

*   **[ ] Security Policy & Awareness:**
    *   Do you have a documented security policy? (Review & Update Regularly)
    *   Do developers, operations, and other relevant staff receive regular security awareness training? (Include phishing, social engineering, secure coding practices)
    *   Is there a clear process for reporting vulnerabilities?
*   **[ ] Risk Assessment:**
    *   Have you conducted a regular risk assessment to identify and prioritize vulnerabilities? (Consider impact and likelihood)
*   **[ ] Change Management:**
    *   Is there a robust change management process to assess security implications of changes?
*   **[ ] Version Control:**
    *   Are all code changes tracked in a version control system (e.g., Git)?
    *   Are branch management practices secure (e.g., no direct pushing to main branches)?

**II. OWASP Top 10 Vulnerabilities - Checklist**

**A. Injection (A1 - High Risk)**

*   **[ ] Input Validation:** Are all user inputs (forms, URLs, APIs, etc.) thoroughly validated on both the client-side *and* the server-side?
*   **[ ] Output Encoding:**  Is all data output to users or systems properly encoded to prevent interpretation as code?
*   **[ ] Parameterized Queries/Prepared Statements:** Are database queries constructed using parameterized queries or prepared statements to prevent SQL injection? (Essential!)
*   **[ ] Specific Injection Types:**  Are you testing for common injection types: SQL, NoSQL, Command, LDAP, XSS (if applicable)?
*   **[ ] Escaping Special Characters:**  When building dynamic content, are special characters properly escaped?

**B. Broken Authentication (A2 - High Risk)**

*   **[ ] Strong Password Policies:** Do you enforce strong password policies (length, complexity, expiration)?
*   **[ ] Multi-Factor Authentication (MFA):** Is MFA implemented for all user accounts, especially privileged accounts? (Crucial!)
*   **[ ] Session Management:** Is session management secure? (HTTPOnly, Secure flags, Session timeouts, Regenerate Session IDs)
*   **[ ] Authentication Flow Review:**  Are authentication flows thoroughly reviewed for weaknesses? (e.g., insecure direct object reference)
*   **[ ] Brute-Force Protection:**  Is there rate limiting and account lockout implemented to prevent brute-force attacks?
*   **[ ] API Authentication:** If using APIs, is robust authentication implemented (e.g., OAuth 2.0, JWT)?

**C. Sensitive Data Exposure (A3 - High Risk)**

*   **[ ] Data Classification:** Have you classified your data based on sensitivity levels (e.g., public, confidential, secret)?
*   **[ ] Encryption in Transit:** Is all sensitive data transmitted over the network encrypted using TLS/SSL? (Verify certificate validity!)
*   **[ ] Encryption at Rest:**  Is sensitive data stored at rest encrypted using appropriate methods (e.g., database encryption, file encryption)?
*   **[ ] Data Masking/Tokenization:** Are sensitive data masked or tokenized when displayed or used in non-production environments?
*   **[ ] Secure Storage:** Is sensitive data stored securely, with restricted access controls? (Avoid storing passwords in plaintext).
*   **[ ] Log Management:** Are logs regularly reviewed for exposed sensitive data?

**D. Broken Access Control
