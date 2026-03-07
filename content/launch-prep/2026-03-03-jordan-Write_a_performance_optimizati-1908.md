# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T19:08:39.112945

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing your Express application running against a PostgreSQL database. It's broken down into categories for easier navigation and prioritization.

**I. Application (Express) Level - Front-End Optimization**

* **[ ] Minimize Payload Size:**
    * **Compression (Gzip):**  Implement Gzip compression for all responses.
    * **Content Delivery Network (CDN):** Use a CDN to serve static assets (images, CSS, JavaScript).
    * **Minify & Bundle Assets:** Minify and bundle your JavaScript and CSS files.
* **[ ] Efficient Routing:**
    * **Route Structure:** Design a clean and efficient route structure. Avoid deeply nested routes.
    * **Route Guards:** Use route guards (middleware) judiciously to control access and prevent unnecessary processing.
* **[ ] Optimize Middleware:**
    * **Minimize Middleware Usage:** Only use middleware that’s absolutely necessary. Each middleware adds overhead.
    * **Optimize Middleware Performance:** Profile and optimize your middleware, especially those involving data processing or external calls.
* **[ ]  Keep Dependencies Lean:** Regularly review and remove unused dependencies.  Larger dependency trees can impact application startup and size.
* **[ ] Caching:**
    * **Browser Caching:** Utilize browser caching for static assets.
    * **Server-Side Caching (Redis/Memcached):** Implement server-side caching for frequently accessed data to reduce database load.
* **[ ]  Connection Pooling:** Ensure Express is properly configured to utilize a connection pool to PostgreSQL.  This avoids the overhead of creating new connections for each request.


**II. Database (PostgreSQL) Level - Backend Optimization**

* **[ ] Database Indexing:** **Crucial!**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify the slowest queries.
    * **Index Relevant Columns:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Don’t over-index!
    * **Composite Indexes:** Use composite indexes (indexes on multiple columns) for queries that frequently filter on combinations of columns.
    * **Index Type:** Choose the appropriate index type (B-tree is the default, but consider GiST or GIN for specific needs like full-text search).
* **[ ] Query Optimization:**
    * **Use `EXPLAIN`:** Analyze query execution plans using `EXPLAIN` to identify bottlenecks.
    * **Avoid `SELECT *`:**  Only select the columns you need.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:** Understand join types and ensure they’re efficient. Prefer `INNER JOIN` when appropriate.
    * **Use `LIMIT` Clauses:** Limit the number of rows returned when possible.
    * **Avoid `LIKE '%string%'`:** This is notoriously slow.  Consider full-text search or alternative approaches if applicable.
* **[ ] Schema Design:**
    * **Normalization:** Properly normalize your database schema to reduce data redundancy and improve data integrity.
    * **Data Types:** Use the smallest appropriate data types for your columns to minimize storage space and improve query performance.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Increase `shared_buffers` (memory PostgreSQL uses for caching data) based on your available RAM and workload.
    * **`work_mem`:**  Increase `work_mem` (memory PostgreSQL uses for sorting and hashing operations) if you have queries with significant sorting or aggregation.
    * **`effective_cache_size`:**  Tune `effective_cache_size` to
