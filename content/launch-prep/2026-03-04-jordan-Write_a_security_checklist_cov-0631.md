# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T06:31:04.684840

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable to different application types. It's broken down by vulnerability category and includes checks, recommended actions, and potential tools.

**Important Note:** This is a *checklist*, not a fully automated solution.  It's a starting point. You’ll need to tailor it to your specific application, technologies, and risk tolerance. Regular testing and ongoing monitoring are crucial.

---

**I. Injection (OWASP Top 3 - Critical)**

* **Check 1: Input Validation – All Inputs**
   * **Description:** Verify *all* user inputs (forms, URLs, API calls, database queries, etc.) are validated against expected formats, data types, lengths, and ranges.
   * **Recommended Actions:**
      * Implement strict input validation on the server-side (never solely on the client-side).
      * Use whitelisting (allow only known good characters/values) rather than blacklisting (trying to block bad ones – blacklists are easily bypassed).
      * Escape special characters appropriately for the target environment.
   * **Tools:**  Input validation libraries, regular expressions, static analysis tools.
* **Check 2: SQL Injection**
    * **Description:**  Ensure proper parameterized queries or prepared statements are used to prevent malicious SQL code from being executed.
    * **Recommended Actions:**
       *  *Never* construct SQL queries using string concatenation with user input.
       *  Use database-specific prepared statements or parameterized queries.
       *  Employ an ORM (Object-Relational Mapper) if it provides parameterized query support.
    * **Tools:** Static analysis tools (e.g., SQLMap), database audit tools.
* **Check 3: NoSQL Injection**
    * **Description:**  Similar to SQL injection, but targeting NoSQL databases (MongoDB, Cassandra, etc.).  Validate input rigorously and use parameterized queries.
    * **Recommended Actions:**
        *  Understand the specific query language of your NoSQL database.
        *  Use parameterized queries or native drivers that support escaping.
        *  Limit the privileges of database users to the minimum required.
    * **Tools:**  Static analysis tools that support NoSQL injection, database audit tools.


**II. Authentication (OWASP Top 3 - Critical)**

* **Check 4: Broken Authentication**
    * **Description:**  Weak passwords, predictable usernames, lack of multi-factor authentication (MFA), and exposed session IDs.
    * **Recommended Actions:**
       *  Enforce strong password policies (length, complexity, rotation).
       *  Implement MFA for all users, especially administrators.
       *  Use secure session management techniques (HTTPOnly, Secure flags, session timeouts).
       *  Regularly review and revoke compromised credentials.
    * **Tools:** Password strength testing tools, security auditing tools.

* **Check 5: Vulnerable Components**
   * **Description:** Using outdated, vulnerable libraries or frameworks in your application.
   * **Recommended Actions:**
      *  Keep all software components (libraries, frameworks, operating systems) up-to-date with the latest security patches.
      *  Automate dependency management and scanning.
      *  Establish a vulnerability management process.
   * **Tools:**  Software Composition Analysis (SCA) tools (e.g., Snyk, WhiteSource, Black Duck), vulnerability scanners.



**III. Confidentiality (OWASP Top 3 - High)**

* **Check 6: Sensitive Data Exposure**
    * **Description:** Unprotected storage or transmission of sensitive data (passwords, API keys, PII).
    * **Recommended Actions:**
       *  Encrypt sensitive
