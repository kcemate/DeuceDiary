# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T08:12:24.308211

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to optimize a web application built with Express.js and PostgreSQL. It’s broken down into categories with specific actions and considerations.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify the most time-consuming queries.
    * **Analyze Queries:** Examine the query plans (using `EXPLAIN ANALYZE`) to understand how PostgreSQL is executing the query.
    * **Create Appropriate Indexes:** Based on the query plans, add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
        * **B-Tree Indexes:**  The default and generally good for most situations.
        * **GIN Indexes:**  For full-text search or complex data types like arrays.
        * **GiST Indexes:** For geometric data or range types.
        * **Hash Indexes:** (Less Common) Useful for equality comparisons.
    * **Composite Indexes:** Consider composite indexes for queries filtering on multiple columns.
    * **Index Maintenance:** Regularly run `VACUUM ANALYZE` to maintain index statistics and remove dead tuples.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you actually need.
    * **Use `LIMIT` judiciously:**  Especially in API endpoints to prevent fetching large datasets unnecessarily.
    * **Optimize `JOIN`s:** Ensure `JOIN` columns are indexed and use the most efficient `JOIN` type (INNER, LEFT, RIGHT).
    * **Rewrite Complex Queries:**  Break down complex queries into smaller, more manageable queries if possible.
    * **Use `EXISTS` instead of `COUNT(*)` when possible:** `EXISTS` often performs better when just checking for the existence of rows.
    * **Use Prepared Statements:** Minimize the overhead of creating new queries for repeated usage.
    * **Avoid `LIKE '%pattern%'`:** This is a performance killer. Consider full-text search or alternative search strategies if needed.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:** Adjust based on available memory (typically 25-50%).
    * **`work_mem`:** Controls the amount of memory used for sorting and hashing operations.  Increase if you have lots of sorting.
    * **`effective_cache_size`:**  Helps the query planner estimate buffer hit ratios.
    * **`maintenance_work_mem`:**  Sets the memory available for maintenance operations (VACUUM, ANALYZE).
    * **Connection Pooling:**  Use a connection pooler (like PgBouncer or a library built-in) to reduce connection overhead.



**II. Express.js Optimization**

* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:** Regularly review your middleware stack and remove any that aren’t essential.
    * **Order Matters:**  Place heavier middleware (like authentication) earlier in the pipeline.
    * **Efficient Middleware:**  Ensure your middleware functions are performant and avoid unnecessary operations.
* **[ ] Request Handling:**
    * **Minimize Code Execution:** Keep request handlers concise and efficient.
    * **Use Async/Await:** Properly use `async/await` to handle asynchronous operations efficiently and prevent blocking the event loop.
    * **Caching:** Implement caching for frequently accessed data, both on the server-side and client-side (e.g., using Redis or a CDN).
* **[ ] Routing:**
    * **Route Parameters:** Use route parameters effectively to avoid repetitive queries.
    * **Route Grouping:** Use route grouping to
