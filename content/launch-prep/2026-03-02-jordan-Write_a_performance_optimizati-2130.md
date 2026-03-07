# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T21:30:28.927916

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist covers key areas for optimizing the performance of your Express.js application running on Railway, focusing on database, query, caching, CDN, and compression.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify the queries taking the most time.
    * **Create Appropriate Indexes:**  Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for common combinations.
    * **Index Types:**  Evaluate different index types (B-tree, GiST, GIN, BRIN) based on data types and query patterns. B-tree is generally a good starting point.
    * **Index Maintenance:**  Regularly analyze and vacuum your database to maintain index efficiency.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries. Identify potential bottlenecks like full table scans or inefficient joins.
    * **Rewrite Complex Queries:** Simplify complex queries, break them down into smaller steps if possible, and optimize join conditions.
    * **Avoid `SELECT *`:** Only select the columns you need.
    * **Use Prepared Statements:**  Prepared statements improve performance by parsing and optimizing queries only once.
    * **Batch Operations:**  Group related database operations into batches to reduce the overhead of individual transactions.
    * **Data Type Considerations:**  Use appropriate data types to minimize storage and improve query performance (e.g., `INTEGER` instead of `VARCHAR` for IDs).
* **[ ] Database Configuration:**
    * **PostgreSQL Configuration Settings:** Review and adjust PostgreSQL configuration parameters like `shared_buffers`, `work_mem`, and `effective_cache_size` based on your application's workload. Railway often provides some control for these.
    * **Connection Pooling:**  Utilize a connection pooler like `pgbouncer` (recommended for Railway) to minimize the overhead of establishing new database connections. Railway should handle this by default for its PostgreSQL instance.


**II. Express.js Application Optimization**

* **[ ] Code Optimization:**
    * **Efficient Algorithms:** Choose efficient algorithms and data structures for your application logic.
    * **Minimize Network Calls:** Reduce the number of HTTP requests by batching operations or using techniques like GraphQL.
    * **Lazy Loading:**  Load resources (images, scripts) only when they are needed.
    * **Remove Unused Code:**  Eliminate dead code and dependencies.
* **[ ] Middleware Optimization:**
    * **Careful Selection:** Choose middleware wisely, avoiding bulky or inefficient options.
    * **Order Matters:** Arrange middleware in the optimal order to minimize overhead.

**III. Caching**

* **[ ] Server-Side Caching:**
    * **Redis/Memcached:** Utilize a caching layer like Redis or Memcached for frequently accessed data, session data, and API responses. Railway offers Redis instances.
    * **Cache Invalidation Strategies:**  Implement a robust cache invalidation strategy (TTL, event-based invalidation) to prevent serving stale data.
* **[ ] Browser Caching:**
    * **Set Appropriate Cache Headers:** Configure Express.js to set `Cache-Control` and `Expires` headers to leverage browser caching.
    * **Versioned Assets:**  Use versioned filenames for static assets (e.g., `style.css?v=1.2.3`) to force browsers to re-download assets when they change.

**IV. Content Delivery Network (CDN)**

* **[ ] Use a CDN:**
