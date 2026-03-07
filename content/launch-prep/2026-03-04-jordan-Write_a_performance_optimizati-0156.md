# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T01:56:21.422950

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to optimize your Express.js application running against a PostgreSQL database. It’s broken down into categories for clarity and includes actionable steps, along with estimated impact levels (Low, Medium, High).

**I. Database Optimization (PostgreSQL Focused)**

* **[High] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing or inefficient indexes.
    * **Create Indexes Strategically:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for multiple columns.
    * **Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, HASH) based on query patterns.  B-tree is the default and often suitable.
    * **Partial Indexes:** Index only a subset of rows based on a specific condition. Useful for frequently queried subsets.
* **[High] Query Optimization:**
    * **Write Efficient Queries:** Avoid `SELECT *`, use specific columns, and leverage `WHERE` clauses effectively.
    * **Use `JOIN`s Correctly:**  Understand different `JOIN` types (INNER, LEFT, RIGHT) and choose the most appropriate one.  Ensure `JOIN` columns are indexed.
    * **Optimize `WHERE` Clause Order:**  Place the most selective conditions first.
    * **Avoid `LIKE '%...%'`:** These are notoriously slow. Consider full-text search if needed.
    * **Use `LIMIT` Clause:** Limit the number of rows returned to avoid processing unnecessary data.
    * **Subqueries:** Optimize or rewrite subqueries into `JOIN`s where possible.
* **[Medium] Database Configuration:**
    * **`shared_buffers`:** Increase this setting (typically 25-50% of RAM) to improve PostgreSQL's buffer cache.
    * **`work_mem`:**  Increase this setting to allow PostgreSQL to perform more sorting and hashing in memory.
    * **`effective_cache_size`:**  Accurately represent the amount of memory available to PostgreSQL for caching.
    * **`maintenance_work_mem`:** Increase this for tasks like `VACUUM` and `ANALYZE`.
    * **Connection Pool:** Use a connection pooler (like `pgbouncer` or `pg_pool`) to reduce the overhead of establishing and closing database connections.
* **[Low] Regular Maintenance:**
    * **`VACUUM`:** Regularly run `VACUUM` to reclaim dead tuples and improve performance. Consider `VACUUM FULL` cautiously (locks the table).
    * **`ANALYZE`:**  Run `ANALYZE` to update PostgreSQL's statistics, which are used by the query planner.
    * **`pg_stats`:** Use `pg_stats` to investigate statistics and adjust settings if necessary.


**II. Express.js & Middleware Optimization**

* **[High] Connection Pooling:**  Use a robust connection pooler (e.g., `pg-pool`) within your Express app to manage database connections efficiently.  Avoid creating a new connection for each request.
* **[Medium] Middleware Optimization:**
    * **Minimize Middleware Usage:**  Only use middleware that’s truly necessary.  Remove unused middleware.
    * **Order Matters:**  The order of middleware can significantly impact performance. Place heavier middleware later in the chain.
    * **Lazy Loading:**  Load middleware only when it's needed.
* **[Medium] Request Processing:**
    * **Asynchronous Operations:** Use `async/await` to handle database queries and other asynchronous operations correctly, preventing blocking of the event loop.
