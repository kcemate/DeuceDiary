# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T02:18:58.262223

## Performance Optimization Checklist for Express + PostgreSQL

This checklist outlines key areas and steps to optimize the performance of your Express.js application when communicating with a PostgreSQL database. It’s broken down into categories with increasing levels of complexity.

**I. Initial Assessment & Monitoring (Low Hanging Fruit)**

* **[ ] Logging:** Implement robust logging throughout your application, including database queries, response times, and error handling. This is crucial for identifying bottlenecks.
* **[ ] Application Profiling:** Use tools like `clinic.js` or `New Relic` to identify slow routes, function calls, and areas of your Express application consuming excessive resources.
* **[ ] Database Monitoring:** Set up PostgreSQL monitoring tools like `pg_stat_statements`, `pgAdmin` or a service like Datadog/New Relic to track slow queries, connection pools, and overall database performance.
* **[ ] Load Testing:** Simulate realistic user traffic to identify performance issues under pressure. Use tools like `k6`, `Artillery`, or `JMeter`.
* **[ ] Error Tracking:** Implement an error tracking solution (e.g., Sentry, Rollbar) to capture and analyze errors, which often reveal underlying performance problems.


**II. PostgreSQL Database Optimization**

* **[ ] Indexing:** This is *the* most important factor.
    * **[ ] Analyze Query Patterns:** Understand *how* your application queries the database.  Look for frequent WHERE clause columns, JOIN columns, and ORDER BY columns.
    * **[ ] Create Appropriate Indexes:**
        * **B-Tree Indexes:** Standard indexes for equality and range queries.
        * **GIN Indexes:**  For indexing array and JSON data (useful for flexible search).
        * **GiST Indexes:**  For indexing geometric data.
        * **Fulltext Indexes:** For text search.
    * **[ ] Composite Indexes:** Consider composite indexes for queries using multiple columns in the WHERE clause. Order matters within the composite index.
    * **[ ] Regularly Analyze and Vacuum:** `ANALYZE` updates statistics used by the query planner. `VACUUM` reclaims dead tuples (rows marked as deleted but not yet removed).  Automate this with cron jobs.
* **[ ] Query Optimization:**
    * **[ ] Use `EXPLAIN`:**  Analyze query execution plans to understand how PostgreSQL is executing your queries. Identify full table scans, inefficient joins, and missing indexes.
    * **[ ] Write Efficient SQL:**
        * **Avoid `SELECT *`:**  Only select the columns you need.
        * **Use `WHERE` clauses effectively:** Filter data early in the query.
        * **Optimize `JOIN` conditions:** Ensure proper indexing on join columns.  Use `INNER JOIN` when appropriate.
        * **Avoid using `LIKE '%...%'`:** This is a full table scan.  Consider full-text search if possible.
        * **Use appropriate data types:** Smaller data types improve performance.
        * **Use `LIMIT` and `OFFSET`:** For pagination, minimize the amount of data retrieved.
    * **[ ] Prepared Statements:**  Use prepared statements to avoid repeatedly parsing and compiling the same query.
* **[ ] PostgreSQL Configuration:**
    * **[ ] `shared_buffers`:**  Increase the amount of memory PostgreSQL uses for caching data.
    * **[ ] `work_mem`:**  Increase the amount of memory used for sorting and operations.
    * **[ ] `effective_cache_size`:**  Estimate the amount of memory available for PostgreSQL's cache.
    * **[ ] `maintenance_work_mem`:** Memory used for maintenance tasks like `VACUUM`.
    * **[ ] Tune for your workload:**  PostgreSQL configuration should be
