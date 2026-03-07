# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T19:59:00.312560

Okay, here's a comprehensive performance optimization checklist specifically tailored for an Express.js + PostgreSQL app launching on Railway, covering key areas like database indexing, query optimization, caching, CDN, and compression. This is broken down into categories with actionable steps and considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify queries with high execution times.  This is *crucial*.
    * **Index Columns Used in WHERE Clauses, JOINs, and ORDER BY:**  The most important area for indexing.  Consider composite indexes for queries using multiple columns in a `WHERE` clause.
    * **Index Types:** Review appropriate index types (B-tree, Hash, GiST, GIN) based on your query patterns.  B-tree is generally the best starting point.
    * **Index Maintenance:**  Regularly run `VACUUM ANALYZE` to update statistics and optimize index usage. Railway automatically handles some of this, but you should monitor.
    * **Avoid Over-Indexing:** Too many indexes can *slow down* writes (inserts, updates, deletes).
* **[ ] Query Optimization:**
    * **Analyze Query Execution Plans:** Use `EXPLAIN` and `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries.  Look for full table scans.
    * **Use `JOIN`s Efficiently:**  Ensure proper join types (INNER, LEFT, RIGHT) and consider the order of joins.
    * **Avoid `SELECT *`:**  Retrieve only the columns you actually need.
    * **Use Prepared Statements:**  Prepared statements can improve performance by reusing the query plan.  Express.js best practices should handle this automatically.
    * **Optimize Raw SQL:**  Sometimes, a carefully crafted raw SQL query can be more efficient than complex ORM usage. (Use sparingly - maintainability is key).
    * **Batch Operations:** Instead of many individual database calls, batch updates/inserts when possible.
* **[ ] Schema Design:**
    * **Data Types:** Use the most appropriate data types for your columns. Smaller data types improve storage and performance.
    * **Normalization:**  Ensure proper normalization to reduce data redundancy and improve data integrity. However, excessive normalization can also hurt performance; strike a balance.

**II. Express.js Application Optimization**

* **[ ] Code Efficiency:**
    * **Minimize Middleware:** Only use middleware you truly need.
    * **Efficient Route Handlers:**  Optimize the logic within your route handlers.
    * **Asynchronous Operations:**  Use `async/await` or Promises correctly for non-blocking I/O operations.
    * **Avoid Synchronous Operations:**  Synchronous operations block the Node.js event loop.
    * **Remove Unnecessary Code:**  Regularly review and remove unused code and dependencies.
* **[ ] Connection Pooling:**  Ensure your database connection pool is appropriately sized. Too small, and you'll get connection bottlenecks; too large, and you'll consume excessive resources. Railway handles this well.
* **[ ] Logging:**  Use structured logging (e.g., Winston, Pino) to monitor performance and identify issues. Don't rely solely on console.log.

**III. Railway Specific Optimizations**

* **[ ] Instance Size:**  Start with a small Railway instance and scale up as needed based on your traffic and performance metrics.  Monitor resource usage (CPU, memory, network).
* **[ ] Database Instance Size:**  Carefully choose the database instance size (PostgreSQL) on Railway.  This directly impacts query performance and the number of concurrent connections.
* **[ ] Network Configuration:** Optimize the network configuration, especially
