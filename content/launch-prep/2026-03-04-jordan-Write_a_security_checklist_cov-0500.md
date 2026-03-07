# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T05:00:22.943179

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the OWASP Top 10 vulnerabilities and provides a framework for assessing your application’s security posture. It’s categorized by vulnerability and includes practical steps to mitigate the risk.

**Note:** This is a starting point. Tailor this checklist to your specific application, technology stack, and business context. Regularly update and refine your approach.

**1. Injection (SQL, Command, XSS)**

* **Description:** Attackers inject malicious code into an application, often through user input, to execute unintended commands or access sensitive data.
* **Checklist Items:**
    * [ ] **Input Validation:** Implement robust input validation on all data entering the application. Use whitelisting (allowing only known good input) rather than blacklisting.
    * [ ] **Parameterized Queries/Prepared Statements:** Utilize parameterized queries or prepared statements for database interactions to prevent SQL injection.
    * [ ] **Escaping Output:** Properly escape output to prevent Cross-Site Scripting (XSS) attacks. Use context-aware escaping for different output types (HTML, JavaScript, URL).
    * [ ] **Stored Procedures:**  Where feasible, utilize stored procedures for data access, as they can help mitigate SQL injection risks.
    * [ ] **Regular Security Audits:** Conduct regular code reviews and penetration testing to identify injection vulnerabilities.
* **Tools:** Static code analysis tools (e.g., SonarQube, Fortify), Dynamic Application Security Testing (DAST) tools (e.g., OWASP ZAP, Burp Suite).


**2. Broken Authentication**

* **Description:** Weak authentication mechanisms allow attackers to impersonate users and gain unauthorized access.
* **Checklist Items:**
    [ ] **Strong Password Policies:** Enforce strong password requirements (length, complexity, entropy).
    [ ] **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially those with privileged access.
    [ ] **Secure Password Storage:** Hash passwords using strong hashing algorithms (e.g., bcrypt, Argon2) with salting.
    [ ] **Session Management:** Implement secure session management practices:
        * [ ] Use HTTPS for all sessions.
        * [ ] Regenerate session IDs after login.
        * [ ] Set appropriate session timeouts.
        * [ ] Properly invalidate sessions on logout.
    [ ] **Rate Limiting:** Implement rate limiting to prevent brute-force attacks on login forms.
* **Tools:** Vulnerability scanners, penetration testing tools.



**3. Sensitive Data Exposure**

* **Description:** Sensitive data (credentials, personal information, API keys) is stored insecurely, transmitted without encryption, or accessible to unauthorized users.
* **Checklist Items:**
    [ ] **Data Classification:** Identify and classify sensitive data.
    [ ] **Encryption at Rest:** Encrypt sensitive data stored in databases, files, and backups.
    [ ] **Encryption in Transit:** Use HTTPS for all communication channels.
    [ ] **Tokenization/Masking:** Replace sensitive data with tokens or masks when displaying or processing it.
    [ ] **Access Control:** Implement strict access control policies based on the principle of least privilege.
    [ ] **Secrets Management:** Use a secure secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager) to store and manage sensitive credentials.
* **Tools:** Static code analysis, vulnerability scanners.


**4. Broken Access Control**

* **Description:** Inadequate access control mechanisms allow users to access resources they shouldn’t, leading to data breaches or unauthorized actions.
* **Checklist Items:**
    [ ] **Role-Based Access Control (RBAC):** Implement RBAC to define user permissions based on roles.
    [ ] **Least
