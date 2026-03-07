# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T12:31:05.739527

## Performance Optimization Checklist: Express + PostgreSQL

This checklist provides a breakdown of optimization strategies for your Express (Node.js) application interacting with a PostgreSQL database. It's broken down into categories with a suggested priority level (High, Medium, Low).

**I. Database Optimization (PostgreSQL Focus - This is 80% of your effort!)**

* **High Priority:**
    * **Indexing:** This is *the* most impactful area.
        * **Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and pinpoint missing or ineffective indexes.
        * **Index Relevant Columns:**  Index columns used frequently in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
        * **Composite Indexes:** Consider composite indexes for frequently queried combinations of columns.
        * **Index Data Types:** Ensure indexes are defined on the correct data types.
        * **Regularly Rebuild Indexes:** `REINDEX` indexes periodically, especially after large data modifications.
    * **Query Optimization:**
        * **Use `EXPLAIN`:**  Always use `EXPLAIN` to understand how PostgreSQL is executing your queries before changing anything.
        * **Avoid `SELECT *`:** Only select the columns you actually need.
        * **Write Efficient SQL:**
            * **Use `JOIN` efficiently:**  Use `INNER JOIN` when appropriate and ensure proper indexing on join columns.
            * **Minimize Subqueries:**  Rewrite subqueries as joins if possible.
            * **Use `LIMIT` and `OFFSET`:**  Properly utilize these for pagination and prevent loading large datasets unnecessarily.
            * **Use `WHERE` clauses effectively:** Optimize the order of conditions and use appropriate operators.
        * **Prepared Statements:**  Use prepared statements to reuse query plans, reducing parsing overhead.
    * **Database Configuration:**
        * **`shared_buffers`:**  Increase this setting (typically 25% of RAM) to allow PostgreSQL to cache data.
        * **`work_mem`:**  Increase this setting for memory-intensive operations like sorting and hashing.
        * **`effective_cache_size`:**  Estimate the size of your PostgreSQL cache (based on RAM).
        * **`maintenance_work_mem`:**  Increase this for maintenance tasks (e.g., `VACUUM`, `CREATE INDEX`).
        * **Monitor Performance:** Use tools like `pg_stat_statements` to track query performance and identify slow queries.



* **Medium Priority:**
    * **Vacuuming:** Regularly run `VACUUM` to reclaim dead tuples and update statistics.  Automated scheduling is recommended.
    * **Analyze:** Run `ANALYZE` periodically to update PostgreSQL's statistics about table data distribution, improving query planning.
    * **Connection Pooling:** Use a connection pooling library (e.g., `pg-pool`, `node-postgres`) to reduce the overhead of establishing new database connections.
    * **Data Type Optimization:**  Use the most appropriate data types for your columns to minimize storage and improve query performance.


* **Low Priority:**
    * **Partitioning:**  Consider partitioning large tables for improved query performance (especially for date-based or range-based queries).
    * **Read Replicas:**  Utilize read replicas for read-heavy workloads to offload traffic from the primary database.



**II. Express Application Optimization**

* **High Priority:**
    * **Caching:**
        * **Client-Side Caching:**  Implement browser caching for static assets (JavaScript, CSS, images).
        * **Server-Side Caching:**  Use a caching library (e.g., `node-cache`, `redis`) to cache frequently accessed data (e.g., API responses, user
