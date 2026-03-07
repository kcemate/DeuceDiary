# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T21:51:17.335871

Okay, here’s a comprehensive security checklist for launching an Express + React application to production, covering the OWASP Top 10, CSP headers, rate limiting, input sanitization, and auth hardening. This is broken down into categories with detailed checks and recommended actions.

**I. Application Architecture & General Security Practices**

*   **Secure Development Lifecycle (SDLC):** Establish a secure SDLC process, incorporating security reviews, vulnerability scanning, and penetration testing at each stage.
*   **Dependency Management:**
    *   **Maintain Up-to-Date Dependencies:** Regularly update Node.js, React, Express, and all dependencies. Use tools like `npm audit` or `yarn audit` to identify vulnerabilities.
    *   **Vulnerability Scanning:** Implement automated vulnerability scanning tools (e.g., Snyk, SonarQube, Veracode) integrated into your CI/CD pipeline.
    *   **Third-Party Libraries:**  Carefully evaluate the security posture of all third-party libraries. Prioritize libraries with active communities and regular security updates.
*   **Secrets Management:**
    *   **Never Hardcode Secrets:**  Don’t store API keys, database passwords, or other sensitive information directly in your code.
    *   **Environment Variables:** Use environment variables for configuration and secrets.
    *   **Secrets Management Service:** Consider using a dedicated secrets management service like HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault for sensitive data.
*   **Logging & Monitoring:**
    *   **Comprehensive Logging:** Implement detailed logging for all critical actions, errors, and security events.
    *   **Centralized Logging:**  Send logs to a central logging system (e.g., ELK Stack, Splunk) for analysis and alerting.
    *   **Real-Time Monitoring:** Monitor application performance and security metrics in real-time using tools like Datadog, New Relic, or Prometheus.  Set up alerts for suspicious activity.

**II. OWASP Top 10 – Technical Checks**

1.  **Injection (SQL, NoSQL, Command, etc.)**
    *   **Input Validation:** Rigorous input validation on *all* user-supplied data before processing (client-side and server-side).
    *   **Parameterized Queries/Prepared Statements:** Always use parameterized queries or prepared statements to prevent SQL injection.
    *   **NoSQL Injection:**  Validate JSON input carefully to prevent NoSQL injection vulnerabilities.
    *   **Command Injection:** Avoid using shell commands directly with user input. If necessary, use a safe command execution library.

2.  **Broken Authentication**
    *   **Strong Password Policies:** Enforce strong password policies (minimum length, complexity requirements).
    *   **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially administrators.
    *   **Session Management:** Securely manage user sessions using secure cookies (HTTPOnly, Secure flags), and consider session fixation protection.
    *   **Password Reset Mechanisms:** Implement secure password reset mechanisms that prevent brute-force attacks.
    *   **Rate Limiting:**  As described in detail below.

3.  **Sensitive Data Exposure**
    *   **Data Classification:**  Identify and classify all sensitive data (PII, financial data, etc.).
    *   **Encryption:** Encrypt sensitive data at rest and in transit.
    *   **Masking/Redaction:**  Mask or redact sensitive data when displaying it to users.
    *   **Secure Storage:**  Store sensitive data securely, complying with relevant regulations (GDPR, CCPA).

4.  **XML External Entities (XXE)**
    *   **Disable External Entity Processing:** In your Express app, disable XML external entity processing to prevent XX
