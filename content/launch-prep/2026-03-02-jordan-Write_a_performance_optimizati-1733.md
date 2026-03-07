# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T17:33:46.724610

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist focuses on optimizing an Express.js application built with PostgreSQL that's deployed on Railway. It covers key areas like database optimization, query optimization, caching, CDN, and compression, specifically considering Railway's environment.

**I. Database Optimization (PostgreSQL)**

* **[ ] Database Indexing:**
    * **Identify Slow Queries:** Use database monitoring tools (e.g., pgAdmin, Railway Monitor, or external services) to identify slow-running queries.
    * **Analyze `EXPLAIN` Plans:**  Use `EXPLAIN` or `EXPLAIN ANALYZE` to understand how PostgreSQL is executing your queries. This reveals missing indexes, inefficient join types, and potential bottlenecks.
    * **Create Indexes on Relevant Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for multiple related columns.
    * **Index Types:** Select the appropriate index type (B-tree is most common, but consider GiST or GIN for specific data types and use cases).
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations (inserts, updates, deletes). Regularly review and drop unused indexes.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you actually need.
    * **Use `LIMIT`:**  When retrieving a subset of data, always include `LIMIT` to avoid fetching unnecessary rows.
    * **Optimize `JOIN`s:** Ensure join columns are indexed and use the correct join type (INNER, LEFT, RIGHT) based on your requirements.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query to reduce the amount of data processed.
    * **Optimize `GROUP BY` and `ORDER BY`:** These operations can be expensive. Index the columns used and minimize the amount of data grouped/sorted.
    * **Use Prepared Statements/Parameterized Queries:**  Prevent SQL injection and improve performance by reusing the same query plan.
    * **Connection Pooling:** Railway provides connection pooling automatically. Ensure you're leveraging it. Verify connection pool size is appropriate.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase this value (up to 25-50% of RAM) to allow PostgreSQL to cache more data in memory.  Railway manages this.
    * **`work_mem`:**  Allocate enough memory for temporary operations like sorting and hashing.
    * **`effective_cache_size`:** Inform PostgreSQL about the amount of memory available for caching data.
    * **`maintenance_work_mem`:** Increase memory allocated for maintenance tasks (e.g., `VACUUM`).
    * **Monitor Resource Usage:** Regularly monitor PostgreSQL's CPU, memory, and disk I/O.


**II. Express.js Application Optimization**

* **[ ] Minimize Middleware:** Use only the necessary middleware. Remove any unused or redundant middleware.
* **[ ] Efficient Routing:**  Optimize your routes for speed. Avoid complex route structures if possible.
* **[ ] Async/Await Best Practices:**  Use `async/await` for non-blocking I/O operations to improve responsiveness.
* **[ ] Code Profiling:** Utilize profiling tools (e.g., Node.js Profiler) to identify performance bottlenecks in your code.
* **[ ] Error Handling:** Implement robust error handling to prevent unexpected crashes and ensure a good user experience.


**III. Caching**

* **[ ] In-Memory Caching (Redis):** Railway seamlessly integrates with Redis. Leverage it for:
    * **Frequent Data:** Cache frequently accessed data (e.g
