# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-06T14:35:17.145804

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing your Express.js application that interacts with a PostgreSQL database. It's divided into categories with actionable steps and considerations.

**I. Database Optimization (PostgreSQL Focused)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `EXPLAIN ANALYZE` command to identify queries with high `cost` or `rows` estimations.
    * **Create Indexes:** Add indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns together.
    * **Index Type:** Choose the appropriate index type (B-tree, GiST, GIN, etc.) based on query patterns. GiST and GIN are excellent for specialized types like arrays and JSON.
    * **Partial Indexes:** If you frequently query a specific subset of data based on a column value, use a partial index.
    * **Regularly Review & Maintenance:**  Analyze index usage with `pg_stat_all_indexes` and drop unused or ineffective indexes.

* **[ ] Query Optimization:**
    * **Use `EXPLAIN ANALYZE`:**  Constantly analyze your queries to understand their execution plans and identify bottlenecks.
    * **Write Efficient SQL:**
        * **Avoid `SELECT *`:** Only retrieve the columns you need.
        * **Use `JOIN`s correctly:** Ensure `JOIN` keys are indexed. Optimize join order.
        * **Minimize `DISTINCT` and `ORDER BY`:** These operations can be expensive.
        * **Use `LIMIT`:** Implement pagination effectively to avoid loading large datasets.
        * **Avoid `LIKE` with leading wildcards (`%`):**  These are very slow. Consider alternative search strategies.
        * **Use Common Table Expressions (CTEs) strategically:** Can improve readability and sometimes performance.
        * **Subqueries vs. Joins:**  Evaluate if a subquery can be replaced with an equivalent `JOIN`.
    * **Parameterized Queries:** Use parameterized queries to prevent SQL injection and allow PostgreSQL to cache query plans. (Express uses this automatically with `pg` library).

* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase this value to allow PostgreSQL to cache more data in memory. (Typically 25-50% of RAM).
    * **`work_mem`:**  Increase this to allow PostgreSQL to perform sorting and hashing in memory.
    * **`effective_cache_size`:**  Tell PostgreSQL how much RAM is available for caching.
    * **`maintenance_work_mem`:** Increase this for maintenance operations (e.g., `VACUUM`, `CREATE INDEX`).
    * **`autovacuum`:**  Ensure `autovacuum` is enabled and properly configured to prevent table bloat.
    * **`wal_buffers`:** Increase this for write-intensive applications.

* **[ ] Statistics:**
    * **Regularly Run `ANALYZE`:** This updates PostgreSQL's statistics, which are used to optimize query plans.
    * **`auto_analyze`:**  Make sure this is enabled for automatic statistic updates.



**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**
    * **Use a Connection Pool:** Implement a connection pool (e.g., `pg-pool`) to reuse database connections instead of creating a new one for each request. This drastically reduces connection establishment overhead.

* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:**  Carefully review and remove any middleware that isn't essential.
    * **Optimize Middleware Order:**  Place frequently used middleware earlier
