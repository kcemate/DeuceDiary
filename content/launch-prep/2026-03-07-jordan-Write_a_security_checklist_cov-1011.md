# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T10:11:30.534787

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be used as a starting point for your security assessments. It's broken down by vulnerability category, with checks, recommendations, and considerations.  **This is a high-level checklist; a thorough assessment will require deeper investigation and context-specific implementation.**

**Important Disclaimer:** This checklist is for informational purposes only and should not be considered a substitute for professional security advice.  It's crucial to tailor this checklist to your specific application, environment, and risk tolerance.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, NoSQL, OS, LDAP)**

* **Check:**
    * Are all user inputs validated and sanitized *before* being used in queries or commands? (This includes form data, URL parameters, API input, etc.)
    * Are parameterized queries or prepared statements consistently used to prevent SQL/NoSQL injection?
    * Are appropriate escaping functions used for different database types?
    * Are you using a Web Application Firewall (WAF) to mitigate injection attempts?
    * Are you logging injection attempts for monitoring and investigation?
* **Recommendations:**
    * Implement robust input validation libraries.
    * Embrace stored procedures for complex logic.
    * Utilize ORM (Object-Relational Mapping) tools that inherently prevent injection.
    * Regularly update database drivers and libraries.
* **Considerations:**  The complexity of the application, database types, and the level of user interaction significantly impact the risk.

**2. Broken Authentication**

* **Check:**
    * Are strong passwords enforced (length, complexity, rotation)?
    * Is Multi-Factor Authentication (MFA) implemented for all users, especially administrators?
    * Is session management secure (HTTPOnly, Secure flags, session timeout)?
    * Are default credentials changed immediately?
    * Is password storage done securely using strong hashing algorithms (e.g., bcrypt, Argon2)?
    * Are authentication logs reviewed regularly for anomalies?
* **Recommendations:**
    * Implement password policies and enforcement.
    * Integrate with reputable MFA providers.
    * Regularly review and update authentication configurations.
* **Considerations:** User experience, ease of adoption, and regulatory requirements will influence implementation.


**3. Sensitive Data Exposure**

* **Check:**
    * Is sensitive data (PII, financial data, API keys, etc.) properly protected at rest and in transit?
    * Are data masking or tokenization techniques used when displaying or processing sensitive data?
    * Are encryption keys managed securely (access controls, rotation)?
    * Are storage locations for sensitive data reviewed regularly?
    * Is data retention policy clearly defined and enforced?
* **Recommendations:**
    * Implement encryption for all sensitive data.
    * Use secure storage solutions with appropriate access controls.
    * Regularly review and update data security policies.
* **Considerations:**  The type of data, volume, and regulatory requirements (e.g., GDPR, HIPAA) dictate the level of protection required.

**4. XML External Entities (XXE)**

* **Check:**
    * Is XML parsing disabled or properly configured to prevent XXE attacks? (This is particularly important if you’re processing XML from untrusted sources.)
    * Are XML payloads carefully validated and sanitized before processing?
* **Recommendations:**
    * Disable or restrict XML external entity processing.
    * Implement strict XML validation.
* **Considerations:** XXE vulnerabilities can lead to remote code execution.  This is a common issue in web applications that consume XML feeds.

**5. Broken Access Control**

* **Check:**
    * Are access controls consistently enforced across the entire application? (Authorization checks on every resource access)
