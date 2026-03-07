# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-03T01:31:36.139580

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist focuses on optimizing your Express.js application running on Railway, considering database, query performance, caching, CDN, and compression.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` on slow queries to pinpoint missing indexes.
    * **Index Relevant Columns:** Add indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses. Prioritize columns involved in filtering.
    * **Composite Indexes:** Consider composite indexes for queries involving multiple columns in `WHERE` clauses.
    * **Index Type:** Choose the correct index type (B-tree, GiST, GIN, etc.) based on your data and query patterns.  GiST and GIN are often good choices for complex searches.
    * **Regular Index Maintenance:** Ensure PostgreSQL is configured for regular index maintenance (vacuum and analyze) to optimize performance.
    * **Avoid Over-Indexing:** Too many indexes can slow down writes.
* **[ ] Query Optimization:**
    * **Analyze Query Plans:**  Use `EXPLAIN ANALYZE` to understand how PostgreSQL is executing your queries.
    * **Rewrite Slow Queries:**  Simplify complex queries, avoid `SELECT *`, and use efficient joins.
    * **Use Prepared Statements:**  Prepared statements reduce parsing overhead for repeated queries.
    * **Batch Operations:** Use batch operations (e.g., `bulk_insert`) for large data imports/updates.
    * **Partitioning (Consider for Large Tables):**  If your data is large and frequently accessed by range, consider partitioning your tables.
    * **Review PostgreSQL Configuration:** Tune PostgreSQL parameters like `shared_buffers`, `work_mem`, and `effective_cache_size` based on your application’s workload.  Railway's settings allow some adjustment.
* **[ ] Data Types:**
    * **Use Efficient Data Types:**  Use the smallest suitable data types for your columns.
    * **Avoid Type Conversions:**  Minimize implicit type conversions as they can impact performance.

**II. Express.js Application Optimization**

* **[ ] Route Handlers:**
    * **Keep Route Handlers Concise:** Minimize the code within your route handlers. Move logic to separate functions or services.
    * **Avoid Blocking Operations:** Use asynchronous operations (`async/await`) and non-blocking calls.
    * **Implement Rate Limiting:** Prevent abuse and overload by implementing rate limiting (e.g., using `express-rate-limit`).
* **[ ] Middleware:**
    * **Optimize Middleware Order:**  Place the most frequently used middleware earlier in the chain.
    * **Avoid Expensive Middleware:**  Minimize the use of middleware that perform computationally intensive tasks.
* **[ ] Connection Pooling:**
    * **Utilize Connection Pooling:**  Express.js connection pooling reduces the overhead of establishing new connections for each request. Make sure your PostgreSQL driver (e.g., `pg`) is configured correctly.
* **[ ] Error Handling:**
    * **Implement Robust Error Handling:**  Catch and handle errors gracefully to avoid unexpected crashes and slow responses.

**III. Caching**

* **[ ] Browser Caching:**
    * **Leverage Browser Caching:** Configure appropriate HTTP headers (Cache-Control, Expires) to instruct browsers to cache static assets (CSS, JavaScript, images).  Railway simplifies this.
* **[ ] Application-Level Caching:**
    * **Redis or Memcached:** Implement a caching layer using Redis or Memcached to store frequently accessed data.
    * **Cache Invalidation:** Implement a strategy for invalidating the cache when data changes.
    * **Cache Keys:**
