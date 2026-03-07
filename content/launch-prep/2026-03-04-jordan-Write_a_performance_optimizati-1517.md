# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T15:17:49.540232

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas to optimize the performance of your Express.js application interacting with a PostgreSQL database. It's broken down into categories with recommendations and potential debugging steps.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` for slow queries to identify missing indexes.
    * **Appropriate Indexes:**  Index columns frequently used in WHERE clauses, JOIN conditions, and ORDER BY clauses.
        * **B-tree Indexes:**  Generally good for equality and range queries.
        * **GIN Indexes:**  Good for full-text search and array/JSON fields.
        * **GiST Indexes:**  Good for geometric data types.
        * **BRIN Indexes:**  Good for large tables with naturally clustered data.
    * **Composite Indexes:**  Consider composite indexes for multiple columns frequently used together.
    * **Avoid Over-Indexing:** Too many indexes can slow down writes and increase storage space. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Write Efficient Queries:**  Avoid `SELECT *` – specify only the required columns.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:** Ensure proper indexing on join columns. Prefer `INNER JOIN`s when appropriate.
    * **Avoid `LIKE '%...%'`:**  These are notoriously slow.  Consider full-text search options instead.
    * **Use `LIMIT` and `OFFSET` Carefully:**  Large offset values can cause performance issues.  Consider using keyset pagination for performance.
    * **Use `EXISTS` instead of `COUNT(*)`:**  When you only need to know if a row exists, `EXISTS` is usually faster.
    * **Review Query Plans:**  Understand how PostgreSQL is executing your queries. Use `EXPLAIN ANALYZE` consistently.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Set this to a reasonable value based on your server's RAM (typically 25-50%).
    * **`work_mem`:**  Increase this if you have large sorts or temporary tables.
    * **`maintenance_work_mem`:**  Increase this for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Let PostgreSQL know how much RAM is available for caching.
    * **`wal_level`:**  Set to `replica` or `logical` for replication and logical decoding.
    * **Monitor and Tune Regularly:**  Use PostgreSQL's monitoring tools (pg_stat_statements, pg_top, etc.) to identify bottlenecks.
* **[ ] Data Types:**
    * **Choose the Right Data Types:**  Use the most efficient data types for your data.
    * **Avoid Large Text Fields:**  If possible, break down large text fields into smaller, related fields.



**II. Express.js Optimization**

* **[ ] Connection Pooling:**
    * **Use a Pool:**  Always use a connection pool (e.g., `pg-pool`, `sequelize`).  Creating and destroying connections is expensive.
    * **Tune Pool Size:**  Adjust the pool size based on your application's concurrency needs. Start with 10-20 and monitor.
* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:**  Every middleware adds overhead.  Remove any that aren't essential.
    * **Optimize Popular Middleware:**  Carefully examine popular middleware like `body-parser` for performance impacts.  Consider alternative libraries.
