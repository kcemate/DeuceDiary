# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T09:45:21.632377

Okay, here's a comprehensive security checklist covering the OWASP Top 10, designed to help you assess and improve the security posture of your web applications. It's broken down by category and includes considerations for different levels of complexity.

**Important Notes:**

* **This is a starting point:**  Tailor this checklist to your specific application, technology stack, and risk tolerance.
* **Regularly Review:** Security isn’t a one-time fix.  Regularly review and update this checklist as your application evolves and the threat landscape changes.
* **Prioritize:** Not all items have equal weight. Focus on the highest risks first.
* **Documentation:**  Document your findings, remediation steps, and the rationale behind your decisions.

---

**I. Injection (A - High Risk)**

* **Checklist Items:**
    * [ ] **Input Validation:** Are all user inputs (including parameters, cookies, headers, and form data) rigorously validated on both the client-side and server-side?  Use allowlists (defining what *is* allowed) rather than blocklists (trying to define what's *not* allowed).
    * [ ] **Parameterized Queries/Prepared Statements:** Are database queries and stored procedures constructed using parameterized queries or prepared statements to prevent SQL injection? (Crucial!)
    * [ ] **Escaping/Encoding:**  If parameterized queries aren’t possible, is output escaping/encoding performed correctly to prevent cross-site scripting (XSS) and other injection attacks?
    * [ ] **Command Injection:** If your application executes system commands based on user input, is input validation and sanitization extremely robust to prevent command injection?
    * [ ] **No Eval() / Dynamic Code Execution:** Are you absolutely avoiding the use of `eval()` or any other functions that dynamically execute code based on user input?
* **Testing:** Penetration testing, fuzzing, manual code review.


**II. Broken Authentication (B - High Risk)**

* **Checklist Items:**
    * [ ] **Strong Password Policies:** Are strong password policies enforced (length, complexity, expiration)?
    * [ ] **Multi-Factor Authentication (MFA):** Is MFA implemented for all users, especially administrators?
    * [ ] **Secure Password Storage:**  Are passwords stored using strong hashing algorithms (e.g., bcrypt, Argon2) with salt? *Never* store passwords in plaintext.
    * [ ] **Session Management:** Are sessions handled securely? (Session ID generation, expiration, and termination).  Use HTTPOnly and Secure flags for cookies.
    * [ ] **Rate Limiting:** Are login attempts rate-limited to prevent brute-force attacks?
    * [ ] **Account Lockout:** Is account lockout implemented after multiple failed login attempts?
    * [ ] **Federated Identity:** If using federated identity (e.g., OAuth), is the implementation secure and configured correctly?


**III. Sensitive Data Exposure (C - High Risk)**

* **Checklist Items:**
    * [ ] **Data Classification:** Is sensitive data (PII, financial information, etc.) properly classified?
    * [ ] **Encryption in Transit:** Is all sensitive data transmitted over the network encrypted using HTTPS with strong TLS configurations? (Check for weak ciphers or outdated protocols.)
    * [ ] **Encryption at Rest:** Is sensitive data stored at rest encrypted?
    * [ ] **Access Controls:**  Are appropriate access controls (role-based access control - RBAC) in place to restrict access to sensitive data?
    * [ ] **Data Masking/Tokenization:** Are masking or tokenization techniques used to protect sensitive data in non-production environments or when displayed to users?
    * [ ] **Log Monitoring:** Are logs monitored for the exposure of sensitive data
