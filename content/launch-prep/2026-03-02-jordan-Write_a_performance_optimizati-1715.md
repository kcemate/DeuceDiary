# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T17:15:43.387132

Okay, here's a comprehensive performance optimization checklist specifically tailored for an Express.js + PostgreSQL app launching on Railway, broken down into categories and prioritized.  It includes considerations for database indexes, query optimization, caching, CDN, and compression.

**I. Database Optimization (PostgreSQL - Most Critical)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to pinpoint the queries taking the most time.  Install and enable this extension if it's not already.
    * **Index Columns Used in WHERE Clauses:** The single most impactful change.  Ensure you have indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** If you frequently filter/sort on multiple columns together, create composite indexes.  Order matters – lead with the most selective column.
    * **Index Types:**  Understand different index types (B-tree, GiST, GIN, BRIN) and choose the appropriate one based on your data and query patterns. B-tree is generally best for standard use cases.
    * **Index Maintenance:** Regularly run `VACUUM ANALYZE` on your tables. This reclaims dead tuples and updates statistics, which the query planner uses to make better decisions.  Railway can help automate this.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` before any critical query to see the execution plan and identify bottlenecks.  Pay attention to sequential scans (full table scans) – these are often bad.
    * **Rewrite Slow Queries:**  Sometimes, a slightly different SQL query can dramatically improve performance.
        * **Avoid `SELECT *`:**  Retrieve only the columns you need.
        * **Use `JOIN` Instead of Subqueries (Sometimes):** PostgreSQL’s query optimizer is often good with joins, but complex subqueries can be inefficient.  Test both.
        * **Optimize `LIKE` Clauses:** Leading wildcards (`%`) in `LIKE` clauses are notoriously slow. Try to avoid them if possible or use full-text search.
        * **Use `LIMIT` and `OFFSET` Carefully:**  Large offset values can be slow.  Consider pagination techniques that use keys instead of offsets.
        * **Prepared Statements:**  Use prepared statements for frequently executed queries to avoid parsing overhead.
* **[ ] Database Schema Design:**
   * **Normalization:** Ensure your schema is properly normalized to reduce data redundancy and improve data integrity.
   * **Data Types:** Use the most appropriate data types for your columns (e.g., `integer` instead of `bigint` if your values won’t exceed the integer range).

**II. Express.js & Application-Level Optimization**

* **[ ] Code Efficiency:**
    * **Profile Your Code:**  Use a Node.js profiler (e.g., `node --prof`) to identify performance hotspots in your Express.js routes and middleware.
    * **Minimize Middleware:**  Use the fewest middleware steps as possible.  Each step adds overhead.
    * **Efficient Data Serialization:** Use `JSON.stringify` efficiently.  Consider using a JSON serialization library if you need custom formatting.
    * **Async/Await Correctly:** Ensure you’re using `async/await` correctly to avoid callback hell and potential performance issues.
* **[ ] Connection Pooling:**  Use a connection pool (e.g., `pg-pool`) to reduce the overhead of establishing new database connections for each request. Railway usually handles this, but verify.
* **[ ]  Request Handling:**  Optimize your route handlers to be as efficient as possible.  Avoid unnecessary computations or database calls within route handlers.


**III. C
