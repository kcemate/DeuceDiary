# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-05T19:55:18.012007

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers common performance optimization strategies for applications built with Express.js and PostgreSQL. It's categorized for easier navigation and focuses on key areas.

**I. Express.js - Request Handling & Server Performance**

* **[ ] 1. Logging & Monitoring:**
    * **Implement Proper Logging:** Use a robust logging library (e.g., Winston, Bunyan) for debugging and identifying bottlenecks.  Log request times, response times, and errors.
    * **Performance Monitoring:**  Use tools like New Relic, Datadog, Prometheus, or Grafana to track key metrics (response times, error rates, database query times).
* **[ ] 2. Route Optimization:**
    * **Minimize Route Complexity:** Keep routes simple and focused.  Avoid deeply nested routes.
    * **Use `express.Router`:**  Organize routes into modular routers to improve maintainability and potentially reduce overhead.
    * **Route Guards:** Use route guards (`express.static`, `express.json`, `express.urlencoded`) effectively, but minimize their complexity.
* **[ ] 3. Middleware Management:**
    * **Reduce Middleware:** Only use necessary middleware. Each middleware adds overhead.
    * **Order Matters:**  Optimize the order of your middleware.  Place heavier middleware towards the end.
    * **Cache Middleware:**  Utilize caching middleware (e.g., `express-cache-manager`) for static content or frequently accessed data.
* **[ ] 4.  Static Asset Serving:**
    * **Serve Static Files Directly:**  Use `express.static()` to serve static files (images, CSS, JavaScript) efficiently. Configure appropriate caching headers.
* **[ ] 5.  Keep Express Updated:**  Regularly update to the latest Express.js version for bug fixes and performance improvements.
* **[ ] 6. Process Manager:** Use a process manager like PM2 or Forever to ensure your Express app restarts automatically after crashes and handles load effectively.


**II. PostgreSQL - Database Optimization**

* **[ ] 1. Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's logging and `EXPLAIN ANALYZE` to identify queries that are performing poorly.
    * **Strategic Indexing:** Create indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses. *Don't over-index.*
    * **Composite Indexes:**  For queries using multiple columns in `WHERE` clauses, consider composite indexes.
    * **Index Types:**  Choose the appropriate index type (B-tree, Hash, GIN, GiST) based on query patterns.  B-tree is generally the best starting point.
* **[ ] 2. Query Optimization:**
    * **`EXPLAIN ANALYZE`:**  Use this command *before* optimizing queries. It shows the query execution plan and actual execution times.
    * **Rewrite Slow Queries:**  Often, a poorly written query is the root cause of performance problems.  Simplify logic, avoid nested `SELECT` statements, and use joins effectively.
    * **Use `LIMIT` and `OFFSET` Carefully:**  `OFFSET` can be slow for large datasets. Consider alternatives like keyset pagination if possible.
    * **Avoid `SELECT *`:**  Only select the columns you need.
    * **Use `WITH` (Common Table Expressions - CTEs):** Can improve readability and sometimes performance, especially for complex queries.
* **[ ] 3. Database Configuration:**
    * **Memory Allocation:** Adjust PostgreSQL's memory settings (`shared_buffers`, `work_mem`) based on your server's resources and workload.
    * **Connection Pool:**  Use a connection pool (
