# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T06:45:33.161122

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable for different web applications and development workflows.  It’s broken down by vulnerability, with suggested controls and testing methods.

**Important Disclaimer:** This checklist is a starting point. The specific controls you implement will depend on your application's architecture, complexity, and the risk profile you're targeting.  Regularly review and update this checklist based on your findings and evolving threats.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, XSS, Command, etc.)**

* **Description:**  Attackers inject malicious code into an application, allowing them to execute arbitrary commands, access sensitive data, or compromise the application.
* **Controls:**
    * **Input Validation:**  Strictly validate *all* user-supplied input.  Use whitelisting (allow only known good characters/patterns) instead of blacklisting (block known bad ones).
    * **Parameterized Queries/Prepared Statements:**  Crucial for SQL injection prevention.
    * **Output Encoding:**  Encode output to prevent XSS. Context-aware encoding is vital (HTML, JavaScript, URL).
    * **Principle of Least Privilege:** Grant application processes only the necessary permissions.
    * **Web Application Firewall (WAF):** Can help mitigate some injection attempts.
* **Testing:**
    * **Manual Input Testing:** Try various malicious inputs (SQL syntax, XSS payloads, command injections) in all input fields.
    * **Automated Scanning:** Use vulnerability scanners (e.g., OWASP ZAP, Burp Suite) to automatically identify injection vulnerabilities.
    * **Fuzzing:** Inject random data to identify unexpected behavior.


**2. Broken Authentication**

* **Description:** Weaknesses in authentication and session management allow attackers to impersonate users, gain unauthorized access, or compromise accounts.
* **Controls:**
    * **Strong Password Policies:** Enforce complex passwords, minimum length, and regular password changes.
    * **Multi-Factor Authentication (MFA):** Implement MFA wherever possible.
    * **Secure Session Management:**
        * Use strong session identifiers (long, random).
        * Implement session timeouts.
        * Regenerate session IDs after login.
        * Secure session storage.
    * **Rate Limiting:** Limit login attempts to prevent brute-force attacks.
* **Testing:**
    * **Brute-Force Attacks:** Attempt to log in with common usernames and passwords.
    * **Session ID Manipulation:**  Try to manipulate session identifiers.
    * **Session Fixation:** Attempt to fix a session ID.


**3. Sensitive Data Exposure**

* **Description:**  Unprotected sensitive data (credentials, personal information, API keys) is exposed, leading to breaches and misuse.
* **Controls:**
    * **Data Classification:** Identify and classify sensitive data.
    * **Encryption:** Encrypt sensitive data at rest and in transit.  Use strong encryption algorithms.
    * **Tokenization:** Replace sensitive data with non-sensitive tokens.
    * **Data Masking:** Mask sensitive data when displaying it to users.
    * **Secure Storage:** Store sensitive data securely, with restricted access.
* **Testing:**
    * **Manual Review:**  Inspect application code and configurations for hardcoded secrets (API keys, passwords).
    * **Scanning:** Utilize vulnerability scanners to identify exposed credentials or sensitive data in logs.
    * **Log Auditing:**  Check for logs containing sensitive information.



**4. XML External Entities (XXE)**

* **Description:**  An attacker exploits vulnerabilities in XML parsers to access local files, internal servers, or conduct other attacks.
* **Controls:**
    *
