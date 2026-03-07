# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T21:01:47.607001

## Performance Optimization Checklist: Express + PostgreSQL

This checklist breaks down performance optimization strategies for a typical Express.js application leveraging a PostgreSQL database. It's organized by area and categorized by effort (Low, Medium, High).

**I. Application Level (Express.js)**

* **Low Effort:**
    * **Logging:** Implement efficient logging (e.g., Winston, Bunyan) – avoid excessive logging during performance testing.
    * **Error Handling:** Robust error handling is crucial, but avoid overly verbose error messages in production.  Centralized error handlers are recommended.
    * **Code Reviews:** Regular code reviews can identify potential inefficiencies or anti-patterns.
    * **Keep Dependencies Updated:** Regularly update Express.js and its dependencies to benefit from bug fixes and performance improvements.
* **Medium Effort:**
    * **Middleware Optimization:**  Carefully evaluate the number and complexity of your middleware.  Disable or optimize slow/unnecessary middleware. Consider using a middleware caching layer.
    * **Request Parsing:** Use `express.json()` and `express.urlencoded()` appropriately.  Don't over-parse data if it's not required.
    * **Keep Express.js Lean:** Avoid adding unnecessary features or frameworks to your application.  Focus on core functionality.
    * **Concurrency Handling:** Understand how Express handles concurrency.  Consider using cluster or worker threads for CPU-bound tasks.
* **High Effort:**
    * **Microservices Architecture (if applicable):** If your application is monolithic, consider breaking it down into microservices to improve scalability and resource utilization.
    * **Load Balancing:** Implement load balancing to distribute traffic across multiple Express instances.



**II. Database (PostgreSQL) - Query Optimization**

* **Low Effort:**
    * **Index Usage:**  Make sure indexes are being used.  Use `EXPLAIN ANALYZE` to identify missing or ineffective indexes.
    * **`EXPLAIN ANALYZE`**:  Become proficient with `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries and identify bottlenecks.
    * **Query Logging:**  Enable query logging (with careful monitoring to avoid performance impact) to identify slow-running queries.
* **Medium Effort:**
    * **Slow Query Logging:**  Configure PostgreSQL's slow query log to capture queries exceeding a specified execution time. Analyze these logs regularly.
    * **Query Optimization Techniques:**
        * **Avoid `SELECT *`:**  Only retrieve the columns you need.
        * **Use `JOIN`s efficiently:** Use the correct `JOIN` type (INNER, LEFT, RIGHT) and ensure proper indexing on join columns.
        * **Optimize `WHERE` clauses:** Use indexes effectively, avoid complex expressions in `WHERE` clauses, and order your conditions.
        * **Use `LIMIT` judiciously:**  Especially with `JOIN`s.
        * **Avoid `LIKE '%...%'`:**  Leading wildcards prevent index usage.  Consider full-text search if necessary.
        * **Use appropriate data types:** Ensure you're storing data in the most efficient data type for your needs.
    * **Review and Refactor Queries:** Regularly review existing queries and refactor them for better performance.
* **High Effort:**
    * **Materialized Views:**  Create materialized views for frequently accessed and relatively static data to pre-compute results.
    * **Partitioning:**  Partition large tables to improve query performance and manageability.
    * **Database Schema Optimization:**  Review your schema design for potential inefficiencies (e.g., overly wide tables, unnecessary joins).

**III. PostgreSQL Server Configuration & Maintenance**

* **Low Effort:**
    * **Connection Pooling:**  Use a connection pooler like PgBouncer to reduce the overhead of establishing new connections.
