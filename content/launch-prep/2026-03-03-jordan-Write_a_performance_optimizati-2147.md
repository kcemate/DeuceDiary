# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T21:47:10.285505

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines steps to optimize your Express application's performance when interacting with a PostgreSQL database. It's categorized for clarity and prioritizes impactful changes.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:** This is *the* most important factor.
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to pinpoint slow queries.
    * **Index Columns Frequently Used in WHERE clauses:**  Ensure you have indexes on columns used in your `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for multiple columns frequently used together in queries.
    * **Index Type:** Choose the appropriate index type (B-tree, Hash, GiST, GIN) based on your query patterns. B-tree is a good starting point for most cases.
    * **Regular Index Maintenance:**  `VACUUM` and `ANALYZE` regularly to ensure statistics and index efficiency.  Consider `pg_repack` for larger tables.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Always use `EXPLAIN ANALYZE` on slow queries to understand the query execution plan and identify bottlenecks.
    * **Avoid SELECT *:**  Retrieve only the columns you need.
    * **Optimize JOINs:** Ensure your `JOIN` conditions are properly indexed.  Consider using `INNER JOIN` when appropriate.
    * **Rewrite Complex Queries:** Break down complex queries into smaller, more manageable ones.
    * **Use Prepared Statements:** Prepared statements reuse the query plan for repeated execution, significantly improving performance.
    * **Use LIMIT and OFFSET Carefully:**  `LIMIT` is generally faster than `OFFSET` for pagination. For large datasets, explore alternative pagination strategies (keyset pagination).
    * **Avoid Functions in WHERE Clauses:**  Functions can prevent index usage.  Try to move the function application to the data source if possible.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Adjust this based on your server's RAM.  A good starting point is 25% of RAM.
    * **`work_mem`:** Increase this to allow PostgreSQL to sort and hash data in memory, reducing disk I/O.
    * **`effective_cache_size`:**  Provide an estimate of your server's available memory for caching.
    * **`maintenance_work_mem`:**  Increase this for operations like `VACUUM` and `ANALYZE`.
    * **Connection Pooling:** Use a connection pooler (like PgBouncer or Helios) to reuse database connections and reduce connection overhead.
* **[ ] Data Types:**  Use the most appropriate data types for your columns. Avoid using `TEXT` when `VARCHAR` would be sufficient.


**II. Express Application Optimization**

* **[ ] Connection Pooling (Within Express):**
    * **Use a robust connection pooler:**  Don't reinvent the wheel. Utilize libraries like `pg-pool` or `sequelize` which handle connection pooling automatically.
    * **Configure Pool Size:**  Adjust the pool size based on your application's concurrency needs. Too small leads to queuing, too large wastes resources.
* **[ ] Middleware Optimization:**
    * **Reduce Middleware Layers:** Minimize the number of middleware layers to reduce overhead.
    * **Order Middleware Carefully:**  Put performance-critical middleware (e.g., authentication) closer to the request handling.
    * **Use Lightweight Middleware:** Choose middleware that’s efficient and doesn't introduce unnecessary processing.
* **[ ] Code Efficiency:**
    * **Async/Await:**  Use `async/await` for non-
