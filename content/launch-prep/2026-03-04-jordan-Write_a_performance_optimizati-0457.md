# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T04:57:31.303124

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers common optimization areas for a web application built with Express.js for the frontend and PostgreSQL for the backend. It's broken down into categories for clarity and includes actionable steps.

**I. PostgreSQL Optimization (Backend Focus)**

**A. Database Schema & Design:**

* [ ] **Normalization:**  Ensure your schema is properly normalized to reduce redundancy and improve data integrity. Avoid excessive denormalization unless absolutely necessary for specific performance bottlenecks.
* [ ] **Data Types:**  Use the most appropriate data types for each column.  String types should be minimized where possible. `TEXT` vs. `VARCHAR` based on expected length. Consider `INTEGER` vs. `BIGINT`.
* [ ] **Index Optimization:**
    * [ ] **Identify Slow Queries:** Use PostgreSQL's `EXPLAIN ANALYZE` command to identify queries lacking suitable indexes or using full table scans.
    * [ ] **Index Key Columns:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * [ ] **Composite Indexes:**  Consider composite indexes for queries filtering on multiple columns.
    * [ ] **Partial Indexes:**  Create indexes on a subset of rows where queries frequently filter on specific conditions.
    * [ ] **Index Maintenance:** Regularly analyze and vacuum your tables (`ANALYZE` and `VACUUM`) to keep statistics updated and data in optimal order for indexing.
* [ ] **Avoid Large Text Columns:**  Large `TEXT` columns can significantly impact performance. Consider splitting data into multiple tables or using a different approach.
* [ ] **Consider JSONB Data Type:** If you're storing semi-structured data, `JSONB` is often more efficient than `JSON` due to its indexing capabilities.


**B. Query Optimization:**

* [ ] **Use Prepared Statements:**  Prepared statements reuse query plans, significantly improving performance, especially for repeated queries.  Express.js frameworks (like Koa or Express with libraries) generally offer this functionality.
* [ ] **Minimize `SELECT *`:**  Only retrieve the columns you actually need. `SELECT *` fetches all columns, even if you don't use them, increasing network traffic and processing time.
* [ ] **Use `JOIN`s Wisely:**  Ensure `JOIN`s are optimized. Use `INNER JOIN` if appropriate, and carefully consider the order of tables in the `JOIN` clause.
* [ ] **Optimize `WHERE` Clauses:**
    * [ ] Use indexes effectively in your `WHERE` clauses.
    * [ ] Avoid using functions within `WHERE` clauses (e.g., `WHERE UPPER(name) = 'JOHN'`) as they can prevent index usage.  Consider pre-calculating values or using a function-based index.
    * [ ] Avoid `OR` clauses if possible – rewrite using `UNION` or multiple queries.
* [ ] **Limit Result Sets:** Use `LIMIT` clauses to restrict the number of rows returned, especially for pagination.
* [ ] **Use `EXPLAIN ANALYZE` Regularly:** Analyze your queries to identify bottlenecks and opportunities for optimization.
* [ ] **Review Query Plans:** Understand how PostgreSQL is executing your queries.



**C. PostgreSQL Configuration:**

* [ ] **Memory Allocation:**  Ensure PostgreSQL has sufficient memory allocated for caching data and query plans.  Adjust the `shared_buffers` and `work_mem` parameters in `postgresql.conf`.
* [ ] **Connection Pool:**  Utilize a connection pool in your Express application to avoid the overhead of repeatedly establishing and closing database connections.
* [ ] **Logging Level:** Set the logging level to `LOG` or `DEBUG` temporarily for detailed performance information (remember to reduce it after analysis
