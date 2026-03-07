# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T17:52:00.373120

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist covers key performance areas for an Express.js application leveraging PostgreSQL and deployed on Railway, focusing on database, queries, caching, CDN, and compression.  It’s categorized for easier tracking and prioritization.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to pinpoint the queries taking the longest.
    * **Analyze Query Plans:** Use `EXPLAIN ANALYZE` for those slow queries to understand bottlenecks.
    * **Create Indexes:**  Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
        * **Consider Composite Indexes:**  If queries often filter/sort/group on multiple columns, a composite index can be more efficient than individual ones.
        * **Index Types:**  Choose appropriate index types (B-tree, GiST, GIN, BRIN) based on data types and query patterns.
        * **Don't Over-Index:** Too many indexes can slow down writes and increase storage costs. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only retrieve the columns you actually need.
    * **Use `JOIN`s Efficiently:**  Ensure `JOIN` conditions are indexed and optimized. Prefer `INNER JOIN` over `LEFT JOIN` when appropriate.
    * **Limit Results:**  Use `LIMIT` clauses in queries to retrieve only the necessary number of rows.
    * **Optimize `WHERE` Clauses:** Use efficient operators (e.g., `=` instead of `LIKE` where possible).  Avoid functions in `WHERE` clauses if possible; PostgreSQL can't optimize them effectively.
    * **Subqueries:**  Rewrite complex subqueries as `JOIN`s for potential performance improvements.
    * **Avoid `DISTINCT`:**  If possible, avoid `DISTINCT` as it can be inefficient.
    * **Use `WITH` (Common Table Expressions - CTEs):** For complex queries, CTEs can improve readability and sometimes performance.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase to a reasonable percentage of your server’s RAM.
    * **`work_mem`:** Increase to allow more in-memory sorting and hashing.
    * **`effective_cache_size`:** Set to an accurate estimate of your system’s cache size.
    * **`maintenance_work_mem`:** Increase for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **Connection Pooling:**  Use a connection pooler (like `pgbouncer` on Railway) to reduce the overhead of establishing new database connections.
* **[ ] Database Health:**
    * **Regular `VACUUM` & `ANALYZE`:** Maintain database stats and reclaim space. Railway often handles this automatically, but monitor.
    * **Monitor Database Performance:**  Use PostgreSQL’s built-in monitoring tools or third-party tools like pgAdmin or Datadog to identify potential issues.



**II. Express.js Application Optimization**

* **[ ] Code Optimization:**
    * **Efficient Data Handling:** Use appropriate data structures and algorithms.
    * **Minimize Payload:** Only send necessary data in responses (JSON formatting).
    * **Asynchronous Operations:** Use `async/await` for non-blocking operations.
    * **Remove Unused Code:** Eliminate dead code to reduce application size and complexity.
* **[ ] Request Handling:**
    * **Keep Requests Small:** Minimize the number of requests per user interaction.  Combine operations where possible.
