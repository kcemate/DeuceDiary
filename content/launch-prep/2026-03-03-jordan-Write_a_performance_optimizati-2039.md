# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T20:39:07.434609

## Performance Optimization Checklist for Express + PostgreSQL

This checklist covers key areas for optimizing performance when using Express.js as a backend and PostgreSQL as your database. It's broken down into categories with increasing levels of complexity and potential impact.

**I. Basic & Quick Wins (Low Effort, High Impact)**

* **[ ] Connection Pooling:**
    * **Ensure a connection pool is configured in Express:** Use a library like `pg-pool` or `node-postgres`'s built-in pooling.  Avoid creating a new connection for every request.
    * **Tune Pool Size:** Experiment with pool size based on your application's concurrency. A good starting point is often 10-20, but monitor and adjust.  Too small limits concurrency, too large can strain the database.
* **[ ] Logging:**
    * **Implement detailed logging:** Log slow queries, errors, and overall request latency. This is critical for identifying bottlenecks. Use a logging library like `winston` or `morgan`.
* **[ ] Client-Side Optimization (Frontend):**
    * **Efficient Data Fetching:** Only request the data needed for the current view. Avoid full page reloads where possible.
    * **Debouncing/Throttling:** Implement debouncing or throttling for event handlers (e.g., search boxes) to limit the number of database queries.
* **[ ] Error Handling:**  Robust error handling prevents unexpected application crashes and log errors gracefully.

**II. Database Optimization (Medium Effort, Significant Impact)**

* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries. Identify missing indexes, full table scans, and other inefficiencies.
    * **Indexing:**
        * **Identify Missing Indexes:** Analyze queries with high latency and missing `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses.
        * **Appropriate Index Types:** Choose the right index type (B-tree, GiST, GIN, etc.) based on your query patterns.
        * **Composite Indexes:**  Create composite indexes for queries that frequently use multiple columns in `WHERE` clauses.
        * **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
    * **Query Rewriting:**
        * **Avoid `SELECT *`:** Specify only the columns you need.
        * **Use `JOIN` Instead of Subqueries:** In many cases, `JOIN` operations are more efficient.
        * **Optimize `WHERE` Clauses:** Use index-friendly comparisons (e.g., `=`, `<`, `>`) instead of functions in `WHERE` clauses.  Avoid `LIKE '%...%'` if possible.
        * **Use `LIMIT`:** Limit the number of rows returned to reduce processing time.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:** Adjust based on your server's RAM. Generally, 25-50% of RAM is a good starting point.
    * **`work_mem`:**  Controls the amount of memory used for sort operations.  Increase if you see a lot of disk-based sorts.
    * **`effective_cache_size`:** Tell PostgreSQL how much RAM is available for caching.
    * **`maintenance_work_mem`:**  Increase for operations like `VACUUM`, `ANALYZE`, and index creation.
* **[ ] Vacuum and Analyze:**
    * **Regularly run `VACUUM`:** Reclaim dead tuples and optimize table space.
    * **Run `ANALYZE`:** Update PostgreSQL's statistics about table data, which is used by the query planner.

**III. Express.js &
