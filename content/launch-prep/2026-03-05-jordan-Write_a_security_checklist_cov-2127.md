# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-05T21:27:40.342080

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and with actionable steps. This is a starting point – you'll need to adapt it to your specific application and environment.

**Important Note:** This checklist isn't a replacement for a full security assessment. It’s a guide to help you proactively identify and mitigate risks.

---

**I. Application Security (Focus: Code & Development Practices)**

**1. Injection (SQL, Command, etc.) - Severity: High**

* **What it is:** Exploiting vulnerabilities where user-supplied data is directly included into database queries, commands, or other operations.
* **Checklist:**
    * **Input Validation:**  Implement robust input validation on *all* user-supplied data. Use whitelisting (allow only known good inputs) over blacklisting (block known bad inputs).
    * **Parameterized Queries/Prepared Statements:** Always use parameterized queries or prepared statements when interacting with databases. This prevents the database from interpreting user input as code.
    * **Escaping:**  If parameterized queries are not feasible, carefully escape all user input before using it in queries or commands.  Understand the specific escaping rules for your database.
    * **Stored Procedures:** Utilize stored procedures where appropriate, as they can help isolate user input.
    * **Least Privilege:** Database users should have only the necessary permissions.
* **Tools:** Static code analysis tools (e.g., SonarQube), dynamic application security testing (DAST) tools.


**2. Broken Authentication - Severity: High**

* **What it is:** Weaknesses in how applications verify user identities.
* **Checklist:**
    * **Strong Password Policies:** Enforce strong password policies (length, complexity, rotation).
    * **Multi-Factor Authentication (MFA):** Implement MFA whenever possible, especially for privileged accounts.
    * **Session Management:** Secure session management using strong, unpredictable session IDs and proper session timeouts.
    * **Authentication Flow:** Validate the entire authentication flow – from initial login to subsequent requests.
    * **Brute-Force Protection:** Implement rate limiting and account lockout mechanisms to prevent brute-force attacks.
    * **Credential Storage:** Never store passwords in plaintext. Use strong hashing algorithms (e.g., bcrypt, Argon2) with salt.
* **Tools:** Security scanners, penetration testing.


**3. Sensitive Data Exposure - Severity: High**

* **What it is:** Failure to protect sensitive data (PII, credentials, API keys) in transit or at rest.
* **Checklist:**
    * **Data Classification:** Identify and classify sensitive data.
    * **Encryption:** Encrypt sensitive data at rest (databases, files) and in transit (HTTPS, TLS).
    * **Tokenization/Masking:** Replace sensitive data with tokens or masked values where possible.
    * **Access Control:** Restrict access to sensitive data based on the principle of least privilege.
    * **Key Management:** Securely store and manage encryption keys.
* **Tools:**  Vulnerability scanners, security information and event management (SIEM) systems.



**II. Cryptographic Failures & Broken Access Control (Focus:  Permissions & Data Security)**

**4. Cryptographic Failures - Severity: High**

* **What it is:** Using weak or improperly implemented cryptography.
* **Checklist:**
    * **Use Strong Algorithms:**  Use current, robust algorithms (e.g., AES-256, SHA-256).
    * **Proper Key Management:** Securely generate, store, rotate, and manage cryptographic keys.
    * **Correct Implementation:**  Ensure cryptographic algorithms are implemented correctly.  Consult security experts if needed.
    * **
