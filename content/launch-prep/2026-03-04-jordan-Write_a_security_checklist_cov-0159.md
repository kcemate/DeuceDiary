# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T01:59:12.618042

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the key areas of the OWASP Top 10 vulnerabilities. It's designed to be adaptable to your specific application and development lifecycle.  Use it as a starting point and tailor it to your organization's needs.

**Note:** This is a high-level checklist. Each vulnerability requires a much deeper dive and specific testing procedures.

**1. Injection (A1)** - 20% of vulnerabilities
* **Goal:** Prevent attackers from injecting malicious code or commands into your application.
* **Checklist Items:**
    * **Input Validation:** Are all user inputs (forms, URLs, API requests) rigorously validated *on both the client and server*?
        *  Whitelist acceptable characters/patterns instead of blacklisting.
        *  Regular expressions are used correctly – test them with malicious inputs.
        *  Sanitize input to remove potentially harmful characters.
    * **Parameterized Queries/Prepared Statements:** Are you using parameterized queries or prepared statements for all database interactions? (Critical for SQL Injection)
    * **Stored Procedures:** Are stored procedures used appropriately and securely, with proper parameterization?
    * **Command Injection:** Are you constructing system commands using user input? (If so, absolutely prevent this!)
    * **XML/JSON Injection:** Are you properly escaping XML/JSON data when using it in your application?
* **Tools:** Static/Dynamic Analysis tools, SQL Injection Scanners, Penetration Testing

**2. Broken Authentication (A2)** - 17% of vulnerabilities
* **Goal:** Securely manage user authentication and authorization.
* **Checklist Items:**
    * **Strong Passwords:** Enforce strong password policies (length, complexity, expiry).
    * **Multi-Factor Authentication (MFA):** Implement MFA wherever possible.
    * **Secure Storage of Credentials:** Never store passwords in plain text. Use strong hashing algorithms (e.g., bcrypt, Argon2) with unique salts.
    * **Session Management:** Use secure session IDs, regenerate sessions after login, and implement session timeouts.
    * **Authentication Protocols:** Utilize secure authentication protocols (e.g., OAuth 2.0, SAML) instead of custom solutions.
    * **Brute-Force Protection:** Implement rate limiting and account lockout policies to prevent brute-force attacks.
* **Tools:** Vulnerability Scanners, Authentication Testing Tools

**3. Sensitive Data Exposure (A3)** - 13% of vulnerabilities
* **Goal:** Protect sensitive data at rest and in transit.
* **Checklist Items:**
    * **Data Classification:** Identify and classify all sensitive data (PII, financial, health information).
    * **Encryption at Rest:** Encrypt sensitive data stored in databases, files, and backups.
    * **Encryption in Transit:** Use HTTPS for all web traffic. Implement TLS 1.2 or higher.
    * **Data Masking/Tokenization:**  Mask or tokenize sensitive data when it's not needed in its original form (especially in non-production environments).
    * **Secure File Storage:** Properly secure access to files containing sensitive data.
    * **Logging and Monitoring:**  Monitor for access to sensitive data.
* **Tools:** Data Loss Prevention (DLP) tools, Encryption Validation Tools, Key Management Systems

**4. XML External Entities (XXE) (A4)** - 9% of vulnerabilities
* **Goal:** Prevent attackers from exploiting XML parsers to read local files or internal resources.
* **Checklist Items:**
    * **Disable External Entity Processing:** Configure XML parsers to disallow or restrict the processing of external entities.
    * **Input Validation:** Validate XML input to ensure it doesn’t contain malicious entities.
