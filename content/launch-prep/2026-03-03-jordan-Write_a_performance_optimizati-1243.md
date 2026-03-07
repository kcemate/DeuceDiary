# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T12:43:48.596221

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing the performance of your Express.js application interacting with a PostgreSQL database. It's broken down into categories for easier navigation and implementation.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify queries with the highest execution times.
    * **Index Columns Used in WHERE Clauses:** Add indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses. Consider composite indexes for multiple columns.
    * **Analyze Index Usage:** Regularly review your indexes. Are they actually being used? Remove unused indexes as they can slow down writes.
    * **Index Types:** Choose the right index type (B-tree, GiST, GIN, HASH) based on your query patterns.
    * **Partial Indexes:** Create indexes on subsets of your data based on specific criteria.
* **[ ] Query Optimization:**
    * **Use `EXPLAIN ANALYZE`:**  This command is crucial! Understand how PostgreSQL executes your queries. Identify bottlenecks like full table scans, inefficient joins, or missing indexes.
    * **Optimize `JOIN`s:**
        * Ensure `JOIN` columns are properly indexed.
        *  Prefer `INNER JOIN` over `LEFT JOIN` if you don't need all rows from the left table.
        *  Consider using `LATERAL` joins for complex relationships.
    * **Avoid `SELECT *`:** Only select the columns you actually need. Reduces data transfer and memory usage.
    * **Use `LIMIT` and `OFFSET` for Pagination:** Implement efficient pagination mechanisms to avoid loading large datasets unnecessarily.
    * **Write Efficient SQL:**  Avoid using `LIKE '%...%'` (leading wildcards) for large tables - they are very slow.  Consider full-text search if appropriate.
    * **Use Prepared Statements (Parameterized Queries):** This avoids repeated parsing and improves performance and security.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase this setting based on your RAM and PostgreSQL workload. (Typically 25-50% of RAM)
    * **`work_mem`:**  Controls the amount of memory used by internal sort operations.  Increase if you're seeing a lot of disk I/O during sorting.
    * **`effective_cache_size`:**  Helps PostgreSQL estimate how much RAM is available for caching.
    * **`maintenance_work_mem`:**  Controls memory used for maintenance tasks (e.g., `VACUUM`, `ANALYZE`).
    * **`wal_buffers`:**  Affects the amount of memory used for Write-Ahead Logging.
    * **Regularly `VACUUM` and `ANALYZE`:** `VACUUM` reclaims space and optimizes table structure.  `ANALYZE` updates statistics used by the query planner.
* **[ ] Connection Pooling:** Use a connection pooler (like PgBouncer or pgbouncer) to reduce the overhead of establishing new connections.



**II. Express.js Optimization**

* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:**  Carefully evaluate each middleware and remove those that aren't essential.
    * **Order Matters:** Place performance-critical middleware (e.g., authentication) closer to the request path.
    * **Use Efficient Middleware:** Explore optimized middleware packages.
* **[ ] Request Handling:**
    * **Handle Requests Asynchronously:** Utilize `async/await` and Promises to prevent blocking the event loop.
    * **Minimize Logic in Request Handlers:** Keep request handlers concise and focused
