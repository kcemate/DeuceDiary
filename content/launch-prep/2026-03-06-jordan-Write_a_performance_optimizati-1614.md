# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-06T16:14:31.216248

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas for optimizing the performance of a web application built with Express.js and PostgreSQL. It's categorized for easier navigation and includes actionable steps.

**I. Express.js Configuration & Best Practices:**

* **[ ] Use a Production-Ready Process Manager (PM2, Forever):**  Ensures your app restarts automatically after crashes, handles load balancing, and provides monitoring.
* **[ ] Logging:** Implement robust logging (Winston, Bunyan) – crucial for debugging performance bottlenecks and identifying unusual patterns. Don't log everything; focus on critical events and slow operations.
* **[ ] Static File Serving:**  Use a dedicated static file server (e.g., Express's `express.static`, Nginx, Apache) to serve static assets (images, CSS, JS) – don't have Express handle them.
* **[ ] Middleware Selection:** Carefully choose and order middleware.  Less overhead, lower latency.
* **[ ]  Keep Dependencies Updated:** Regularly update Express.js, PostgreSQL drivers, and other dependencies to benefit from bug fixes and performance improvements.
* **[ ] Server Configuration:**
    * **[ ] `node: --max-old-space-size`:**  Adjust the maximum heap size for Node.js based on your app's memory needs.  Don't over-allocate.
    * **[ ] `node: --inspect` or Debugger:**  Utilize Node.js's built-in debugger or a remote debugger for profiling and troubleshooting.


**II. PostgreSQL Optimization:**

* **[ ] Indexing:**  *This is the most critical step.*
    * **[ ] Analyze Queries:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify missing indexes.
    * **[ ] Targeted Indexes:** Create indexes *only* on columns used frequently in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **[ ] Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, etc.) based on the data and query patterns. B-tree is generally best for standard lookups.
    * **[ ] Composite Indexes:** Consider composite indexes for queries using multiple columns in `WHERE` clauses.
    * **[ ] Regularly Review & Drop Unused Indexes:** Indexes add overhead during writes.  Remove unused indexes.
* **[ ] Query Optimization:**
    * **[ ] Use `SELECT` Only Necessary Columns:**  Avoid `SELECT *`. Specify exactly what columns you need.
    * **[ ] Optimize `WHERE` Clauses:** Write efficient `WHERE` clauses, avoid using functions in `WHERE` clauses that prevent index usage.
    * **[ ] Utilize `JOIN` Strategies:**  Understand and use the appropriate `JOIN` type (`INNER JOIN`, `LEFT JOIN`, etc.) and ensure proper indexing on joined columns.
    * **[ ] Avoid `LIKE '%...%'` (Leading Wildcards):** This prevents index usage.  Consider full-text search if applicable.
    * **[ ] Prepared Statements:**  Use prepared statements (parameterized queries) to avoid parsing the same query repeatedly.
    * **[ ]  Use `LIMIT` and `OFFSET` Carefully:**  `OFFSET` can be slow for large offsets. Consider "seek-based pagination" if performance is critical.
* **[ ] Database Configuration:**
    * **[ ] `shared_buffers`:** Adjust based on your server's RAM – typically 25-50%.
    * **[ ] `work_mem`:**  Increase this for operations like sorting and hashing, but be mindful of RAM usage.
    * **[ ] `effective_cache_size`:**  Tell the
