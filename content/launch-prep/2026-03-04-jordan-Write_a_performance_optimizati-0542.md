# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T05:42:52.897650

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas for optimizing your Express application running against a PostgreSQL database. It's broken down into categories with varying levels of effort and potential impact.

**I. Database Optimization (PostgreSQL Focus - ~50% of Impact)**

* **[High] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and missing indexes.
    * **Index Relevant Columns:** Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for queries targeting multiple columns.
    * **Partial Indexes:**  Optimize queries targeting a specific subset of data.
    * **Regular Index Maintenance:** `VACUUM ANALYZE` regularly to maintain index statistics and defragmentation.
* **[High] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you need.
    * **Use `EXISTS` instead of `COUNT(*)`:**  For checking existence, `EXISTS` is often more efficient.
    * **Rewrite Subqueries:**  Often subqueries can be rewritten as joins for better performance.
    * **Optimize `JOIN` Order:**  Ensure the most selective tables are joined first.
    * **Use `LIMIT`:**  Always use `LIMIT` when possible, especially with large tables.
    * **Use Common Table Expressions (CTEs) for Complex Logic:**  Can improve readability and sometimes performance.
* **[Medium] Data Types:**
    * **Choose Appropriate Data Types:**  Use the smallest data type that can accommodate your data.  Avoid `TEXT` if `VARCHAR` is sufficient.
    * **Use `UUID` instead of `SERIAL` for Primary Keys (in appropriate contexts):**  `UUID`s are generally more efficient for distributed systems.
* **[Low] Database Configuration:**
    * **Tune PostgreSQL Configuration:** Adjust settings like `shared_buffers`, `work_mem`, `effective_cache_size` based on your server's resources and workload.  Consult PostgreSQL documentation for recommendations.
    * **Connection Pooling:**  Use a connection pooler like PgBouncer or the built-in connection pooler in your Express app to reduce connection overhead.

**II. Express Application Optimization (~30% of Impact)**

* **[High] Code Optimization:**
    * **Efficient Data Fetching:**  Minimize the amount of data transferred between the database and the application.
    * **Avoid N+1 Problem:**  Use techniques like eager loading or join queries to avoid fetching related data in separate queries.
    * **Caching:** Implement caching strategies (e.g., Redis, Memcached) for frequently accessed data. Consider using Express's built-in caching middleware.
    * **Asynchronous Operations:** Use `async/await` effectively to avoid blocking the event loop.
    * **Optimize Loops:**  Review loops for efficiency; can they be replaced with array methods or database queries?
* **[Medium] Middleware:**
    * **Use Efficient Middleware:**  Choose lightweight middleware and avoid excessive middleware layers.
    * **Cache Middleware Responses:**  Use middleware to cache responses for frequently requested routes.
* **[Low] Route Handling:**
    * **Optimize Route Definitions:** Reduce the number of routes and consolidate logic where possible.
    * **Use Route Parameters Carefully:**  Avoid overly complex route parameter validation.
* **[Low] Logging & Monitoring:**
    * **Implement Logging:** Log requests and errors for debugging and performance monitoring.
    * **Monitor Database Performance:**  Use tools like pgAdmin, pg_stat_statements, or specialized database monitoring solutions to track query performance and identify bottlenecks.


**III. Network & Infrastructure
