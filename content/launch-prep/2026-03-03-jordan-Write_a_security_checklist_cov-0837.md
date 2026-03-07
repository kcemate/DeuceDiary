# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T08:37:42.923898

Okay, here’s a comprehensive security checklist covering the OWASP Top 10, designed to help you assess and improve the security posture of your web applications.  It's broken down by category and includes considerations for both developers and operations teams.

**Important Note:** This is a *checklist*, not a definitive security solution.  It should be used as a starting point and adapted to your specific application, technology stack, and risk tolerance.  Regular testing and vulnerability scanning are crucial.

---

**I. Injection (OWASP Top 3 - Critical)**

* **Checklist Items:**
    * **Input Validation Everywhere:**  Are *all* user inputs (forms, URLs, APIs, database queries, etc.) being validated on both the client-side *and* the server-side? (Server-side validation is paramount).
    * **Parameterized Queries/Prepared Statements:**  Are you using parameterized queries (or prepared statements) for *all* database interactions to prevent SQL injection?
    * **Output Encoding:**  Are you properly encoding output to prevent Cross-Site Scripting (XSS) vulnerabilities that can be exploited via injection attacks?
    * **Command Injection Prevention:**  Are you avoiding the use of system commands or shell commands based on user input? If unavoidable, are you sanitizing and validating the input rigorously?
    * **XML External Entity (XXE) Injection:**  Are you validating XML input to prevent XXE attacks (especially when parsing external XML documents)?
    * **LDAP Injection:** If using LDAP queries, are you properly escaping and validating inputs?
    * **Check Input Types and Lengths:**  Enforce specific data types and reasonable length limits on inputs.
* **Tools:** Static analysis tools (e.g., SonarQube, Veracode), manual code review, Penetration Testing.


**II. Broken Authentication (OWASP Top 3 - Critical)**

* **Checklist Items:**
    * **Strong Password Policies:**  Are you enforcing strong password policies (length, complexity, etc.)?
    * **Multi-Factor Authentication (MFA):**  Is MFA implemented for all users, especially those with elevated privileges?
    * **Session Management:**  Are sessions secured with strong, randomly generated IDs? Are sessions expiring correctly after inactivity?  Are you using HTTPOnly and Secure flags on session cookies?
    * **Authentication Mechanisms:** Are you using robust authentication mechanisms (e.g., OAuth, SAML) rather than custom implementations?
    * **Brute-Force Protection:** Are you implementing measures to prevent brute-force attacks (rate limiting, account lockout)?
    * **Password Reset Mechanisms:** Is the password reset mechanism secure (e.g., using tokens, not relying solely on email)?
    * **Insecure Storage of Credentials:**  Are credentials NEVER stored in plain text? (Use secure hashing and salting).
* **Tools:** Security scanning tools (e.g., OWASP ZAP, Burp Suite), Penetration Testing.

**III. Sensitive Data Exposure (OWASP Top 3 - Critical)**

* **Checklist Items:**
    * **Data Classification:**  Have you properly classified data based on sensitivity levels (public, internal, confidential)?
    * **Encryption at Rest:**  Is sensitive data encrypted at rest using appropriate encryption algorithms?
    * **Encryption in Transit:**  Is all sensitive data transmitted over the network encrypted using HTTPS/TLS with strong ciphers?
    * **Tokenization/Masking:** Are you using tokenization or masking techniques for sensitive data when it’s not actively needed?
    * **Data Leak Prevention (DLP):**  Are you implementing DLP measures to prevent sensitive data from leaving your environment?
    * **Logging and Monitoring:** Are logs capturing access to sensitive data being monitored for suspicious
