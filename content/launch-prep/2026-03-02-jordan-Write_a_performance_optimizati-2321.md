# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T23:21:41.831743

Okay, here's a performance optimization checklist specifically tailored for an Express.js + PostgreSQL app launching on Railway, covering database indexes, query optimization, caching, CDN, and compression.  I'll break it down into categories with actionable steps and considerations.

**I. Database (PostgreSQL) Optimization**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use database monitoring tools (pgAdmin, Datadog, New Relic, Railway's built-in metrics) to identify queries with high execution times.
    * **Add Indexes to WHERE Clauses & JOIN Columns:**  This is *critical*. Indexes dramatically speed up lookups.  Focus on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:**  If you frequently filter on multiple columns together, consider composite indexes (indexes on multiple columns).
    * **Index Types:** Review index types. B-tree indexes are the default and often sufficient, but consider GIN or GiST indexes for specialized data types (e.g., JSON, geospatial).
    * **Analyze Table Statistics:** `ANALYZE` helps PostgreSQL understand data distribution, which improves query planning. Run this regularly, especially after significant data changes. `ANALYZE tablename;`
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Use `EXPLAIN ANALYZE` on slow queries to see the execution plan.  This reveals bottlenecks – full table scans, inefficient joins, etc.
    * **Avoid `SELECT *`:**  Only select the columns you actually need.  Retrieving unnecessary data increases bandwidth and processing time.
    * **Use `LIMIT` and `OFFSET` Carefully:**  For pagination, `LIMIT` and `OFFSET` can be inefficient. Use keyset pagination (offsetting by the primary key) when feasible.
    * **Optimize JOINs:** Ensure join columns have compatible data types. Use appropriate join types (INNER, LEFT, RIGHT) based on your needs.
    * **Subqueries:** Review complex subqueries.  Sometimes they can be rewritten as joins for better performance.
    * **Use Prepared Statements/Parameterized Queries:** Prevents SQL injection and can improve performance by allowing PostgreSQL to reuse execution plans. (Express.js ORM like Sequelize or Prisma can handle this for you.)
    * **Review Transaction Isolation Levels:**  Lower isolation levels (e.g., `READ COMMITTED`) can improve performance, but be aware of potential concurrency issues. Railway might suggest best practices for this.
* **[ ] Database Connection Pooling:** Railway automatically handles connection pooling, which is good. But, confirm that your application is effectively utilizing the pool.  Monitor the pool's usage to ensure it's not exhausted.

**II. Application (Express.js) Optimization**

* **[ ] Code Optimization:**
    * **Minimize Dependencies:** Reduce the number of dependencies your application has.
    * **Efficient Data Serialization/Deserialization:** Use optimized JSON libraries (e.g., `fast-json-stringify`) and avoid unnecessary JSON parsing/stringifying.
    * **Code Profiling:** Use a JavaScript profiler to identify performance bottlenecks in your Express.js code.
* **[ ] Middleware Optimization:**  Review your Express.js middleware stack. Remove unnecessary middleware.
* **[ ] Asynchronous Operations:** Use `async/await` for handling asynchronous operations (database calls, external API requests) to avoid blocking the event loop.

**III. Caching**

* **[ ] Client-Side Caching:**
    * **HTTP Caching Headers:**  Set appropriate HTTP caching headers (`Cache-Control`, `Expires`, `ETag`) to enable browsers to cache static assets (JavaScript, CSS, images).
* **[ ] Server-Side C
