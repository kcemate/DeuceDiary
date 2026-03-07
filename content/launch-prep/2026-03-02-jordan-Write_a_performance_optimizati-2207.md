# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T22:07:28.693998

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist covers key performance optimization areas for your Express.js app hosted on Railway, focusing on the database (PostgreSQL) and overall application delivery.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use logging, monitoring tools (e.g., pgAdmin, DataDog) to pinpoint the slowest queries.
    * **Analyze Query Plans:**  Use `EXPLAIN ANALYZE` to understand how PostgreSQL is executing queries and identify missing or ineffective indexes.
    * **Create Appropriate Indexes:**  Index frequently queried columns, especially those used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
        * **Consider composite indexes:** For queries filtering on multiple columns, a composite index can be more effective than multiple single-column indexes.
        * **Avoid over-indexing:** Too many indexes can slow down write operations.
        * **Index Types:** Select the appropriate index type (B-tree, GiST, GIN, etc.) based on your data and query patterns.
* **[ ] Query Optimization:**
    * **Write Efficient SQL:**
        * **Avoid `SELECT *`:**  Only select the columns you need.
        * **Use `WHERE` clauses effectively:** Filter data as early as possible in the query.
        * **Optimize `JOIN`s:**  Use appropriate `JOIN` types (INNER, LEFT, RIGHT) and ensure that join columns are indexed.
        * **Use `LIMIT` and `OFFSET` carefully:**  For pagination, avoid using `LIMIT` and `OFFSET` together for large datasets.  Consider using keyset pagination for better performance.
        * **Avoid using functions in `WHERE` clauses:** This can prevent the optimizer from using indexes.
    * **Review Query Complexity:** Complex queries are often slower.  Can they be simplified or broken down into smaller queries?
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:** Adjust this to a reasonable value based on your RAM and workload.  Start with 25-50% of your RAM.
    * **`work_mem`:** Increase this for queries that perform sorting or hashing.
    * **`effective_cache_size`:** Inform the optimizer about the amount of RAM available for caching.
    * **`maintenance_work_mem`:** Increase this for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **Consider connection pooling:** Railway often handles this, but confirm it's configured correctly.

**II. Application Optimization (Express.js)**

* **[ ] Caching:**
    * **HTTP Caching (Browser Caching):** Utilize HTTP headers (e.g., `Cache-Control`, `Expires`, `ETag`) to leverage browser caching.
    * **In-Memory Caching:** Implement caching within your Express.js application using libraries like `node-cache`, `memcached`, or Redis (recommended for larger datasets and scaling). Cache frequently accessed data (e.g., API responses, user sessions).
    * **CDN Caching:**  Utilize a CDN (Cloudflare, AWS CloudFront) to cache static assets (images, CSS, JavaScript).
* **[ ] Code Optimization:**
    * **Minimize Request Size:** Reduce the size of JSON responses by only sending necessary data.
    * **Optimize Loops & Algorithms:**  Review loops and algorithms for efficiency.
    * **Code Splitting:**  If you're using client-side JavaScript, consider code splitting to reduce the initial download size.
    * **Asynchronous Operations:** Use `async/await` for cleaner and more efficient asynchronous code.
* **[ ] Logging & Monitoring:**
