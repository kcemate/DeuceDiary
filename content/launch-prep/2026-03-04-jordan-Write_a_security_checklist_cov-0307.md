# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T03:07:02.563468

## OWASP Top 10 Security Checklist

This checklist covers the key vulnerabilities identified in the OWASP Top 10, categorized by application type and providing actionable steps for mitigation. This is a starting point; tailor it to your specific application and environment.

**I. A. Injection (30% of vulnerabilities)**

* **Description:** Exploits vulnerabilities in applications that process user input without proper sanitization, allowing attackers to inject malicious code.
* **Checklist:**
    * **Input Validation:** Are all user inputs validated on both client-side and server-side? (Strongly recommended)
    * **Parameterized Queries/Prepared Statements:** Are parameterized queries or prepared statements used for database interactions to prevent SQL injection? (Essential)
    * **Output Encoding:** Is output properly encoded to prevent Cross-Site Scripting (XSS) vulnerabilities related to injection? (Essential)
    * **Error Handling:** Are error messages generic and not revealing sensitive information about the application’s internals? (Recommended)
    * **Regular Expression Usage:** Are regular expressions used correctly and efficiently, avoiding potential vulnerabilities like ReDoS (Regular Expression Denial of Service)? (Optional - requires expertise)
* **Tools:** Static Analysis Tools, Dynamic Analysis Tools, Security Scanners.


**II. B. Broken Authentication (29% of vulnerabilities)**

* **Description:** Weak or misconfigured authentication mechanisms leading to unauthorized access.
* **Checklist:**
    * **Strong Password Policies:** Are strong password policies enforced (length, complexity, rotation)? (Essential)
    * **Multi-Factor Authentication (MFA):**  Is MFA implemented for all user accounts, especially privileged accounts? (Essential)
    * **Session Management:** Are session IDs securely generated, transmitted, and invalidated upon logout? (Essential)
    * **Brute Force Protection:**  Are mechanisms in place to prevent brute-force attacks against login forms? (Essential)
    * **API Authentication:** Are APIs secured with proper authentication methods (e.g., API keys, OAuth)? (Essential)
    * **Password Reset Mechanisms:** Are password reset mechanisms secure and prevent unauthorized account takeover? (Essential)
* **Tools:** Penetration Testing, Vulnerability Scanners.



**III. C. Sensitive Data Exposure (23% of vulnerabilities)**

* **Description:**  Failure to protect sensitive data, including personally identifiable information (PII) and secrets.
* **Checklist:**
    * **Data Classification:** Is sensitive data classified based on its risk level? (Essential)
    * **Encryption at Rest:** Is sensitive data encrypted when stored? (Essential)
    * **Encryption in Transit:** Is sensitive data encrypted when transmitted over networks? (Essential – TLS 1.2 or higher)
    * **Data Masking/Tokenization:** Are sensitive data masked or tokenized in non-production environments? (Recommended)
    * **Secrets Management:**  Are secrets (passwords, API keys, etc.) securely stored and managed, not hardcoded in the application? (Essential – Use a secrets management system like HashiCorp Vault, AWS Secrets Manager, Azure Key Vault)
    * **Logging and Monitoring:**  Are sensitive data access events logged and monitored for anomalies? (Essential)
* **Tools:** Data Loss Prevention (DLP) tools, Encryption tools, Secrets Management Systems.



**IV. D. XML External Entities (XXE) (13% of vulnerabilities)**

* **Description:** Exploits vulnerabilities in XML parsers that allow attackers to read local files, execute code, or deny service.
* **Checklist:**
    * **Disable External Entities:** Ensure XML parsers are configured to disable the processing of external entities (recommended).
    * **Input Validation:**  Validate XML input rigorously to prevent malicious content.
    * **Update XML Parsers
