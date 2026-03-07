# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T21:04:36.139095

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable for different application types and development stages.  It's broken down by vulnerability category and includes tasks for prevention, detection, and remediation.

**Important Note:** This is a starting point.  You need to tailor this checklist to *your* specific application, technology stack, and risk tolerance.  Regularly review and update it.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, Command, etc.)**

* **Prevention:**
    * **Input Validation & Sanitization:** Implement strict input validation on *all* user-supplied data (form fields, API parameters, cookies, headers, etc.).  Use whitelisting (allow only known good characters/patterns) instead of blacklisting (block known bad characters).
    * **Parameterized Queries/Prepared Statements:** *Always* use parameterized queries or prepared statements for database interactions to prevent SQL injection.  Never build SQL queries using string concatenation.
    * **Escaping:** When parameterized queries are not feasible, use proper escaping functions provided by your database library. (Understand the limitations!)
    * **Least Privilege:** Grant database accounts only the minimum necessary privileges.
    * **Web Application Firewalls (WAFs):** Utilize a WAF to help filter malicious requests.
* **Detection:**
    * **Static Analysis Tools:** Employ SAST tools that specifically check for SQL injection vulnerabilities.
    * **Dynamic Analysis (Penetration Testing):**  Conduct regular penetration tests to simulate attack attempts.
    * **Code Reviews:**  Ensure code reviews specifically focus on input validation and SQL query construction.
* **Remediation:** Immediately fix any identified injection vulnerabilities.  Rollback affected deployments.

**2. Broken Authentication**

* **Prevention:**
    * **Strong Password Policies:** Enforce strong password policies (minimum length, complexity, regular changes).  Consider Multi-Factor Authentication (MFA).
    * **Secure Storage of Credentials:**  *Never* store passwords in plain text. Use strong hashing algorithms (e.g., bcrypt, Argon2) with salting.
    * **Session Management:** Implement secure session management (HTTPOnly, Secure flags, Session timeouts, Session regeneration).
    * **Rate Limiting:** Protect against brute-force attacks by limiting the number of login attempts.
    * **Account Lockout:** Implement account lockout after multiple failed login attempts.
* **Detection:**
    * **Security Audits:**  Regularly review authentication and session management practices.
    * **Log Analysis:** Monitor login attempts (successful and failed) for suspicious activity.
* **Remediation:** Immediately address any vulnerabilities related to weak authentication mechanisms.


**3. Sensitive Data Exposure**

* **Prevention:**
    * **Data Classification:**  Identify and classify sensitive data (PII, financial information, etc.).
    * **Encryption:** Encrypt data at rest (databases, storage) and in transit (HTTPS, TLS). Use strong encryption algorithms.
    * **Tokenization/Masking:** Consider using tokenization or masking for sensitive data in non-production environments.
    * **Access Control:** Implement granular access control to limit access to sensitive data based on the principle of least privilege.
    * **Data Loss Prevention (DLP) Tools:** Implement DLP tools to monitor and prevent sensitive data from leaving the organization.
* **Detection:**
    * **Vulnerability Scanning:** Scan for exposed sensitive data in code repositories and configurations.
    * **Log Monitoring:** Monitor access logs for unauthorized attempts to access sensitive data.
* **Remediation:**  Immediately address any instances of sensitive data being exposed.


**4. XML External Entities (XXE)**

* **Prevention:**
    * **Disable
