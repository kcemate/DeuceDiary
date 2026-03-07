# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T07:16:24.103353

Okay, here’s a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be used as a starting point for assessing your web applications.  This is a detailed checklist; you'll likely need to prioritize and adapt it to your specific application and environment.

**OWASP Top 10 Security Checklist**

**1. Injection (A1, A2, A6)**

* **Description:**  Exploiting vulnerabilities where user-supplied data is not properly validated and used in database queries, operating system commands, or other sensitive actions.
* **Checklist Items:**
    * [ ] **Input Validation:**  Are all user inputs validated on both the client-side *and* the server-side? (Client-side validation is easily bypassed).
    * [ ] **Parameterization/Prepared Statements:** Are database queries and other sensitive operations using parameterized queries or prepared statements to prevent SQL injection? (Verify this across all database interactions – ORM usage, direct DB connections, etc.)
    * [ ] **Command Injection:** Are operating system commands constructed using user input?  If so, are they properly sanitized and escaped? (Especially relevant for CLI tools and scripts).
    * [ ] **XML External Entity (XXE) Injection:** Is your application processing XML data? Are external entity resolvers disabled? (Check XML parsing libraries and configurations).
    * [ ] **LDAP Injection:** Are you querying LDAP directories with user-supplied data? Are they properly escaped?
    * [ ] **NoSQL Injection:** Are you using NoSQL databases? Are queries parameterized to prevent injection attacks?


**2. Broken Authentication (A3, A5)**

* **Description:** Flaws in how your application handles user authentication and authorization, leading to unauthorized access.
* **Checklist Items:**
    * [ ] **Strong Password Policies:**  Are strong password policies enforced (minimum length, complexity, etc.)?
    * [ ] **Multi-Factor Authentication (MFA):**  Is MFA supported and encouraged, particularly for sensitive accounts?
    * [ ] **Session Management:**  Are sessions secured with strong, unique IDs?  Are session timeouts implemented and enforced? Are sessions invalidated upon logout?
    * [ ] **Brute-Force Protection:**  Is there protection against brute-force attacks on login forms (e.g., CAPTCHAs, account lockout)?
    * [ ] **Rate Limiting:**  Are requests from a single user or IP address rate-limited to prevent abuse?
    * [ ] **Secure Storage of Credentials:**  Are passwords never stored in plain text? Use strong hashing algorithms with salts (e.g., bcrypt, Argon2).
    * [ ] **OAuth/OIDC Configuration:** Are OAuth and OpenID Connect implementations secure, with proper scopes and authorization checks?


**3. Sensitive Data Exposure (A4, A7)**

* **Description:**  Failure to protect sensitive information (e.g., passwords, credit card data, PII) during storage, transmission, and processing.
* **Checklist Items:**
    * [ ] **Data Classification:** Have you classified data based on sensitivity levels (e.g., public, internal, confidential)?
    * [ ] **Encryption at Rest:** Is sensitive data encrypted when stored in databases, files, and backups?
    * [ ] **Encryption in Transit:** Is all data transmitted over the network encrypted using TLS/SSL (HTTPS)?  Verify correct certificate installation.
    * [ ] **Tokenization/Masking:** Is sensitive data tokenized or masked when displayed or used in non-production environments?
    * [ ] **Secure File Storage:** Are sensitive files stored securely, with appropriate access controls?
    * [ ] **Logging & Monitoring:** Are sensitive data events logged and monitored appropriately? (Minimize logging of
