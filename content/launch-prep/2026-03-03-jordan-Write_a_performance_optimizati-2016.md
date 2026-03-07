# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T20:16:38.760295

## Performance Optimization Checklist for Express + PostgreSQL

This checklist outlines steps to optimize the performance of your Express.js application interacting with a PostgreSQL database. It's broken down into categories with varying levels of effort.

**I. Database Optimization (PostgreSQL Focus - 70% of Effort)**

* **[High] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` on slow queries to pinpoint missing indexes.
    * **Index the Right Columns:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for complex queries.
    * **Index Types:** Choose the appropriate index type (B-tree, Hash, GiST, GIN) based on your data and query patterns. B-tree is generally the default and best for most scenarios.
    * **Partial Indexes:** If you frequently filter on a specific subset of data, a partial index can significantly improve performance.
* **[High] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you need. Reduces data transfer and memory usage.
    * **Use `LIMIT` and `OFFSET` Carefully:**  For pagination, avoid large offset values. Consider keyset pagination (using `WHERE` clause on the last selected value) for large datasets.
    * **Optimize Joins:**  Ensure proper join conditions, and consider using `INNER JOIN` instead of `LEFT JOIN` when appropriate.
    * **Rewrite Complex Queries:** Break down complex queries into simpler, more manageable ones.  Use Common Table Expressions (CTEs) for readability and potential optimization.
    * **Use `EXISTS` instead of `COUNT(*)` in Subqueries:** `EXISTS` is generally faster when you just need to check if a row exists.
* **[Medium] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Tune this value based on your server's RAM.  A common starting point is 25% of RAM.
    * **`work_mem`:**  Increase this value if you have many queries that perform sorting or hashing operations.
    * **`effective_cache_size`:** Inform PostgreSQL about the amount of memory available for caching.
    * **`maintenance_work_mem`:**  Increase this for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:**  Ensure `autovacuum` is enabled and properly configured to prevent table bloat.  Monitor its effectiveness.
* **[Low] Regular Maintenance:**
    * **`VACUUM`:** Run regular `VACUUM` to reclaim space and update statistics.
    * **`ANALYZE`:** Run `ANALYZE` to update table statistics used by the query planner.

**II. Express.js Application Optimization (30% of Effort)**

* **[High] Connection Pooling:**
    * **Use a Connection Pool:**  Never create a new database connection for each request.  Use a connection pool library (e.g., `pg-pool`, `sequelize`'s connection pooling).
    * **Tune Pool Size:**  Experiment with the pool size based on your application's concurrency and the database server's capacity.
* **[Medium] Asynchronous Operations:**
    * **Always Use `async/await`:**  Ensure all database operations are asynchronous to prevent blocking the event loop.
* **[Medium] Minimize Payload Size:**
    * **Compress Responses:** Use Gzip or Brotli to compress JSON responses.
    * **Selective Data Transfer:**  Only send the data needed by the client.
* **[Low] Code Optimization:**
    * **Efficient Code:**  Write clean, efficient code. Avoid
