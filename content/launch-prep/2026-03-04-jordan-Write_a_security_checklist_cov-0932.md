# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T09:32:27.602283

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be used for assessing and improving your web application's security posture. This is a starting point – tailor it to your specific application and environment.

**Important Note:** This checklist is meant for general guidance.  It’s not a substitute for a full penetration test or security audit conducted by experienced professionals.

**OWASP Top 10 Security Checklist**

**1. Injection (A1, A2, A3)**
   * **Description:** Attackers inject malicious code (SQL, XSS, Command Injection, etc.) into an application, taking control of the server or manipulating data.
   * **Checklist Items:**
      * **Input Validation:**  Are *all* user inputs rigorously validated on both the client-side (for immediate feedback) *and* server-side (for security)?  Include whitelisting (allowing only known good characters/patterns) over blacklisting.
      * **Parameterized Queries/Prepared Statements (SQL):** Are you consistently using parameterized queries or prepared statements to prevent SQL injection? (Crucial)
      * **Output Encoding/Escaping:** Are you encoding/escaping data before displaying it in the browser (XSS prevention)? Is this done consistently?
      * **Command Injection:** Are you sanitizing and escaping any data used in shell commands? (Rare, but devastating if present)
      * **API Input Validation:**  If using APIs, are they validating all inputs according to their documentation?
      * **Error Handling:** Are error messages revealing sensitive information (database schemas, internal paths)?  Use generic error messages to the user.

**2. Broken Authentication (A7)**
   * **Description:** Weak or poorly implemented authentication mechanisms allow attackers to impersonate users.
   * **Checklist Items:**
      * **Strong Password Policies:** Are you enforcing strong password policies (length, complexity, rotation)?
      * **Multi-Factor Authentication (MFA):**  Is MFA implemented for all users (especially administrators)?
      * **Session Management:**  Are session IDs generated securely (cryptographically random)? Are sessions invalidated upon logout or inactivity? Is session fixation protected?
      * **Brute-Force Protection:** Are you implementing rate limiting and account lockout mechanisms to prevent brute-force attacks?
      * **Authentication Protocols:** Are you using strong authentication protocols like OAuth 2.0 or OpenID Connect when possible? (Especially for third-party integrations)
      * **Password Reset:** Is the password reset process secure and resistant to manipulation?

**3. Sensitive Data Exposure (A7, A8)**
   * **Description:**  Failure to properly protect sensitive data (PII, credentials, etc.) both in transit and at rest.
   * **Checklist Items:**
      * **Data Classification:**  Have you classified the sensitivity of data you're handling?
      * **Encryption in Transit (TLS/SSL):**  Is all communication between the client and server encrypted using TLS/SSL? (Verify proper configuration – no weak ciphers)
      * **Encryption at Rest:**  Is sensitive data encrypted when stored? (Databases, file systems, backups)
      * **Secure Storage:**  Are credentials and other secrets stored securely (e.g., using a secrets manager like HashiCorp Vault, AWS Secrets Manager)?  *Never* hardcode credentials in your code.
      * **Data Masking/Redaction:**  Are you masking or redacting sensitive data when it's not needed in its entirety?
      * **Regular Security Audits:** Are you conducting regular audits to ensure data protection controls are effective?


**4. XML External Entities (XXE) (A5)**
   * **Description:** Exploits vulnerabilities in XML parsers
