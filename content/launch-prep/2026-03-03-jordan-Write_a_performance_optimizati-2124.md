# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T21:24:30.362898

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines steps to optimize the performance of your Express.js application running against a PostgreSQL database. It's broken down into categories with varying levels of effort and impact.

**I. General Application & Architecture (Low Effort - High Impact)**

* [ ] **Stateless Design:**  Ensure your Express application is stateless. Session management should be handled by external services like Redis or a database.
* [ ] **Code Optimization:**
    * [ ] Minimize code duplication.
    * [ ] Use efficient data structures and algorithms.
    * [ ] Profile your code to identify bottlenecks. Tools like `node --prof` can help.
* [ ] **Keep Dependencies Updated:** Regularly update Express, PostgreSQL drivers, and related packages to benefit from performance improvements and bug fixes.
* [ ] **Use a Production-Ready Process Manager:**  Utilize a process manager like PM2 or Forever to ensure your app restarts automatically on crashes and manages resource usage.
* [ ] **Environment Variables:** Use environment variables for configuration (database credentials, ports, etc.) to allow easy switching between environments.
* [ ] **Logging & Monitoring:** Implement robust logging and monitoring to track performance metrics and identify issues proactively. Tools like Prometheus, Grafana, and New Relic are helpful.


**II. PostgreSQL Database Optimization (Medium Effort - High Impact)**

* [ ] **Indexing:** This is *crucial*.
    * [ ] Analyze your queries and identify missing indexes.
    * [ ] Use `EXPLAIN ANALYZE` to see how PostgreSQL is executing your queries and identify index usage.
    * [ ] Create indexes on columns frequently used in `WHERE` clauses, `JOIN` conditions, and `ORDER BY` clauses.
    * [ ] Consider composite indexes for queries using multiple columns in a `WHERE` clause.
    * [ ] Don't over-index!  Too many indexes can slow down write operations.
* [ ] **Data Types:** Choose the most appropriate data types for your columns. Avoid using `TEXT` when `VARCHAR` will suffice.
* [ ] **Normalization:** Ensure your database schema is properly normalized to reduce data redundancy and improve data integrity.
* [ ] **Vacuuming & Analyze:** Regularly run `VACUUM` and `ANALYZE` on your tables.
    * `VACUUM` reclaims storage space and updates table statistics.
    * `ANALYZE` updates table statistics used by the query planner. (Schedule this, don’t do it manually constantly).
* [ ] **Connection Pooling:**  Use a connection pooler like `pg-pool` or `node-postgres` with connection pooling. This reduces the overhead of establishing new database connections for each request.
* [ ] **Query Analyzer:**  Regularly run `EXPLAIN ANALYZE` on your most complex queries to understand their execution plans and identify areas for optimization.
* [ ] **PostgreSQL Version:** Ensure you are running the latest stable version of PostgreSQL for performance improvements and bug fixes.
* [ ] **Hardware:** Ensure your PostgreSQL server has sufficient RAM, CPU, and I/O performance.


**III. Express.js & Query Optimization (Medium Effort - Medium Impact)**

* [ ] **Asynchronous Operations:** Always use asynchronous operations (Promises or `async/await`) for database queries to avoid blocking the event loop.
* [ ] **Prepared Statements:**  Use prepared statements (parameterized queries) to avoid parsing and compiling the same query multiple times.  This is built into `pg-pool` and `node-postgres`.
* [ ] **Limit Results:** Only retrieve the data you need. Use `LIMIT` clauses in your queries to reduce the amount of data transferred over the network.
* [ ] **Pagination:** Implement pagination for large result sets
