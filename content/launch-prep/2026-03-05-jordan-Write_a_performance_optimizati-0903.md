# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-05T09:03:54.636899

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing a web application built with Express.js and PostgreSQL. It’s broken down into categories with varying levels of effort and impact.

**I. Database Optimization (PostgreSQL)**

* **[High Priority] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` for slow queries to identify missing indexes and inefficient execution plans.
    * **Index Appropriate Columns:** Index columns used in WHERE clauses, JOIN conditions, ORDER BY clauses, and aggregate functions.
    * **Composite Indexes:**  Consider composite indexes for queries joining multiple columns.
    * **Covering Indexes:**  Create indexes that include all columns needed to fulfill a query, avoiding table lookups.
    * **Index Maintenance:** Regularly run `VACUUM ANALYZE` to update statistics and maintain index efficiency.  Schedule this based on data volume.
* **[High Priority] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you actually need to reduce data transfer.
    * **Use `WHERE` Clauses Effectively:** Ensure your `WHERE` clauses are using indexes.
    * **Optimize JOINs:**  Ensure proper JOIN types (INNER, LEFT, RIGHT) and consider the order of tables in the JOIN.
    * **Limit Result Sets:** Use `LIMIT` clauses to prevent retrieving unnecessary data.
    * **Use `EXISTS` instead of `COUNT(*)`:**  If you only need to check if a row exists, `EXISTS` is often faster.
    * **Subquery Optimization:**  Rewrite subqueries as JOINs whenever possible.
    * **Stored Procedures:**  For complex, frequently executed logic, consider using stored procedures in PostgreSQL to reduce network overhead.
* **[Medium Priority] Data Types:**
    * **Choose Efficient Data Types:**  Use the most appropriate data types for each column.  e.g., `INT4` vs. `BIGINT` depending on the expected range.
    * **Avoid `TEXT` for Large Amounts of Data:** Consider using `VARCHAR` with appropriate length limits, or a separate table for large text fields.
* **[Low Priority] Database Configuration:**
    * **Connection Pooling:** Use a connection pooler (e.g., PgBouncer) to reduce the overhead of establishing new connections.
    * **Tune PostgreSQL Configuration:**  Adjust PostgreSQL parameters (e.g., `shared_buffers`, `work_mem`) based on your server's resources and workload. This often requires careful experimentation.
    * **Regular Updates:** Keep PostgreSQL up-to-date to benefit from performance improvements and bug fixes.



**II. Express.js Application Optimization**

* **[High Priority] Route Optimization:**
    * **Route Specificity:** Use the most specific route definitions possible.
    * **Minimize Route Handlers:** Keep route handlers concise and focused.
    * **Use Middleware Effectively:** Leverage middleware for common tasks like authentication, logging, and error handling.
* **[High Priority] Request Processing:**
    * **Caching:** Implement caching strategies (e.g., Redis, Memcached) for frequently accessed data to reduce database load.
    * **Minimize Processing Time:** Optimize the code within your route handlers to reduce processing time.
    * **Asynchronous Operations:** Use `async/await` or Promises for asynchronous operations to prevent blocking the event loop.
* **[Medium Priority] Code Quality:**
    * **Minimize Dependencies:** Reduce the number of external dependencies to minimize overhead.
    * **Code Reviews:**  Conduct regular code reviews to identify potential performance issues.
* **[Low Priority]  Template Engines:**
    * **Optimize Template Rendering:** If using a template engine, ensure efficient rendering of templates
