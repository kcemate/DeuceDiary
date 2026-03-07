# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T02:41:38.042038

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing your Express.js application using PostgreSQL. It's broken down into categories with actionable steps and considerations.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL is executing your slow queries. Look for missing indexes.
    * **Index Appropriate Columns:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for queries with multiple filters on different columns.
    * **Index Type:**  Choose the appropriate index type (B-tree, Hash, GiST, GIN) based on your query patterns.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Write Efficient SQL:** Craft queries that minimize data scanned.
    * **Use `JOIN`s Correctly:**  Understand different join types (INNER, LEFT, RIGHT) and choose the most appropriate one.
    * **Avoid `SELECT *`:**  Only select the columns you actually need.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `LIKE` Clauses:**  Leading wildcards (`%`) in `LIKE` clauses often prevent index usage.
    * **Use `EXISTS` instead of `COUNT(*)`:**  When you only need to know if a record exists, `EXISTS` is often faster.
    * **Rewrite Subqueries:** Sometimes subqueries can be rewritten as joins for better performance.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:** Tune this based on your server's memory. Typically 25-50% of total RAM.
    * **`work_mem`:**  Controls the amount of memory used by sort operations. Increase if you have many complex sorting queries.
    * **`effective_cache_size`:**  Tells PostgreSQL how much memory is available for caching.
    * **`maintenance_work_mem`:** Used by `VACUUM`, `ANALYZE`, and other maintenance tasks.
    * **`max_connections`:**  Set appropriately for your application's expected load.
    * **Regularly Analyze and Vacuum:** `ANALYZE` updates statistics used for query planning, and `VACUUM` reclaims space and updates statistics. Schedule these tasks.
* **[ ] Data Types:**
    * **Choose Efficient Data Types:** Use the smallest data type that can hold your data. Avoid using `TEXT` for everything.
    * **Use `UUID`s for Primary Keys:** Generally more efficient than large integers.

**II. Express.js Application Optimization**

* **[ ] Route Optimization:**
    * **Minimize Route Handlers:** Keep route handlers concise and focused.
    * **Route Grouping:** Use route groups to simplify and organize your routes.
    * **Avoid Unnecessary Route Parameters:**  Only use parameters that are truly needed.
* **[ ] Middleware Optimization:**
    * **Order Matters:** Arrange middleware in an efficient order (e.g., logging before authentication).
    * **Remove Unused Middleware:**  Eliminate middleware that isn't being used.
    * **Optimize Logging Middleware:**  Be mindful of the logging overhead.
* **[ ] Connection Pooling:**
    * **Use a Connection Pool:**  Establish a connection pool to avoid the overhead of creating and destroying connections for each request. (e.g., `pg-pool`)
* **[ ] Asynchronous Operations
