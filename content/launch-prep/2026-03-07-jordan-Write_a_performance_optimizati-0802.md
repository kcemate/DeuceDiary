# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T08:02:25.187164

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing the performance of a typical Express.js application backed by a PostgreSQL database. It's broken down into categories with suggested actions and considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify missing or inefficient indexes.
    * **Appropriate Indexes:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for queries filtering on multiple columns.
    * **Index Types:**  Choose the right index type (B-tree, Hash, GiST, GIN) based on query patterns. (B-tree is generally the best starting point).
    * **Avoid Over-Indexing:** Too many indexes can slow down writes and consume more storage. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Write Efficient Queries:**
        * Use `SELECT` only the necessary columns. (`SELECT *` is often inefficient).
        * Avoid `SELECT DISTINCT` if not strictly needed.
        * Use `JOIN` instead of subqueries whenever possible.
        * Prefer `INNER JOIN` over `LEFT JOIN` when a match is required.
        * Optimize `WHERE` clauses: Order conditions for efficient index usage, avoid using functions in `WHERE` clauses if possible.
    * **Parameterization:**  Always use parameterized queries to prevent SQL injection and improve performance by allowing the database to cache query plans.
    * **Prepared Statements:**  For frequently executed queries, consider using prepared statements for even faster execution.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Set `shared_buffers` to a reasonable percentage of RAM (typically 25-50%).
    * **`work_mem`:** Adjust `work_mem` based on the complexity of your queries and the size of your data.
    * **`maintenance_work_mem`:** Increase `maintenance_work_mem` (e.g., for `VACUUM` and `ANALYZE`) for faster maintenance operations.
    * **`effective_cache_size`:** Set `effective_cache_size` to a reasonable value based on your server's memory.
    * **Connection Pooling:**  Utilize a connection pooler (like PgBouncer or the built-in PostgreSQL connection pool) to reduce connection overhead.
* **[ ] Database Maintenance:**
    * **`VACUUM`:** Regularly run `VACUUM` to reclaim space and update statistics. Consider `VACUUM FULL` periodically for significant space reclamation (with downtime).
    * **`ANALYZE`:** Run `ANALYZE` to update table statistics used by the query planner.
    * **`OPTIMIZE`:** Consider running `OPTIMIZE` to rebuild tables (especially after significant modifications).
    * **Monitor Database Health:** Track key metrics like CPU usage, disk I/O, and query performance.

**II. Express.js Application Optimization**

* **[ ] Code Optimization:**
    * **Efficient Data Transfer:**  Only transfer the data you need.  Avoid fetching entire objects when only specific fields are required.
    * **Avoid Synchronous Operations:** Use asynchronous operations (Promises, async/await) for database interactions to prevent blocking the event loop.
    * **Caching:** Implement caching at various levels (client-side, server-side) to reduce database load.  Consider Redis or Memcached.
    * **Code Profiling:** Use profiling tools to identify performance bottlenecks in your Express.js code.
* **[ ] Middleware
