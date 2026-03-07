# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-03T00:17:24.982511

Okay, here's a comprehensive performance optimization checklist tailored for an Express.js + PostgreSQL app launching on Railway, broken down into categories and with Railway-specific considerations:

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing - Critical:**
    * **Identify Slow Queries:** Use Railway’s logs and monitoring (e.g., New Relic, Datadog – Railway integrations) to pinpoint queries with the highest latency.
    * **Index Columns Used in WHERE Clauses:**  Prioritize indexing columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:**  Create composite indexes for queries using multiple columns in the `WHERE` clause *together*.  The order of columns in a composite index matters – put the most selective column first.
    * **Index Data Types:** Ensure index columns have appropriate data types.  Avoid using strings for numeric comparisons.
    * **Partial Indexes:** If you often query a subset of your data based on a specific column, consider a partial index to only index that specific range.
    * **Regular Index Maintenance:** Ensure your PostgreSQL instance is regularly vacuuming and analyzing its tables and indexes. Railway usually handles this, but verify the configuration.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` before optimizing.  This shows the query plan and the actual time spent on each step, revealing bottlenecks.
    * **Avoid `SELECT *`:**  Only select the columns you actually need.  This reduces data transfer and memory usage.
    * **Use `JOIN`s Efficiently:** Ensure you're joining on indexed columns.  Consider the join order in complex queries.
    * **Optimize `LIKE` Queries:**  Leading wildcards (`%`) in `LIKE` queries are extremely slow.  Avoid them if possible.  If you need them, consider full-text search.
    * **Subqueries vs. Joins:**  Analyze whether subqueries or joins are more efficient.  Often, joins are faster.
    * **Raw SQL vs. ORM:**  Sometimes, writing raw SQL can be faster and more efficient than using an ORM, especially for complex queries. Experiment and benchmark.
    * **Limit Results:**  Always use `LIMIT` in your queries, especially when retrieving large amounts of data.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase the `shared_buffers` setting (typically 25-50% of RAM) to allow PostgreSQL to cache more data in memory.  Railway limits this, but explore options.
    * **`effective_cache_size`:** Set this to the approximate size of your disk cache.
    * **`work_mem`:**  Increase this if you have a lot of in-memory sorting or operations.
    * **Connection Pooling:**  Use a connection pooler (like `pgbouncer`) on the Railway instance to manage database connections efficiently. Railway’s built-in connection pooling is generally sufficient for many apps.

**II. Express.js Application Optimization**

* **[ ] Code Efficiency:**
    * **Minimize Middleware:**  Remove unused or redundant middleware.
    * **Efficient Route Handlers:**  Keep route handlers concise and focused.
    * **Avoid Synchronous Operations:** Use asynchronous functions (`async/await`) for I/O operations (database queries, file reads). Synchronous code blocks the event loop.
    * **Code Profiling:** Use Node.js profiling tools to identify performance bottlenecks in your Express.js code.
* **[ ] Request Validation:** Use a validation library (e.g., Joi, express-validator) to validate incoming data efficiently.
* **[ ] Error Handling:** Implement
