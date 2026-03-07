# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T02:30:37.289487

## OWASP Top 10 Security Checklist

This checklist is designed to help you assess your application's security posture against the OWASP Top 10 vulnerabilities. It’s broken down by vulnerability category, with actionable steps and considerations for each.

**Note:** This is a starting point.  The level of detail required will depend on your application's complexity, risk tolerance, and budget.

---

**1. Injection (SQL, Command, OS, LDAP)**

* **Risk:**  Attackers can execute arbitrary code on your server by injecting malicious data into your application.
* **Checklist Items:**
    * [ ] **Parameterization:**  Are all user inputs sanitized and parameterized when interacting with databases, command-line interfaces, or LDAP systems? (Use prepared statements or parameterized queries).
    * [ ] **Input Validation:**  Are all user inputs validated against expected data types, formats, and length restrictions? (Whitelisting is preferred over blacklisting).
    * [ ] **Escaping:** If parameterization isn't possible, is escaping properly implemented and does it cover all possible injection vectors? (This is generally discouraged).
    * [ ] **Stored Procedures:** Are stored procedures used where possible for database interaction to reduce direct access and injection risks?
    * [ ] **Error Handling:** Does your application handle errors gracefully without exposing sensitive information to the user? (Avoid displaying raw error messages).
* **Tools:** Static Analysis Tools, Dynamic Analysis Tools (DAST), Code Review

---

**2. Broken Authentication**

* **Risk:** Weak authentication mechanisms allow attackers to impersonate users and gain unauthorized access.
* **Checklist Items:**
    [ ] **Strong Password Policies:** Are strong password policies enforced (minimum length, complexity, etc.)?
    [ ] **Multi-Factor Authentication (MFA):** Is MFA implemented for all users, especially administrators?
    [ ] **Session Management:** Are session IDs securely generated and managed? (HTTPOnly and Secure flags, session timeouts).
    [ ] **Rate Limiting:**  Is there rate limiting implemented to prevent brute-force attacks?
    [ ] **Password Storage:**  Are passwords stored using a strong hashing algorithm with a salt? (Avoid storing passwords in plain text).
    [ ] **Account Lockout:**  Is account lockout implemented after multiple failed login attempts?
    [ ] **Federated Identity:** Is federated identity (e.g., OAuth, SAML) used securely and appropriately configured?

---

**3. Sensitive Data Exposure**

* **Risk:**  Unprotected sensitive data (PII, credentials, etc.) can be accessed by unauthorized users.
* **Checklist Items:**
    [ ] **Data Classification:**  Is sensitive data identified and classified based on its level of sensitivity?
    [ ] **Encryption:** Is sensitive data encrypted both in transit (TLS/SSL) and at rest (database, file systems)?
    [ ] **Tokenization/Masking:**  Is sensitive data tokenized or masked when displayed to users?
    [ ] **Access Controls:** Are access controls implemented to restrict access to sensitive data based on the principle of least privilege?
    [ ] **Logging & Auditing:**  Are access attempts to sensitive data logged and audited for suspicious activity?
    [ ] **Secrets Management:** Are API keys, database passwords, and other secrets stored and managed securely, preferably using a secrets management system?

---

**4. XML External Entities (XXE)**

* **Risk:** Exploiting vulnerabilities in XML parsers to access local files, internal networks, or execute arbitrary code.
* **Checklist Items:**
    [ ] **Disable External Entities:**  Are external entities disabled in your XML parser configuration? (This is the primary defense).
    [ ] **Input Validation:**  Is all
