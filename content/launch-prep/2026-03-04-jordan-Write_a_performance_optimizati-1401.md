# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T14:01:40.838748

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing your Express.js application interacting with a PostgreSQL database. It's divided into categories with increasing levels of complexity.

**I. Initial Setup & Basic Checks (Low Hanging Fruit)**

* [ ] **Database Connection Pooling:** Ensure you're using a connection pool (like `pg-pool`) in your Express app.  This dramatically reduces the overhead of establishing new connections for each request.
* [ ] **Query Logging:** Implement query logging with a tool like `pg-stat-statements` or `Sequelize logging` to identify slow queries.  Analyze these queries for inefficiencies.
* [ ] **Correct `pg` Version:** Use the latest stable version of the `pg` package.  Newer versions often include performance improvements.
* [ ] **Node.js Version:** Use a modern, supported Node.js version (v16+ recommended).
* [ ] **Process Manager:** Utilize a process manager like `pm2` or `forever` to ensure your application restarts automatically after crashes and manages resource usage.
* [ ] **Logging Levels:**  Adjust logging levels appropriately for development and production. Excessive logging can negatively impact performance.


**II. PostgreSQL Optimization (Database Side - Collaborate with DBA)**

* [ ] **Index Strategy:**
    * [ ] **Analyze Data:** Understand your data and query patterns.
    * [ ] **Identify Missing Indexes:**  Use `EXPLAIN ANALYZE` on slow queries to see if indexes are missing.
    * [ ] **Composite Indexes:** Consider composite indexes for queries that frequently filter on multiple columns.
    * [ ] **Index Types:**  Choose the appropriate index type (B-tree, GiST, GIN, etc.) based on your query needs. B-tree is generally the best starting point.
    * [ ] **Index Maintenance:** Regularly run `VACUUM` and `ANALYZE` to keep your indexes and statistics up-to-date.
* [ ] **Query Optimization:**
    * [ ] **Use Prepared Statements:**  Prepared statements reuse query execution plans, greatly improving performance for repeated queries.
    * [ ] **Avoid `SELECT *`:**  Only select the columns you actually need.
    * [ ] **Rewrite Complex Queries:** Simplify complex queries by breaking them down or using Common Table Expressions (CTEs) if necessary.
    * [ ] **Utilize `EXPLAIN ANALYZE`:**  Use this extensively to understand how PostgreSQL is executing your queries and identify bottlenecks.
    * [ ] **Avoid `LIKE '%...'`:** Leading wildcards in `LIKE` clauses prevent index usage. Consider alternatives if possible.
* [ ] **Database Configuration:**  (Requires DBA Involvement)
    * [ ] **Memory Allocation:**  Ensure PostgreSQL has sufficient memory allocated.
    * [ ] **Connection Limits:** Adjust the connection limit to align with your application's needs.
    * [ ] **Shared Buffer Size:** Tune the shared buffer size based on your workload.
    * [ ] **Work Mem:**  Increase `work_mem` to allow PostgreSQL to do more sorting in memory.
    * [ ] **Effective Cache Size:** Adjust this setting to give PostgreSQL a more accurate estimate of available memory.


**III. Express.js & Middleware Optimization (Application Side)**

* [ ] **Asynchronous Programming:**  Use `async/await` (or Promises) to avoid blocking the event loop.
* [ ] **Middleware Ordering:**  Order middleware carefully. Place performance-critical middleware closer to the request handler.
* [ ] **Caching (Server-Side):**  Implement server-side caching using a library like `node-cache` or `in-memory-redis` to store frequently accessed data.
* [ ] **Caching (
