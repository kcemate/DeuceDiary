# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T10:05:02.499097

## Performance Optimization Checklist: Express + PostgreSQL

This checklist provides a comprehensive guide to optimizing your Express app running against a PostgreSQL database. It’s broken down into categories with estimated effort levels (Low, Medium, High).

**I. Database Optimization (High Priority - 40%)**

* **1. Indexing (High - 10%):**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to identify queries with high `cost` or `rows` estimates.
    * **Index Relevant Columns:** Create indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses. Focus on columns that are not included in the primary key or unique constraints.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns in `WHERE` clauses.
    * **Index Type:** Use the appropriate index type for your data (B-tree, GiST, GIN, etc.). GiST and GIN are particularly useful for full-text search and geospatial data.
* **2. Query Optimization (High - 10%):**
    * **Avoid `SELECT *`:** Only select the columns you need. Reduces network traffic and memory usage.
    * **Use `EXISTS` instead of `COUNT(*)`:**  When checking if a record exists, `EXISTS` is generally faster.
    * **Optimize `JOIN` Operations:**  Ensure `JOIN` columns are indexed and that the join order is optimized (PostgreSQL’s query planner usually handles this, but understanding your data model helps).
    * **Subquery Optimization:** Rewrite complex subqueries into `JOIN` operations when possible.
    * **Use Prepared Statements:**  Reduce parsing overhead for frequently executed queries.
* **3. Database Configuration (Medium - 5%):**
    * **`shared_buffers`:**  Adjust this based on your server's RAM. A good starting point is 25% of available RAM.
    * **`work_mem`:**  Allocate sufficient memory for sorting and hashing operations.
    * **`maintenance_work_mem`:**  Increase this for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Estimate the amount of RAM available for PostgreSQL’s buffer cache.
    * **Regularly run `VACUUM ANALYZE`:** This updates statistics and optimizes table layouts.  Schedule this as a cron job.

**II. Express Application Optimization (Medium Priority - 30%)**

* **4. Connection Pooling (High - 8%):**
    * **Use a Connection Pooler:**  Don’t create a new database connection for every request. Use a connection pooler like `pg-pool` or `bluebird` to manage connections efficiently.
* **5. Middleware Optimization (Medium - 8%):**
    * **Minimize Middleware:**  Remove unused or redundant middleware.
    * **Optimize Logging Middleware:**  Use asynchronous logging to avoid blocking request processing.
    * **Order Middleware Carefully:** Place performance-critical middleware towards the end of the chain.
* **6. Request Handling (Medium - 4%):**
    * **Asynchronous Operations:** Use `async/await` or Promises for I/O operations (database queries, file uploads, etc.) to avoid blocking the event loop.
    * **Code Splitting:**  If your application has a large amount of JavaScript, consider code splitting to reduce initial load time.
* **7. Static Asset Delivery (Low - 4%):**
    * **Use a CDN:**  Serve static assets (images, CSS, JavaScript) from a Content Delivery Network (CDN) for faster delivery to users around the world.


**III
