# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T07:27:34.710052

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas for optimizing your Express.js application running against a PostgreSQL database. It’s broken down into categories with varying levels of complexity, starting with simple checks and escalating to more involved strategies.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZES` to pinpoint queries with poor performance.
    * **Add Indexes:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for multiple related columns.
    * **Index Types:** Choose the appropriate index type (B-tree is default, but consider GIN/GiST for specific data types like JSON or arrays).
    * **Regularly Review & Refactor Indexes:** Remove unused or redundant indexes.
* **[ ] Query Optimization:**
    * **`EXPLAIN ANALYZES`:**  Use this *constantly* to understand query execution plans.
    * **Avoid `SELECT *`:**  Only retrieve the columns you need.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:** Ensure indexes are present on join columns.  Consider the join order, though PostgreSQL's query optimizer is usually good at this.
    * **Use `LIMIT`:** Always use `LIMIT` to prevent unnecessary data retrieval.
    * **Avoid `LIKE '%pattern%'` (Leading Wildcards):** These are extremely slow and should be avoided if possible.  Consider full-text search indexes if needed.
    * **Use Parameterized Queries:**  Essential for preventing SQL injection and often improves performance by allowing PostgreSQL to cache query plans.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Adjust based on your server's RAM. (Recommended: 25-40% of RAM)
    * **`work_mem`:**  Increase this if you have complex queries with a lot of sorting and hashing.
    * **`effective_cache_size`:**  Tell the query optimizer how much memory is available for caching.
    * **`maintenance_work_mem`:**  Used for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:** Ensure `autovacuum` is enabled and configured appropriately.
    * **Regularly Run `VACUUM ANALYZE`:**  This reclaims dead tuples and updates statistics used by the query optimizer.  Consider scheduling this during off-peak hours.


**II. Express.js & Middleware Optimization**

* **[ ] Route Handling:**
    * **Minimize Route Handlers:** Keep route handlers small and focused.
    * **Use `async/await`:**  Improves readability and allows for efficient handling of asynchronous operations.
    * **Avoid Synchronous Operations in Routes:**  Asynchronous operations are crucial for preventing blocking the event loop.
* **[ ] Middleware Optimization:**
    * **Review Middleware Chain:**  Remove unnecessary middleware.
    * **Use Efficient Middleware:** Choose middleware with minimal overhead.
    * **Caching Middleware:** Utilize caching middleware to store frequently accessed data (e.g., for API responses).
* **[ ] Request Parsing:**
    * **Use `express.json()` and `express.urlencoded()`:**  These middleware automatically parse request bodies.
    * **Optimize Parsing Size:** Avoid parsing unnecessarily large request bodies. Consider using streams for handling larger uploads.
* **[ ] Session Management:**
    * **Redis or Memcached:** Use a fast in-memory store like Redis or Memcached for session data instead of storing sessions in the database
