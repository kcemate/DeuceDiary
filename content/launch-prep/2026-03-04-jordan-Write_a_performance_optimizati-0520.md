# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T05:20:13.721284

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing the performance of an Express.js application using PostgreSQL. It's broken down into categories with suggested actions and considerations.

**I. Database Optimization (PostgreSQL Focused)**

* **[ ] Indexing:** This is *critical*.
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify the queries causing the most bottlenecks.
    * **Analyze Columns Used in WHERE Clauses:**  Create indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries filtering on multiple columns.
    * **Index Types:** Choose the correct index type (B-tree, Hash, GiST, GIN) based on your query patterns. B-tree is the default and generally a good starting point.
    * **Index Size:** Monitor index size – overly large indexes can slow down writes.
    * **Regular Index Maintenance:**  Run `VACUUM` and `ANALYZE` regularly to keep indexes efficient and statistics up-to-date.  Consider `pg_repack` for large-scale index rebuilding.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL is executing your queries.  Identify potential bottlenecks like full table scans.
    * **Rewrite Slow Queries:**  Simplify queries, avoid using `SELECT *` (only retrieve needed columns), and optimize joins.
    * **Use `JOIN` Correctly:**  Ensure joins are efficient.  Prefer `INNER JOIN` over `LEFT JOIN` if possible.
    * **Avoid Correlated Subqueries:**  Correlated subqueries are often slow. Try to rewrite them using `JOIN`s.
    * **Use `LIMIT` and `OFFSET` for Pagination:**  Implement proper pagination with `LIMIT` and `OFFSET` to avoid loading large datasets at once.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Increase this value if you have sufficient RAM.  It controls how much memory PostgreSQL uses for caching. (Generally 25-50% of RAM)
    * **`work_mem`:**  Increase this value for operations like sorting and hashing.  (Depends heavily on the application)
    * **`effective_cache_size`:**  Let PostgreSQL know how much RAM is available for caching.
    * **`maintenance_work_mem`:**  Increase this value for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **Connection Pooling:** Use a connection pooler (like pgpool-II or Connection Pool) to reduce the overhead of establishing new connections.
* **[ ] Data Types:**
    * **Use Appropriate Data Types:**  Choose the most appropriate data type for each column to minimize storage space and improve performance.  Don't use `TEXT` when `VARCHAR` would suffice.
    * **Consider `JSONB`:** If storing JSON data, `JSONB` is generally more efficient than `JSON` as it's stored in a binary format.



**II. Express.js Application Optimization**

* **[ ] Connection Pooling (Express):**  Implement connection pooling within your Express application to reuse existing database connections. Libraries like `pg` and `sequelize` provide built-in connection pooling.
* **[ ] Middleware Optimization:**
    * **Minimize Middleware:**  Only include essential middleware.
    * **Efficient Middleware:** Optimize the logic within your middleware functions.  Avoid expensive operations within middleware.
* **[ ] Request Handling:**
    * **Efficient Route Handlers:**  Ensure route handlers are concise and perform only necessary tasks.
