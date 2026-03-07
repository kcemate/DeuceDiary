# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T06:05:33.762998

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider when optimizing your Express.js application running against a PostgreSQL database. It's broken down into categories with actionable steps.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to pinpoint queries with poor performance.
    * **Create Appropriate Indexes:** Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries involving multiple columns.
    * **Index Types:** Evaluate different index types (B-tree, GiST, GIN, BRIN) based on your query patterns. B-tree is generally good for most cases.
    * **Avoid Over-Indexing:** Too many indexes can slow down writes and increase storage needs.
* **[ ] Query Optimization:**
    * **Write Efficient Queries:**  Review your SQL queries - use `SELECT` only the necessary columns (`SELECT *`) and limit the data returned with `LIMIT`.
    * **Use `EXISTS` instead of `COUNT(*)`:** When checking for existence, `EXISTS` is generally faster.
    * **Avoid `LIKE` with leading wildcards (`%`)**: These prevent index usage.  Consider full-text search if needed.
    * **Use `JOIN`s instead of Subqueries:**  Often, `JOIN`s are more performant than correlated subqueries.
    * **Analyze and Vacuum Regularly:**  Run `ANALYZE` to update statistics used by the query planner. Run `VACUUM` to reclaim dead tuples and improve performance. Consider `VACUUM FULL` with caution (locks the table).
* **[ ] Schema Design:**
    * **Normalization:** Properly normalize your database schema to reduce data redundancy and improve data integrity.
    * **Data Types:** Choose the most appropriate data types for your columns (e.g., `INTEGER` instead of `VARCHAR` for IDs).
    * **Large Text Fields:** Consider using `TEXT` instead of `VARCHAR` for large text fields.
* **[ ] Configuration:**
    * **`shared_buffers`:**  Adjust the `shared_buffers` setting to allocate enough memory for PostgreSQL's cache.  Generally, 25% of system RAM is a good starting point.
    * **`work_mem`:**  Increase `work_mem` if you have queries performing significant in-memory sorting or hashing.
    * **`effective_cache_size`:**  Set this parameter accurately to help the query planner make better decisions.
    * **Connection Pooler:** Use a connection pooler (e.g., pgpool-II, Toolbox) to minimize the overhead of establishing new connections.
* **[ ] Monitoring:**
    * **PostgreSQL Monitoring Tools:** Use tools like pgAdmin, pg_stat_statements, or Datadog to monitor query performance, identify bottlenecks, and track database health.


**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**
    * **Implement a Connection Pool:** Use a library like `pg-pool` or `node-postgres` with connection pooling to reuse database connections.  Avoid creating new connections for every request.
* **[ ] Asynchronous Operations:**
    * **Use `async/await` or Promises:** Ensure all database operations are performed asynchronously to avoid blocking the event loop.
* **[ ] Request Body Parsing:**
    * **`express.json()` Middleware:**  Use `express.json()` middleware to parse JSON request bodies efficiently.
* **[ ] Response Headers:**
    * **Optimize Response Size:** Minimize the size of JSON responses by only
