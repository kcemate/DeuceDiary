# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T08:34:50.228531

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing the performance of a web application built with Express.js and PostgreSQL. It's broken down into categories and ranked roughly by impact, though specific prioritization will depend on your application's unique bottlenecks.

**I. Database (PostgreSQL) Optimization - Highest Impact**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `auto_explain` extension or logging to identify queries with long execution times.
    * **Index Relevant Columns:** Add indexes to columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses. Consider composite indexes for common query patterns.
    * **Index Types:** Choose the appropriate index type (B-tree is standard, but consider BRIN, GIN, or HASH for specific use cases).
    * **Avoid Over-Indexing:** Too many indexes can slow down writes. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Use this command to analyze the query execution plan and identify bottlenecks.
    * **Rewrite Slow Queries:**  
        * **Avoid `SELECT *`:**  Only select the columns you need.
        * **Use `LIMIT` Effectively:**  Restrict results if possible.
        * **Optimize Joins:** Ensure proper join conditions and use the most efficient join types.
        * **Avoid `LIKE '%...%'`:**  Leading wildcards in `LIKE` queries are very slow. Consider full-text search if applicable.
        * **Use `WITH` (Common Table Expressions - CTEs):**  Can improve readability and sometimes performance.
    * **Parameterized Queries:**  Essential for security and can improve performance by allowing PostgreSQL to cache query plans.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase if you have enough RAM.
    * **`work_mem`:**  Increase to reduce disk I/O for sorting and hashing.
    * **`effective_cache_size`:**  Tell PostgreSQL how much RAM is available for caching.
    * **`maintenance_work_mem`:**  Increase for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **Regular `VACUUM` and `ANALYZE`:**  Crucial for maintaining index statistics and optimizing performance.  Set these up as cron jobs.
* **[ ] Connection Pooling:**
    * **Use a Connection Pooler:**  pgBouncer or similar to manage database connections efficiently. This significantly reduces the overhead of establishing new connections for each request.  Express applications often utilize a library like `pg-pool` to manage this.


**II. Express.js & Middleware Optimization - Medium Impact**

* **[ ] Efficient Route Handling:**
    * **Minimize Middleware Usage:** Only use middleware needed for a specific route.
    * **Asynchronous Operations:** Use `async/await` for database calls and other I/O operations to avoid blocking the event loop.
* **[ ] Static File Serving:**
    * **Serve Static Files Directly:** Configure Express to serve static assets (images, CSS, JavaScript) directly rather than through middleware.
* **[ ] Caching:**
    * **Implement Caching Strategies:** Consider caching frequently accessed data (e.g., using Redis or Memcached) to reduce database load. Express frameworks often provide caching middleware.
* **[ ] Compression:**
    * **Enable Gzip Compression:** Compress responses to reduce transfer sizes, especially for text-based content.
* **[ ] Keep Express Version Up-to-Date:** Newer versions often include performance improvements.
* **[ ]  Use a Fast Express Framework (if needed):** If you’
