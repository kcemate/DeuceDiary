# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T11:03:17.395302

## OWASP Top 10 Security Checklist

This checklist covers the 10 most critical web application security risks identified by the OWASP (Open Web Application Security Project). It’s designed to be a starting point and should be tailored to your specific application and environment.

**Frequency:** This checklist should be reviewed and updated regularly (at least quarterly) and incorporated into your development and testing processes.

**Sections:**

*   **A. Injection (SQL, XSS, Command, etc.)**
*   **B. Broken Authentication**
*   **C. Sensitive Data Exposure**
*   **D. XML External Entities (XXE)**
*   **E. Broken Access Control**
*   **F. Security Misconfiguration**
*   **G. Cross-Site Scripting (XSS)**
*   **H. Insecure Deserialization**
*   **I. Using Components with Known Vulnerabilities**
*   **J. Insufficient Logging & Monitoring**


---

**A. Injection (SQL, XSS, Command, etc.)**

*   [ ] **Input Validation:**  Are all user inputs validated rigorously on both the client-side and, critically, the server-side? Implement whitelist-based validation.
*   [ ] **Parameterized Queries/Prepared Statements:**  Are you using parameterized queries or prepared statements to prevent SQL injection attacks?
*   [ ] **Output Encoding:** Is all output properly encoded to prevent Cross-Site Scripting (XSS) attacks? (HTML encoding, JavaScript encoding, URL encoding)
*   [ ] **Command Injection Prevention:** Are you carefully sanitizing and validating all user-supplied input that could be used in operating system commands?  Avoid using commands directly.
*   [ ] **Regular Expression Review:**  Are regular expressions used to validate input properly designed and tested for bypass vulnerabilities?



**B. Broken Authentication**

*   [ ] **Strong Password Policies:** Enforce strong password policies including minimum length, complexity, and regular password changes.
*   [ ] **Multi-Factor Authentication (MFA):**  Implement MFA for all users, especially administrators.
*   [ ] **Session Management:**  Implement secure session management including:
    *   Short session timeouts
    *   Secure session identifiers
    *   Regular session renewal
    *   Proper session invalidation on logout
*   [ ] **Brute-Force Protection:**  Implement mechanisms to prevent brute-force attacks (e.g., account lockout, CAPTCHAs).
*   [ ] **Authentication Mechanism Review:** Regularly review your authentication mechanism for vulnerabilities and use industry-standard protocols (e.g., OAuth 2.0, OpenID Connect).


**C. Sensitive Data Exposure**

*   [ ] **Data Classification:** Identify and classify sensitive data based on its impact if compromised.
*   [ ] **Data Encryption:**  Encrypt sensitive data at rest and in transit using strong encryption algorithms.
*   [ ] **Data Masking/Tokenization:** Implement data masking or tokenization for non-production environments and potentially for sensitive data in production.
*   [ ] **Access Controls:**  Restrict access to sensitive data based on the principle of least privilege.
*   [ ] **Secure Configuration:**  Ensure the configuration of your database server and other systems protecting sensitive data are secure.



**D. XML External Entities (XXE)**

*   [ ] **Disable External Entity Processing:**  Ensure that XML external entity processing is disabled in your web application and related systems.
*   [ ] **Input Validation:** Validate XML input to ensure it doesn’t contain malicious entities.
*   [ ] **Context-Aware Processing:** Understand the context of XML parsing and avoid processing data from untrusted sources.



**E. Broken Access Control**

*   [ ] **
