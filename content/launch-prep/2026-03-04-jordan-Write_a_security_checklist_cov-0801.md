# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T08:01:45.460099

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable to different types of applications and systems.  It's broken down by vulnerability category with specific checks and recommendations.

**Important Disclaimer:** This checklist is a starting point.  You *must* tailor it to your specific application, infrastructure, and risk tolerance. Regular testing, code reviews, and security awareness training are crucial.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, NoSQL, Command, etc.)**

* **Check:**
    * **Input Validation:** Are all user-supplied inputs validated *before* they are used in database queries, shell commands, or any other context where they could be interpreted as code? (White listing is preferred over black listing)
    * **Parameterized Queries/Prepared Statements:** Are parameterized queries/prepared statements used consistently for all database interactions?
    * **Stored Procedures:**  If stored procedures are used, are they properly parameterized?
    * **Escaping:** If parameterized queries aren't feasible, is output properly escaped for the specific context? (This is generally discouraged.)
    * **Redacted Data:**  Is data redacted or sanitized when displaying user-provided values in error messages?
* **Tools:** Static analysis tools, dynamic analysis tools (DAST), SQL injection scanners.
* **Severity:** Critical


**2. Broken Authentication**

* **Check:**
    * **Strong Password Policies:** Are strong password policies enforced (length, complexity, rotation)?  Multi-factor authentication (MFA) is strongly recommended.
    * **Session Management:** Are sessions handled securely (HTTPOnly cookies, secure flags, session timeouts, proper session regeneration)?
    * **Authentication Mechanisms:** Are weak or default authentication mechanisms avoided?  Rate limiting on login attempts?
    * **API Authentication:** Do APIs use strong authentication (OAuth 2.0, JWT) and authorization?
    * **User Account Management:**  Are privileged accounts properly managed (least privilege, regular audits)?
* **Tools:**  Vulnerability scanners, penetration testing.
* **Severity:** Critical



**3. Sensitive Data Exposure**

* **Check:**
    * **Data Classification:** Is data properly classified based on sensitivity (public, internal, confidential, etc.)?
    * **Data in Transit:** Is all sensitive data transmitted over HTTPS (TLS/SSL)?  Are strong cipher suites used?
    * **Data at Rest:** Is sensitive data encrypted at rest (database encryption, file system encryption)?
    * **Storage Configuration:**  Are cloud storage buckets configured with proper access controls (e.g., IAM policies)?
    * **Logging:** Are sensitive data logs appropriately secured and monitored?
    * **Temporary Files:** Are temporary files created during processing properly deleted?
* **Tools:**  Security Information and Event Management (SIEM) systems, encryption key management tools.
* **Severity:** Critical


**4. XML External Entities (XXE)**

* **Check:**
    * **Disable External Entity Processing:** Are external entity processing functions (e.g., `xmlize()`, `xxxeval()`) disabled in XML parsers?
    * **Input Validation:** Validate XML input against a schema to ensure it contains only expected elements and attributes.
    * **Content-Security-Policy (CSP):** Use CSP to restrict the sources from which the browser can load external resources.
* **Tools:** Static analysis tools, vulnerability scanners.
* **Severity:** High


**5. Broken Access Control**

* **Check:**
    * **Authentication and Authorization Separation:**  Is there a clear separation between authentication (verifying identity) and authorization (determining access rights)?
    * **Role-Based Access Control (RBAC):**  Is RB
