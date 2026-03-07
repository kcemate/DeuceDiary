# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T22:44:34.444123

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist outlines key optimization areas for your Express.js app running on Railway, specifically targeting database performance, query optimization, caching, CDN, and compression.

**I. Database (PostgreSQL) - 40% of Effort**

* **[ ] Database Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to pinpoint the slowest queries. This is *crucial*.
    * **Index Relevant Columns:** Add indexes to columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses. Consider composite indexes for multiple columns.
    * **Index Types:** Choose the right index type:
        * `B-Tree`: Default and generally good for most scenarios.
        * `Hash`:  Good for equality lookups but not for range queries.
        * `GIN/GIST`: Specialized for full-text search or geospatial data (use if applicable).
    * **Regular Index Maintenance:** Ensure indexes are properly maintained (analyze and vacuum). Railway likely handles this, but understand its configuration.
* **[ ] Query Optimization:**
    * **EXPLAIN Analyze:** Use `EXPLAIN ANALYZE` before deploying. This reveals the query execution plan and highlights potential bottlenecks (e.g., full table scans).
    * **Avoid `SELECT *`:**  Only retrieve necessary columns. Reduces data transfer and memory usage.
    * **Use `JOIN` Carefully:** Optimize `JOIN` conditions - ensure indexes are in place and the join order is efficient.
    * **Rewrite Complex Queries:** Simplify complex queries by breaking them down into smaller, more manageable queries (subqueries can sometimes be optimized).
    * **Parameterize Queries:**  Always use parameterized queries to prevent SQL injection and improve query plan reuse.  Express.js frameworks handle this automatically.
    * **Data Types:**  Ensure data types are appropriate and consistent.  Mismatched types can lead to inefficient conversions.
* **[ ] PostgreSQL Configuration:**
    * **Connection Pool:**  Railway likely manages this, but ensure it's properly sized.  Too small leads to connection overhead; too large can waste resources.
    * **Memory Allocation:** Ensure PostgreSQL has enough memory allocated (check settings via `SHOW shared_buffers`).
    * **Logging:**  Monitor PostgreSQL logs for errors and performance issues.


**II. Express.js Application - 20% of Effort**

* **[ ] Code Efficiency:**
    * **Avoid N+1 Problem:**  Carefully design your API to avoid the N+1 query problem (fetching one record, then N related records). Utilize `join` queries or eager loading.
    * **Efficient Data Structures:** Use appropriate data structures to minimize memory usage and improve lookup times.
    * **Minimize Middleware:** Remove unused middleware to reduce overhead.
    * **Asynchronous Operations:** Utilize `async/await` for proper handling of asynchronous operations.  Don't use callback hell.
* **[ ] Request Handling:**
    * **Limit Request Size:**  Implement limits on request body size to prevent denial-of-service attacks and improve processing time.
    * **Error Handling:**  Implement robust error handling to prevent crashes and provide informative error messages.


**III. Caching - 15% of Effort**

* **[ ] In-Memory Caching:**
    * **Use Redis (Recommended):** Railway provides easy integration with Redis. This is ideal for caching frequently accessed data, session data, and API responses.
    * **Cache Keys:** Design effective cache keys to avoid collisions and ensure proper cache retrieval.
* **[ ] Browser Caching:**
    * **Set `Cache-Control` Headers:** Utilize HTTP `Cache-Control
