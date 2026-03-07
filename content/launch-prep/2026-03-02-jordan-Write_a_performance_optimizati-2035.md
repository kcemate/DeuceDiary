# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T20:35:21.223181

## Performance Optimization Checklist: Express.js + PostgreSQL App on Railway

This checklist outlines key areas for performance optimization when launching an Express.js app with a PostgreSQL database on Railway. It’s broken down into categories with specific actions to take.

**I. Database Optimization (PostgreSQL)**

* **[ ] Database Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's logging and monitoring tools (pg_stat_statements, pgAdmin) to identify queries with high execution times or frequent executions.
    * **Create Indexes Strategically:** Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Don't over-index – each index adds overhead to writes.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns in the same clause.
    * **Index Types:** Understand the different PostgreSQL index types (B-tree, Hash, GiST, GIN) and choose the most appropriate based on your query patterns. B-tree is typically a good starting point.
    * **Regular Index Maintenance:**  Schedule regular index rebuilds (using `REINDEX`) to ensure index efficiency.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` before deploying to understand the query execution plan and identify bottlenecks.
    * **Optimize SQL Queries:**
        * **Avoid `SELECT *`:**  Specify only the necessary columns.
        * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
        * **Avoid `LIKE '%pattern%'`:**  Leading wildcards in `LIKE` clauses are extremely slow. Consider full-text search if appropriate.
        * **Optimize JOINs:** Ensure join columns have appropriate indexes. Use the most efficient join type (INNER, LEFT, RIGHT).
        * **Limit Results:** Use `LIMIT` clauses to restrict the number of returned rows, especially in early iterations.
        * **Use Prepared Statements:**  Prepared statements can improve performance by reducing parsing overhead for frequently executed queries.
    * **Database Statistics:** Ensure PostgreSQL has accurate statistics for query planning. Regularly run `ANALYZE` and `VACUUM` on the database.
* **[ ] Database Configuration:**
    * **Connection Pooling:** Railway typically handles connection pooling, but verify it’s configured appropriately for your app’s concurrency needs.
    * **PostgreSQL Configuration:** Review PostgreSQL configuration settings (e.g., `shared_buffers`, `work_mem`, `effective_cache_size`) for your Railway instance to optimize resource usage.  Consult Railway's documentation for specific settings.


**II. Express.js Application Optimization**

* **[ ] Code Optimization:**
    * **Efficient Routing:** Design clean and efficient routes. Avoid deeply nested routes.
    * **Minimize Middleware Usage:** Only use middleware necessary for functionality.
    * **Asynchronous Operations:** Use `async/await` or Promises for asynchronous operations to avoid blocking the event loop.
    * **Reduce Payload Size:**  Optimize data serialization (e.g., JSON) to minimize the size of transferred data.
* **[ ] Connection Management:**
    * **Proper Error Handling:** Implement robust error handling to prevent unhandled exceptions from crashing the server.
* **[ ] Logging:** Use appropriate logging levels to track performance issues without overwhelming the logs.


**III. Caching**

* **[ ] Browser Caching:**  Configure appropriate HTTP headers (e.g., `Cache-Control`, `Expires`) to leverage browser caching for static assets.
* **[ ] In-Memory Caching (Redis):**  Railway offers Redis integration. Implement caching strategies for frequently accessed data, especially database queries. Consider:
    * **Key Design:** Use meaningful
