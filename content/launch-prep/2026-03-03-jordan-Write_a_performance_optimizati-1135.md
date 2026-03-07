# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T11:35:39.919994

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing your Express.js application against a PostgreSQL database. It's broken down into categories with actionable steps and considerations.

**I. Express.js Configuration & Architecture**

* **[ ] Use a Framework Like Koa.js or Fastify:**  Consider switching to a more lightweight framework like Koa.js or Fastify for potentially better performance. Express is still good, but these offer faster startup times and can be more efficient.
* **[ ] Keep Express.js Minimal:** Avoid unnecessary middleware. Only include what's truly needed.
* **[ ] Efficient Route Handling:**
    * **[ ] Route Groups & Middleware:** Utilize route groups and middleware to reduce code duplication and improve readability.
    * **[ ] Asynchronous Operations:**  Always use `async/await` for database queries and I/O operations to prevent blocking the event loop.
    * **[ ] Short-Lived Requests:** Design routes to minimize the duration of individual requests.
* **[ ] Static Files:** Serve static assets (CSS, JavaScript, images) directly from a dedicated static directory for maximum efficiency.
* **[ ] Compression:**  Implement Gzip or Brotli compression for all text-based responses.
* **[ ] Connection Pooling:**  Ensure your Express.js application uses a robust connection pool for PostgreSQL.  (Usually handled by your ORM/Driver)


**II. PostgreSQL Database Optimization**

* **[ ] Indexing:**  This is *the most impactful* optimization.
    * **[ ] Identify Slow Queries:** Use `pg_stat_statements` to identify frequently executed and slow queries.
    * **[ ] Analyze Query Plans:**  Use `EXPLAIN` to understand how PostgreSQL is executing your queries and identify missing or ineffective indexes.
    * **[ ] Create Appropriate Indexes:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **[ ] Composite Indexes:** Create composite indexes for queries that filter on multiple columns.
    * **[ ] Consider Index Types:**  Evaluate different index types (B-tree, Hash, GiST, GIN) based on your query patterns.  B-tree are generally the best starting point.
* **[ ] Query Optimization:**
    * **[ ] Avoid `SELECT *`:**  Retrieve only the columns you need.
    * **[ ] Use `LIMIT` Clause:**  Limit the number of rows returned, especially in API endpoints.
    * **[ ] Optimize `JOIN` Operations:** Ensure join columns are indexed.  Consider the order of tables in `JOIN` clauses.
    * **[ ] Use `EXISTS` Instead of `COUNT(*)`:**  When checking for the existence of data, `EXISTS` is often faster than `COUNT(*)`.
    * **[ ]  Rewrite Complex Queries:** Simplify complex queries where possible.  Break down large queries into smaller, more manageable steps.
* **[ ] Data Type Optimization:**
    * **[ ] Choose Efficient Data Types:** Use the smallest data type that can accommodate your data (e.g., `SMALLINT` instead of `BIGINT` if the values will always be small).
    * **[ ] Use `ENUM` Types:** For enumerated values, `ENUM` types can improve storage and query performance.
* **[ ] Database Configuration:**
    * **[ ] Tune PostgreSQL Parameters:** Adjust parameters like `shared_buffers`, `work_mem`, `effective_cache_size`, and `maintenance_work_mem` based on your server's resources and workload. (Requires deep understanding of your system)
    * **[ ] Regular Maintenance:**  Run `VACUUM` and `ANALYZE` regularly to maintain database
