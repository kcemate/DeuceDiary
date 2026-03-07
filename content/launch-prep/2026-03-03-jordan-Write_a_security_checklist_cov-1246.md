# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T12:46:42.537625

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and with actionable steps. This is a starting point; you'll need to tailor it to your specific application, technology stack, and risk tolerance.

**Important Disclaimer:** This checklist is a guide.  A thorough security assessment requires expert consultation and continuous monitoring.

---

**I.  Application Security (Overall Assessment)**

* **Frequency of Testing:** Implement regular penetration testing (at least annually) and vulnerability scanning (monthly or more frequently).
* **Secure Development Lifecycle (SDLC):** Integrate security into every stage of development (design, coding, testing, deployment, and maintenance).
* **Security Training:** Provide comprehensive security training to all developers, operations staff, and anyone involved in the application's lifecycle.
* **Change Management:** Implement a robust change management process that includes security reviews for all changes.
* **Incident Response Plan:**  Develop and regularly test an incident response plan to handle security breaches effectively.


**II. OWASP Top 10 Vulnerabilities - Checklist**

**1. Broken Access Control (Critical)**

* **Check:**
    * Are authentication and authorization mechanisms properly implemented?
    * Are roles and permissions correctly defined and enforced?
    * Are all sensitive resources properly protected?
    * Are there any exposed API endpoints without proper authorization?
    * Are default credentials ever used?
* **Actions:**
    * Implement strong authentication (Multi-Factor Authentication - MFA is highly recommended).
    * Use the principle of least privilege – users should only have access to what they need.
    * Implement robust access control policies.
    * Regularly review and update access control configurations.
    * Enforce input validation rigorously to prevent injection attacks that could bypass access controls.



**2. Injection (Critical)**

* **Check:**
    * Is user input validated and sanitized before being used in database queries, system commands, or other sensitive operations? (SQL Injection, Command Injection, XSS, etc.)
    * Are stored procedures used instead of raw SQL queries where possible?
* **Actions:**
    * **Input Validation:** Implement strict input validation on all user-supplied data.  Whitelist allowed characters/patterns instead of blacklisting.
    * **Output Encoding:** Encode data before displaying it to users to prevent XSS.
    * **Parameterized Queries/Prepared Statements:**  Always use parameterized queries/prepared statements to prevent SQL Injection.
    * **Command Injection Prevention:**  Avoid using shell commands directly with user input. If necessary, use safe alternatives or carefully sanitize the input.


**3. Cryptographic Failures (High)**

* **Check:**
    * Are sensitive data (passwords, API keys, etc.) stored securely (hashed and salted)?
    * Are strong encryption algorithms used for data transmission (TLS/SSL) and storage?
    * Is cryptographic key management properly handled?  (Rotation, storage, access controls)
* **Actions:**
    * Use strong, modern cryptographic algorithms (e.g., AES-256, SHA-256).
    * Implement robust key management practices.
    * Regularly rotate cryptographic keys.
    * Securely store cryptographic keys (hardware security modules - HSMs are ideal).
    * Enforce TLS/SSL for all data in transit.

**4. Insecure Design (High)**

* **Check:**
    * Does the application architecture incorporate security best practices?
    * Are dependencies regularly updated to address vulnerabilities?
    * Are design patterns used that promote security (e.g., Separation of Concerns)?
    * Is there a vulnerability assessment conducted during the design phase?
* **Actions:**
    * Conduct threat modeling to identify potential vulnerabilities.
    * Use secure design patterns.
