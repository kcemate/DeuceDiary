# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T01:33:41.853077

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines potential optimizations for an Express.js application interacting with a PostgreSQL database. It’s categorized for clarity and prioritizes impactful changes.

**I. General Application Architecture & Design (Impact: High)**

* **[ ] Microservices (Consider):** If your application is complex, consider breaking it into smaller, independent microservices.  This can isolate performance bottlenecks.
* **[ ] Connection Pooling:**  Always use a connection pool in your Express app (e.g., `pg-pool`) to reuse existing connections instead of creating new ones for each request. This drastically reduces the overhead of database connection establishment.
* **[ ] Asynchronous Operations:** Ensure all database interactions are performed asynchronously using `async/await` or Promises. Blocking the event loop will kill your application's responsiveness.
* **[ ] Logging & Monitoring:** Implement robust logging to track request times, database query durations, and error rates.  Use a monitoring solution (e.g., Prometheus, Grafana, New Relic) to proactively identify and diagnose issues.
* **[ ] Load Balancing:**  Distribute traffic across multiple Express instances to handle increased load and improve scalability.
* **[ ] Caching:** Implement caching layers (e.g., Redis, Memcached) for frequently accessed data to reduce database load.  Consider different caching strategies (e.g., full page caching, key-value caching).
* **[ ] API Design:** Design a well-defined API with clear endpoints and data structures to minimize over-fetching and unnecessary data transfer.


**II. Express.js Optimizations (Impact: Medium - High)**

* **[ ] Keep Express App Small:** Minimize the size of your Express app.  Remove unused middleware and code.
* **[ ] Middleware Efficiency:**  Optimize your middleware chain.  Avoid computationally expensive operations in middleware. Consider asynchronous middleware.
* **[ ] Route Handlers:** Optimize route handlers for fast response times.  Use simple logic and avoid unnecessary computations.
* **[ ] Content Delivery Network (CDN):** Utilize a CDN to serve static assets (images, CSS, JavaScript) to users geographically closer to them, reducing latency.
* **[ ] Use a Production Process Manager:** Utilize a process manager like PM2 or Forever to ensure your application stays running and automatically restarts on crashes.


**III. PostgreSQL Database Optimizations (Impact: High)**

* **[ ] Indexing:**
    * **[ ] Analyze Queries:**  Use `EXPLAIN ANALYZE` to identify slow queries and understand how PostgreSQL is executing them.
    * **[ ] Relevant Columns:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **[ ] Composite Indexes:** For queries using multiple columns in the same clause, consider composite indexes.
    * **[ ] Index Types:** Choose the appropriate index type for your data (B-tree, Hash, GiST, GIN, BRIN).  B-tree is generally the best default.
    * **[ ] Regular Index Maintenance:**  Run `VACUUM ANALYZE` regularly to maintain index statistics and defragment indexes. This is *critical* for performance.
* **[ ] Query Optimization:**
    * **[ ] Avoid `SELECT *`:**  Always specify the columns you need.
    * **[ ] Use `LIMIT`:** Limit the number of rows returned, especially for large tables.
    * **[ ] Use `WHERE` Clauses Effectively:** Optimize `WHERE` clauses for efficient filtering.
    * **[ ] Optimize `JOIN`s:**  Ensure `JOIN` columns are indexed and use the appropriate `JOIN` type (e.g., `INNER JOIN` vs. `LEFT JOIN`).
    * **[ ]
