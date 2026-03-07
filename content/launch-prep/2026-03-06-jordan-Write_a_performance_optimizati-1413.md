# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-06T14:13:35.636831

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing the performance of a typical Express.js application using a PostgreSQL database. It’s broken down into categories for clarity and covers a range of techniques, from basic to more advanced.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `pg_stat_statements` or similar tools to identify queries with the highest execution times.
    * **Appropriate Indexes:**  Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for queries that filter on multiple columns.
    * **Index Types:**  Evaluate the appropriate index type (B-tree, GiST, GIN, BRIN) based on your data and query patterns.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries and identify bottlenecks.
    * **Rewrite Queries:** Refactor complex queries for better performance. Consider these techniques:
        * **Avoid `SELECT *`:**  Only retrieve the columns you need.
        * **Use `WHERE` Clauses Effectively:** Filter data as early as possible.
        * **Optimize `JOIN`s:** Ensure appropriate indexes are in place for join columns. Consider the order of tables in joins.
        * **Use `LIMIT` and `OFFSET` Carefully:** Especially when combined with large datasets.  Consider `LIMIT OFFSET` versus key-value indexing if you frequently need to retrieve the *n* most recent records.
        * **Use Prepared Statements:**  For frequently executed queries, use prepared statements to avoid parsing and compilation overhead.
        * **Avoid Functions in `WHERE` Clauses:** Functions can prevent index usage. Consider pre-calculating values or using alternative query structures.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Increase this value (typically 25-50% of system RAM) to allow PostgreSQL to cache more data.
    * **`work_mem`:**  Increase this value to allow PostgreSQL to perform more operations in memory.
    * **`maintenance_work_mem`:** Increase this value for maintenance operations (e.g., `VACUUM`).
    * **`effective_cache_size`:**  Provide an accurate estimate of your available cache size to help PostgreSQL's query planner.
    * **Connection Pool:**  Use a connection pool (like `pg-pool` or `node-postgres`'s built-in pool) to reduce the overhead of creating and destroying database connections.
    * **Vacuum Regularly:** `VACUUM` reclaims space and updates statistics, improving query performance. (Consider `autovacuum` but monitor its effectiveness).
* **[ ] Data Types:**  Use the most appropriate data types for your columns to minimize storage and improve performance.
* **[ ] Normalization:** Ensure your database schema is properly normalized to reduce data redundancy and improve query performance.



**II. Express.js Application Optimization**

* **[ ] Connection Pooling (as mentioned above):**  Crucial for any application interacting with a database.
* **[ ] Asynchronous Operations:** Use `async/await` or Promises to handle asynchronous operations (database calls) efficiently.  Avoid blocking the main event loop.
* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:**  Analyze your middleware stack and remove any that aren't essential.
    * **Order Middleware Matters:**  Order your middleware carefully.  Place performance-
