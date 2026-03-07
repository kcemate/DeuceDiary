# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T18:48:49.252887

## Express + React Production Launch Security Checklist

This checklist outlines security considerations for launching your Express + React application to production. It's broken down by categories and includes key areas aligned with the OWASP Top 10 and best practices for securing your application.

**I. OWASP Top 10 Considerations**

| Vulnerability         | Mitigation Strategies                                                                                               | Verification Methods                                              |
|-----------------------|--------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| **1. Injection**      | Input sanitization (server-side & client-side), parameterized queries, avoid string concatenation for dynamic queries. | Static analysis, Dynamic analysis (fuzzing), Penetration Testing |
| **2. Broken Authentication** | Multi-Factor Authentication (MFA), Strong Password Policies, Implement proper session management (HTTP-Only, Secure cookies), Regularly review & audit authentication logic. | Code review, Penetration Testing, Security Audits               |
| **3. Sensitive Data Exposure** | Encryption at rest and in transit (HTTPS), Data Masking, Avoid storing sensitive data unnecessarily.                 | Code review, Static Analysis, Dynamic Analysis                     |
| **4. XML External Entities (XXE)**| Disable external entity resolution, Validate XML input rigorously, Use a modern XML parser with built-in protection.      | Static analysis, Dynamic analysis, Penetration Testing         |
| **5. Broken Access Control**| Implement robust role-based access control (RBAC), Validate user permissions at every layer, Utilize the principle of least privilege. | Code review, Penetration Testing, Authorization Testing        |
| **6. Security Misconfiguration**| Harden your server infrastructure, Remove unnecessary features, Regularly patch software vulnerabilities.             | Vulnerability scanning, Configuration reviews, Patch Management  |
| **7. Vulnerable and Outdated Components**| Regularly update all dependencies (Node.js, Express, React, libraries), Implement a dependency vulnerability scanning tool. | Dependency scanning tools (Snyk, Dependabot), Software Composition Analysis (SCA) |
| **8. Identification and Authentication Issues**| Implement robust user identification and authentication mechanisms, Utilize a secure authentication provider.  | Code review, Penetration Testing                               |
| **9. Software and Data Integrity**| Implement checksums and digital signatures for data integrity,  Regularly monitor for changes.                        | Static Analysis, Dynamic Analysis                               |
| **10. Security Logging & Monitoring**| Comprehensive logging of all security events, Real-time monitoring for suspicious activity, Alerting on critical events. | Log analysis, Security Information and Event Management (SIEM) |



**II.  Web Application Security Headers (CSP)**

* **Purpose:**  CSP helps mitigate several attacks like XSS, Clickjacking, and Data Injection.
* **Implementation:**
    * **`Content-Security-Policy` Header:**
        * **`default-src 'self'`:**  Allows loading resources only from the same origin.
        * **`script-src 'self' 'unsafe-inline'` (Carefully Considered):**  Allows JavaScript from the same origin and inline scripts (use sparingly).  Prefer loading scripts from external domains.
        * **`style-src 'self'`:**  Allows loading styles only from the same origin.
        * **`img-src 'self' data:`:**  Allows loading images from the same origin and data URIs (for inline images).
        * **`object-src 'none'`:**  Disables loading plugins like Flash.
        * **`font-src 'self'`:**  Allows loading fonts only from the same origin.
        * **`connect-src 'self'`:**  Restricts network connections to the same origin.
        * **`upgrade-insecure-requests`:**  Forces HTTPS for all requests.
