# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T13:00:30.924774

## Performance Optimization Checklist for Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing a Node.js application using Express and a PostgreSQL database. It’s categorized for clarity and includes suggestions ranging from simple tweaks to more involved changes.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to pinpoint queries lacking appropriate indexes.
    * **Index Columns Used in WHERE, JOIN, and ORDER BY Clauses:** Ensure indexes are on columns frequently used in these clauses.
    * **Consider Composite Indexes:** If multiple columns are frequently used together, create a composite index.
    * **Analyze Index Usage:** Regularly monitor index usage with PostgreSQL's `pg_stat_statements` extension.
    * **Regularly Rebuild Indexes:**  Over time, indexes can become fragmented. Rebuilding them using `REINDEX` can improve performance.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Retrieve only the columns you need.
    * **Use `JOIN`s Efficiently:** Ensure `JOIN` conditions are properly indexed.  Consider the order of tables in your `JOIN`s.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible.
    * **Use `LIMIT` and `OFFSET` Carefully:**  These can be expensive, especially with large datasets. Consider alternative pagination strategies.
    * **Subquery Optimization:**  Review subqueries for potential performance issues.  Consider rewriting them using `JOIN`s.
    * **Analyze Query Plans:**  Continually analyze `EXPLAIN ANALYZE` output to understand query execution plans.
* **[ ] Schema Design:**
    * **Choose Appropriate Data Types:** Use the smallest appropriate data types for each column.
    * **Normalization:** Properly normalize your database to reduce redundancy and improve data integrity. (However, over-normalization can sometimes lead to complex joins – strike a balance).
    * **Consider Denormalization (Carefully):** In some cases, controlled denormalization can improve read performance at the cost of potential data consistency issues.
* **[ ] Database Configuration:**
    * **Memory Allocation:** Optimize PostgreSQL's shared_buffers, work_mem, and other memory parameters based on your server's resources.
    * **Connection Pool:**  Use a connection pool in your Express application to reuse database connections instead of constantly creating new ones. (e.g., `pg-pool`)
    * **Logging Levels:** Adjust PostgreSQL's logging levels to reduce unnecessary logging overhead.
    * **Vacuuming and Analyzing:** Regularly run `VACUUM` and `ANALYZE` commands to maintain database statistics and optimize storage.
* **[ ] Partitioning (For Very Large Tables):** Explore table partitioning to divide large tables into smaller, more manageable parts based on ranges or categories.


**II. Express Application Optimization**

* **[ ] Connection Pooling (Already mentioned above, but crucial!):** Don’t create a new database connection for every request. Use a library like `pg-pool` or `node-postgres`'s built-in pool.
* **[ ] Middleware Optimization:**
    * **Minimize Middleware Usage:** Only include middleware that's truly necessary.
    * **Order Matters:**  Place performance-critical middleware earlier in the chain.
    * **Caching Middleware:** Implement caching middleware to store frequently accessed data.
* **[ ] Route Optimization:**
    * **Route Structure:**  Use a well-organized route structure.
    * **Route Handlers:** Write efficient route handlers that perform only necessary actions.
* **[ ] Asynchronous Programming:**
    * **Use `async/await`:**  Avoid blocking the event loop with synchronous operations
