# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T00:45:23.492619

Okay, here’s a comprehensive security checklist covering the OWASP Top 10 vulnerabilities. This is designed to be a starting point, and you’ll need to tailor it to your specific application, technology stack, and risk tolerance.  It's broken down by category for clarity and includes suggested verification methods.

**Important Notes Before You Start:**

* **Risk-Based Approach:** This checklist is extensive. Prioritize based on your application’s business impact, data sensitivity, and attack surface.
* **Regular Testing:** Security is not a one-time fix. Implement regular scanning, penetration testing, and code reviews.
* **DevSecOps:** Integrate security practices throughout the entire development lifecycle.
* **Documentation:** Maintain clear documentation of your security policies, procedures, and findings.

---

**OWASP Top 10 Security Checklist**

**1. Injection (A1)**

* **Description:**  Attackers inject malicious code (SQL, XSS, Command Injection, etc.) into input fields to compromise your application or server.
* **Verification:**
    * **Input Validation:** Implement strict input validation on *all* user-supplied data (client-side and server-side). Use whitelisting (allowing only known good inputs) instead of blacklisting (blocking known bad inputs).
    * **Parameterized Queries/Prepared Statements:**  *Always* use parameterized queries or prepared statements when interacting with databases to prevent SQL injection.
    * **Output Encoding:** Properly encode output to prevent Cross-Site Scripting (XSS) vulnerabilities.
    * **Command Injection Prevention:**  Avoid using user input directly in shell commands. If necessary, use safe alternatives like libraries designed for command execution.
    * **Regular Expression Review:** Carefully audit regular expressions for potential vulnerabilities.
* **Tools:** Static analysis tools, dynamic application security testing (DAST), manual code review.


**2. Broken Authentication (A2)**

* **Description:** Weaknesses in authentication mechanisms allow attackers to impersonate users or gain unauthorized access.
* **Verification:**
    * **Strong Password Policies:** Enforce strong password policies (minimum length, complexity, etc.).
    * **Multi-Factor Authentication (MFA):** Implement MFA for all sensitive accounts.
    * **Secure Session Management:**
        * Use secure cookies (HttpOnly, Secure flags).
        * Implement proper session timeouts.
        * Regenerate session IDs after authentication.
    * **Rate Limiting:**  Limit the number of login attempts to prevent brute-force attacks.
    * **Password Reset Security:**  Secure password reset functionality (e.g., use temporary tokens with expiration).
* **Tools:** Vulnerability scanners, penetration testing.

**3. Sensitive Data Exposure (A3)**

* **Description:** Failure to protect sensitive data (PII, credentials, API keys) in transit and at rest.
* **Verification:**
    * **Data Encryption:** Encrypt sensitive data at rest (databases, backups) and in transit (HTTPS/TLS).
    * **Tokenization/Masking:**  Use tokenization or masking for sensitive data in non-production environments.
    * **Access Controls:** Implement strict access controls to limit who can access sensitive data.
    * **Key Management:** Securely manage cryptographic keys (avoid hardcoding them).
    * **Data Loss Prevention (DLP):** Implement DLP mechanisms to detect and prevent unauthorized data leaks.
* **Tools:** Vulnerability scanners, key management systems, data loss prevention solutions.

**4. Broken Access Control (A4)**

* **Description:**  Problems with access control allow users to access resources they shouldn’t be able to.
* **Verification:**
    * **Principle of Least Privilege:** Users should only have access to the resources they need to perform their jobs.
