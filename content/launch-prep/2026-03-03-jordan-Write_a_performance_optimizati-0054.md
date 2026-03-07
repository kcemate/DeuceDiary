# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-03T00:54:33.688418

Okay, here's a performance optimization checklist specifically tailored for an Express.js + PostgreSQL app launching on Railway, covering database indexes, query optimization, caching, CDN, and compression. This is broken down into categories with explanations and actionable steps.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to pinpoint the slowest queries. Install and enable it: `CREATE EXTENSION pg_stat_statements;`
    * **Index Relevant Columns:**  Based on `pg_stat_statements`, add indexes to the columns used in `WHERE`, `JOIN`, and `ORDER BY` clauses.  Prioritize columns frequently used in filtering.
    * **Index Types:**  Consider different index types (B-tree, GiST, GIN) based on your data and query patterns. B-tree is usually a good starting point.
    * **Composite Indexes:** For queries using multiple columns in `WHERE` clauses, create composite indexes.
    * **Index Maintenance:** Regularly review and rebuild indexes using `REINDEX TABLE your_table;` (do this during off-peak times).
* **[ ] Query Optimization:**
    * **EXPLAIN Analyze:**  Use `EXPLAIN ANALYZE` before deploying to understand how PostgreSQL is executing your queries. This is *crucial*. Look for:
        * **Sequential Scans:**  These are almost always bad.  Indexes should be used.
        * **Nested Loops:** Can be slow.  Consider joins and proper indexing.
        * **Cost Estimates:**  High costs indicate potential optimizations.
    * **Rewrite Slow Queries:**  Analyze the `EXPLAIN ANALYZE` output and rewrite queries for better performance.  Common tactics:
        * **Avoid `SELECT *`:** Only retrieve the columns you need.
        * **Use `JOIN` instead of Subqueries (when possible):**  Optimizers generally handle joins better than subqueries.
        * **Optimize `WHERE` Clauses:** Use efficient operators and avoid functions in `WHERE` clauses that prevent index usage.
        * **Limit Results:** Use `LIMIT` to prevent returning more data than necessary.
        * **Use `WITH` clauses (Common Table Expressions - CTEs) strategically:** CTEs can sometimes improve readability and performance.
    * **Parameterization:**  Always use parameterized queries (prepared statements) to prevent SQL injection and improve performance by reusing query execution plans.  Express.js frameworks (like `pg` or `sequelize`) should handle this automatically.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Increase the `shared_buffers` setting in PostgreSQL's configuration file (`postgresql.conf`) to allow more data to be cached in memory. (Railway's default is usually fine to start).
    * **`work_mem`:** Increase `work_mem` if you have large in-memory sort operations.
    * **Connection Pooling:**  Ensure your database connection pool is sized appropriately to avoid excessive connection creation and teardown overhead. (Railway handles this well).

**II. Application Code (Express.js)**

* **[ ] Efficient Routing:**
    * **Minimize Middleware:**  Reduce the number of middleware functions in your routes.
    * **Route Organization:** Design routes logically. Avoid overly complex or deeply nested routes.
* **[ ] Data Transfer Optimization:**
    * **JSON Serialization/Deserialization:** Be mindful of the efficiency of JSON serialization and deserialization, especially when dealing with large data objects.
    * **Stream Processing:**  Consider using streaming techniques for large data uploads/downloads to avoid loading the entire dataset into memory.
* **[ ] Asynchronous Operations:**
    * **`async/await
