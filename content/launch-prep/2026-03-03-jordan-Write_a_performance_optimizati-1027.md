# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T10:27:46.540168

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas for performance optimization when building applications using Express (Node.js) and PostgreSQL. It's broken down into categories and provides suggested steps with increasing levels of complexity.

**I.  Database Optimization (PostgreSQL)**

* **[Low Priority] Indexing:**
    * **Identify Slow Queries:** Use `pg_stat_statements` to identify the slowest queries.
    * **Add Indexes:**  Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns.
    * **Index Type:**  Choose the appropriate index type (B-tree, GIN, GiST, etc.) based on your data and query patterns.
    * **Review Existing Indexes:**  Remove unused or redundant indexes. Indexes add overhead to writes.

* **[Medium Priority] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Use `EXPLAIN ANALYZE` to understand query execution plans and identify bottlenecks.
    * **Rewrite Slow Queries:**  Optimize query logic - consider using `JOIN`s instead of subqueries, simplifying `WHERE` clauses.
    * **Avoid `SELECT *`:**  Specify only the columns needed for your application.
    * **Use `LIMIT` judiciously:**  Ensure you're only retrieving the necessary number of rows.
    * **Materialized Views:**  For complex, frequently queried aggregations, consider using materialized views.
    * **Parameterize Queries:**  Always use parameterized queries to prevent SQL injection and improve query caching.

* **[High Priority] Database Configuration:**
    * **Connection Pooling:**  Use a connection pooler (e.g., `pg-pool`) in your Express app to reduce connection establishment overhead.
    * **Memory Allocation:**  Tune PostgreSQL's shared_buffers, work_mem, and other memory-related parameters based on your server's resources and workload.
    * **Log Levels:**  Adjust PostgreSQL's logging levels for debugging and monitoring.
    * **Vacuum and Analyze:** Regularly run `VACUUM` to reclaim dead tuples and `ANALYZE` to update statistics, helping the query planner make better decisions.
    * **pg_cron:** Utilize `pg_cron` for scheduled tasks like vacuuming or running maintenance scripts.


**II.  Express.js Application Optimization**

* **[Low Priority] Code Profiling:**
    * **Node.js Profiler:** Use Node.js's built-in profiler or tools like `clinic.js` to identify performance bottlenecks in your Express app code.

* **[Medium Priority] Request Handling:**
    * **Minimize Middleware:**  Only include necessary middleware. Evaluate the impact of each middleware.
    * **Asynchronous Operations:**  Use `async/await` or Promises for all I/O operations (database queries, file system access, network requests).  Avoid blocking the event loop.
    * **Efficient Routing:**  Use efficient routing configurations and minimize the number of routes.
    * **Caching (Client-Side):** Implement caching on the client-side (e.g., using browser caching) for static assets.

* **[High Priority] Request Handling & Processing:**
    * **Connection Pooling (Express):** Utilize an Express connection pooler (e.g., `pg-pool`) for efficient database connections.
    * **Batch Operations:**  When performing multiple database operations, use batch operations to reduce the number of round trips to the database.  (PostgreSQL’s `COPY` command is excellent for bulk data).
    * **WebSockets:**  If your application involves real-time communication, optimize your WebSocket implementation.
    * **Server-
