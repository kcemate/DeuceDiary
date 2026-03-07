# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T15:22:23.394535

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers performance optimization strategies for a typical Express.js application interacting with a PostgreSQL database.  It's broken down into categories for easier navigation and implementation.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify missing indexes.
    * **Index Columns:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for queries filtering on multiple columns frequently.
    * **Index Types:**  Choose the appropriate index type (B-tree, GiST, GIN, BRIN) based on your data and query patterns.  GiST and GIN are beneficial for complex data types like arrays and JSON.
    * **Regularly Review Indexes:**  Remove unused indexes as they can slow down write operations.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the necessary columns.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Optimize `JOIN`s:**  Ensure the join columns are properly indexed and use the most efficient join type (INNER, LEFT, RIGHT).
    * **Rewrite Complex Queries:**  Break down complex queries into smaller, more manageable queries.  Consider temporary tables or views if needed.
    * **Use Prepared Statements:**  Minimize code duplication and improve performance by using prepared statements for frequently executed queries.
    * **Use Parameterized Queries:**  Prevent SQL injection and improve performance by properly handling parameters.
* **[ ] Data Types:**
    * **Choose Efficient Data Types:**  Use the smallest data type that can accommodate your data to minimize storage space and improve performance. (e.g., `SMALLINT` instead of `BIGINT` if appropriate).
    * **`UUID` vs. `SERIAL`:**  Consider using `UUID` for primary keys in some situations for better scalability.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Tune the `shared_buffers` setting to allow PostgreSQL to cache data in memory. (Typically 25-50% of system RAM).
    * **`work_mem`:**  Increase `work_mem` if your queries perform a lot of sorting or hashing in memory.
    * **`effective_cache_size`:**  Accurately represent the amount of memory available to PostgreSQL for caching.
    * **`maintenance_work_mem`:**  Increase this for operations like `VACUUM` and `CREATE INDEX`.
    * **`autovacuum`:**  Ensure `autovacuum` is enabled and configured properly to automatically clean up dead tuples and update statistics.

**II. Express.js Application Optimization**

* **[ ] Minimize Middleware Usage:**  Only use middleware that is absolutely necessary.
* **[ ] Optimize Request Handling:**
    * **Use `async/await`:**  Avoid callback hell and improve code readability and performance.
    * **Stream Responses:**  For large responses, use streaming to avoid loading the entire response into memory at once.
    * **Minimize HTTP Requests:**  Combine multiple requests into a single request whenever possible.
* **[ ] Efficient Data Transfer:**
    * **Use `JSON.stringify()` and `JSON.parse()` Efficiently:**  Understand the performance implications of these methods.
    * **Compression:**  Enable gzip compression for text-based responses.
* **[ ] Caching:**
    * **Client-Side Caching:**  Implement browser caching strategies to reduce the number of requests to your server.
