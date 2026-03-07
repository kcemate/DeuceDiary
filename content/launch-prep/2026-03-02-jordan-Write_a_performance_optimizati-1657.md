# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T16:57:41.370346

## Performance Optimization Checklist: Express.js + PostgreSQL App on Railway

This checklist focuses on optimizing your Express.js application using PostgreSQL when deployed on Railway. It’s broken down into key areas with actionable steps and considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use logging and monitoring (Railway Monitor is a good start) to pinpoint queries with high execution times.
    * **Analyze Query Plans:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL is executing your queries. This reveals missing indexes and inefficient joins.
    * **Create Indexes Strategically:**
        * Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
        * Consider composite indexes for queries involving multiple columns.
        * Beware of over-indexing – too many indexes can slow down writes.
        * Regularly review and drop unused indexes.
    * **Index Types:**  Choose the right index type (B-tree, Hash, GiST, GIN) based on your data and query patterns. B-tree is generally a safe starting point.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Always specify the columns you need.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:** Ensure `JOIN` columns are indexed and have compatible data types.  Understand different join types and their impact.
    * **Avoid `LIKE '%string%'`:** This is notoriously slow. Consider alternative search methods (full-text search, indexing specific prefixes).
    * **Use `LIMIT` Clauses:**  Especially in API endpoints.
    * **Use Prepared Statements/Parameterized Queries:**  This prevents SQL injection and can improve performance by reusing execution plans. Express.js libraries typically handle this.
    * **Analyze Query Execution:** Regularly review your PostgreSQL logs and metrics (Railway Monitor) for slow-running queries.
* **[ ] PostgreSQL Configuration:**
    * **Connection Pool:**  Utilize a connection pool in your Express.js app to minimize connection overhead. Railway supports connection pooling.
    * **`shared_buffers`:**  Tune PostgreSQL’s `shared_buffers` setting to optimize memory usage for caching.
    * **`work_mem`:** Adjust `work_mem` to improve performance of sorting and hashing operations.
    * **`effective_cache_size`:**  Help PostgreSQL estimate memory available for caching.
    * **Regular Maintenance:** Run `VACUUM` and `ANALYZE` regularly to maintain index statistics and optimize data storage. Railway typically handles some maintenance tasks.


**II. Express.js Application Optimization**

* **[ ] Code Efficiency:**
    * **Minimize Middleware:** Only use middleware you truly need.
    * **Efficient Route Handling:**  Use asynchronous route handlers (`async/await`) for non-blocking I/O operations.
    * **Avoid Synchronous Operations:**  Whenever possible, use asynchronous versions of functions.
    * **Code Profiling:**  Use tools to identify performance bottlenecks in your code.
* **[ ] Request Limiting & Rate Limiting:** Implement rate limiting to protect your application from abuse and overload. Railway offers built-in rate limiting.
* **[ ] Error Handling:**  Robust error handling prevents crashes and provides helpful debugging information.
* **[ ] Logging:** Implement comprehensive logging to track requests, errors, and performance metrics.

**III. Caching**

* **[ ] Browser Caching:**  Configure appropriate HTTP headers (e.g., `Cache-Control`, `Expires`) to enable browser caching of static assets. Railway handles this by default.
* **[ ] Server-Side Caching
