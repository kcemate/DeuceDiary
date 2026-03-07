# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T22:55:18.150882

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing the performance of an Express application using PostgreSQL. It's broken down into categories with actionable steps and considerations.

**I. PostgreSQL Optimization (Database Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `pg_stat_statements` extension to identify slow-running queries.
    * **Analyze Data Types:** Ensure appropriate data types are used to minimize storage and improve indexing.  Don’t use `TEXT` when `VARCHAR` would suffice.
    * **Create Appropriate Indexes:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
        * **B-Tree Indexes:** Standard indexes, good for equality and range queries.
        * **GIN Indexes:**  For indexing arrays and JSON data.
        * **GiST Indexes:** For complex data types and range queries (e.g., geospatial data).
        * **BRIN Indexes:**  Suitable for very large tables with naturally clustered data.
    * **Composite Indexes:**  Consider composite indexes for queries that filter on multiple columns.
    * **Regular Index Maintenance:** Run `VACUUM` and `ANALYZE` regularly (especially after significant data changes). `VACUUM` reclaims space and updates statistics; `ANALYZE` updates the query planner’s statistics based on data.
* **[ ] Query Optimization:**
    * **Use `EXPLAIN`:** Analyze query execution plans using `EXPLAIN` to identify bottlenecks (e.g., full table scans, inefficient joins).
    * **Rewrite Slow Queries:** Optimize query structure – can you simplify joins, reduce nested subqueries, or use more efficient SQL constructs?
    * **Avoid `SELECT *`:**  Only select the columns you actually need.  This reduces data transfer and memory usage.
    * **Use `LIMIT` Strategically:**  If you only need a subset of results, always use `LIMIT`.
    * **Optimize Joins:** Ensure join columns are properly indexed and that join order is appropriate (usually, join the smallest tables first).
    * **Consider Using Common Table Expressions (CTEs):**  CTEs can sometimes improve readability and performance, especially with complex queries.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Allocate sufficient shared memory for PostgreSQL caching (typically 25-40% of system RAM).
    * **`work_mem`:**  Increase this to allow PostgreSQL to perform more sorting and hashing in memory, potentially reducing disk I/O.
    * **`effective_cache_size`:**  Tell the query planner how much memory is available for caching.
    * **`maintenance_work_mem`:** Increase this for tasks like `VACUUM` and `ANALYZE`.
    * **Connection Pooling:**  Use a connection pooler (like PgBouncer) to reduce the overhead of establishing new database connections.
* **[ ]  Data Partitioning (Consider for Large Tables):**  Partitioning can improve query performance by allowing PostgreSQL to only scan relevant partitions.



**II. Express Application Optimization (Node.js + Middleware Focus)**

* **[ ] Code Efficiency:**
    * **Optimize Routing:** Use efficient route definitions and minimize the number of routes.
    * **Avoid Unnecessary Middleware:**  Remove any middleware that isn't essential.
    * **Use Efficient Algorithms:**  Optimize your code logic to avoid unnecessary loops or computations.
    * **Minimize External Dependencies:**  Reduce the number of external libraries used.
* **[ ] Asynchronous Operations:**
    * **Use `async/await`:**  Ensure you’re correctly using `async/await` to avoid
