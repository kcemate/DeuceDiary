# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T02:11:57.467584

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing the performance of your Express.js application interacting with a PostgreSQL database. It's broken down into categories with actionable steps. Remember to prioritize based on your specific application and observed bottlenecks.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `pg_stat_statements` extension to identify queries with high execution times.
    * **Analyze Data Types:** Ensure appropriate data types are used – avoid `TEXT` for large data when `VARCHAR` or `JSONB` might be better.
    * **Create Indexes:** Create indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
        * **B-Tree Indexes:** Most common, suitable for equality, range, and sorting.
        * **GIN Indexes:** For full-text search or searching complex data types (e.g., arrays, JSONB).
        * **GIST Indexes:** For geographic data or complex data structures.
        * **BRIN Indexes:**  For large tables with correlated data.
    * **Index Maintenance:** Regularly rebuild or reorganize indexes (especially after significant data changes) with `REINDEX` or `VACUUM ANALYZE`.
* **[ ] Query Optimization:**
    * **Use `EXPLAIN`:**  Analyze query execution plans using `EXPLAIN` to identify potential bottlenecks (e.g., full table scans).
    * **Rewrite Queries:** Optimize the SQL queries themselves:
        * **Avoid `SELECT *`:** Only select the necessary columns.
        * **Use `JOIN`s efficiently:** Ensure `JOIN` conditions are properly indexed and optimized.
        * **Avoid `OR` in `WHERE` clauses (if possible):**  `OR` often prevents index usage. Consider using `UNION ALL` or rewriting the query.
        * **Limit Results:** Use `LIMIT` to restrict the number of rows returned, especially during development and testing.
        * **Use `WITH` clauses (Common Table Expressions - CTEs):** Can improve readability and performance for complex queries.
        * **Prepared Statements:**  Use prepared statements for frequently executed queries to avoid parsing overhead.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Adjust to optimize PostgreSQL's memory allocation.  A good starting point is 25-40% of system RAM.
    * **`work_mem`:** Controls the amount of memory used for sorting and hashing operations. Increase for complex queries.
    * **`maintenance_work_mem`:** Memory used during maintenance operations like `VACUUM`.
    * **`effective_cache_size`:**  Inform PostgreSQL about the available disk cache.
    * **`autovacuum`:**  Ensure `autovacuum` is enabled and properly configured to maintain database statistics and prevent transaction log bloat.
* **[ ] Database Statistics:** Regularly run `ANALYZE` to update database statistics, which are crucial for the query planner.


**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**
    * **Use a connection pool:**  Avoid creating new database connections for each request. Use a library like `pg-pool` or `sequelize`'s connection pool.
* **[ ] Asynchronous Operations:**
    * **Use `async/await` or Promises:**  Handle asynchronous database operations efficiently.
* **[ ] Route Optimization:**
    * **Minimize Middleware:** Reduce the number of middleware functions used in each route.
    * **Route Prioritization:**  Order routes by frequency of access (most frequent first).
    * **Route Parameter Validation:** Validate route parameters early to avoid unnecessary database queries.
* **[ ]
