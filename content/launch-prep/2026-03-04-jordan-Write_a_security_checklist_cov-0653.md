# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T06:53:46.295095

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and with suggested checks and considerations. This is a starting point – you'll need to tailor it to your specific application, infrastructure, and business context.

**Important Note:** This checklist isn't a replacement for a full security assessment or penetration test.  It’s designed to guide your awareness, implementation, and ongoing monitoring.

---

**I. Application Security (OWASP Top 10)**

**1. Broken Authentication:**
   * **Check:**
      * **Strong Password Policies:** Enforced minimum length, complexity, and regular password rotation (consider risk vs. usability).
      * **Multi-Factor Authentication (MFA):** Implemented for all critical accounts and sensitive data access.
      * **Session Management:** Secure session IDs, proper session timeout mechanisms, and protection against session hijacking.
      * **Authentication Protocols:**  Using secure authentication protocols (e.g., OAuth 2.0, OpenID Connect) over HTTPS.
      * **Brute-Force Protection:**  Rate limiting, CAPTCHAs, and account lockout mechanisms.
   * **Tools:**  Authentication analysis tools, OWASP ZAP, Burp Suite.

**2. Sensitive Data Exposure:**
   * **Check:**
      * **Data Classification:** Identify and categorize data based on sensitivity (e.g., PII, PHI, PCI).
      * **Data Encryption:**  Data at rest (databases, files) and in transit (HTTPS).
      * **Tokenization/Masking:**  Used for sensitive data where actual values aren’t needed.
      * **Secure Storage:**  Data stored securely, with access controls and monitoring.
      * **Data Loss Prevention (DLP):**  Policies and technologies to prevent unauthorized data exfiltration.
   * **Tools:**  Data classification tools, DLP solutions, encryption key management systems.


**3. Injection:**
   * **Check:**
      * **Input Validation:** Rigorous input validation on *all* user-supplied data – server-side validation is *essential*.
      * **Output Encoding:** Encode all data before displaying it to prevent Cross-Site Scripting (XSS).
      * **Parameterized Queries/Prepared Statements:** Use parameterized queries or prepared statements to prevent SQL injection.
      * **No Dynamic SQL:** Avoid building SQL queries dynamically by concatenating user input.
   * **Tools:** Static analysis security testing (SAST) tools, dynamic analysis security testing (DAST) tools, SQL injection scanners.

**4. Insecure Design:**
   * **Check:**
      * **Threat Modeling:** Conduct thorough threat modeling to identify potential vulnerabilities throughout the application’s lifecycle.
      * **Least Privilege:**  Grant users and processes only the minimum necessary permissions.
      * **Defense in Depth:**  Employ multiple layers of security controls.
      * **Secure Defaults:**  Configure applications with secure defaults.
      * **Regular Security Reviews:**  Include security reviews in all design and development phases.



**II. Infrastructure Security**

**5. Vulnerable and Outdated Components:**
   * **Check:**
      * **Vulnerability Scanning:** Regularly scan servers, applications, and operating systems for known vulnerabilities.
      * **Patch Management:** Implement a robust patch management process to quickly apply security updates.
      * **Software Composition Analysis (SCA):**  Identify and manage open-source component vulnerabilities.
      * **Inventory Management:** Maintain an accurate inventory of all software and hardware.
   * **Tools:** Vulnerability scanners (Nessus, Qualys, Rapid7), SCA tools (Black Duck, Sonatype Nexus Lifecycle).

**6. Cryptographic Failures:**
   * **Check:**
