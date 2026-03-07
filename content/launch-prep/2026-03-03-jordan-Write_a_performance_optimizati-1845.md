# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T18:45:59.586983

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing performance for a typical Express.js application interacting with a PostgreSQL database. It's categorized for clarity and progression.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify missing or ineffective indexes.
    * **Targeted Indexes:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries that filter on multiple columns together.
    * **Index Types:** Choose the right index type (B-tree, Hash, GIN, GiST) based on data types and query patterns.  B-trees are generally a good starting point.
    * **Partial Indexes:**  If you frequently query a subset of your data based on a specific condition, consider a partial index.
* **[ ] Query Optimization:**
    * **Use `SELECT` only necessary columns:** Avoid `SELECT *` -  only retrieve the columns you need.
    * **Optimize `WHERE` clauses:**
        * Use appropriate data types in your `WHERE` clauses.
        * Avoid using functions in `WHERE` clauses that prevent index usage. (e.g., `WHERE UPPER(column) = 'VALUE'`)
        * Simplify complex `WHERE` clauses.
    * **Optimize `JOIN`s:**
        * Ensure proper indexes on joined columns.
        * Use the correct `JOIN` type (INNER, LEFT, RIGHT) - choose the one that accurately represents the relationship.
        * Minimize the number of `JOIN`s.
    * **Limit Results:** Use `LIMIT` to restrict the number of rows returned, especially in initial query results.
    * **Avoid `SELECT DISTINCT` unnecessarily:**  Ensure the query truly needs to eliminate duplicates.
* **[ ] Database Configuration:**
    * **Analyze and Vacuum Regularly:** `ANALYZE` updates statistics used by the query planner, and `VACUUM` reclaims dead tuples. Run these regularly (e.g., daily or after large data updates).
    * **Tune PostgreSQL Configuration:** Adjust parameters like `shared_buffers`, `work_mem`, `effective_cache_size`, and `maintenance_work_mem` based on your server's resources and workload. (This is highly system-specific - benchmarking is crucial).
    * **Connection Pooling:**  Utilize a connection pooler (pgbouncer, etc.) to reduce the overhead of establishing and closing database connections.
* **[ ] Data Types:**
    * **Use appropriate data types:**  Choosing efficient data types can significantly impact storage and performance. (e.g., use `INTEGER` instead of `BIGINT` if the range allows).
* **[ ] Schema Design:**
    * **Normalization:**  Properly normalized schemas can reduce data redundancy and improve data integrity, but excessive normalization can lead to complex joins.  Balance normalization with performance.

**II. Express.js Application Optimization**

* **[ ] Middleware Optimization:**
    * **Reduce Middleware Depth:** Minimize the number of middleware layers to reduce overhead.
    * **Efficient Middleware:** Ensure your middleware is performing efficiently (e.g., avoid synchronous operations in asynchronous middleware).
* **[ ] Route Optimization:**
    * **Efficient Route Handlers:**  Keep route handler functions concise and focused.
    * **Use Route Parameters Wisely:** Use route parameters strategically.
* **[ ] Request Parsing:**
    * **Use `express.json()` and `express.urlencoded()` appropriately:**  Only parse requests with the appropriate content type.
* **[ ] Asynchronous Operations:**
    * **Use `
