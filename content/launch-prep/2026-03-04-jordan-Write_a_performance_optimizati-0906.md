# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T09:06:51.216333

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to optimize your Express application running against a PostgreSQL database. It's broken down into categories for easier navigation and prioritization.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZES` to identify queries with high `cost` or long `execution time`.
    * **Create Appropriate Indexes:** Add indexes on frequently queried columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns frequently together.
    * **Index Types:** Choose the right index type (B-tree, Hash, GiST, GIN) based on query patterns. B-tree is generally the default and a good starting point.
    * **Regularly Review Indexes:** Monitor index usage and remove unused or redundant indexes.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need. Reduces data transfer and memory usage.
    * **Use `JOIN` Effectively:**  Ensure appropriate join types are used.  Understand the difference between `INNER JOIN`, `LEFT JOIN`, and `RIGHT JOIN`.
    * **Optimize `WHERE` Clauses:** Use indexes effectively, and avoid using functions in `WHERE` clauses on indexed columns.
    * **Use `LIMIT`:**  Limit the number of rows returned when appropriate to reduce processing time.
    * **Optimize `ORDER BY` Clauses:**  Indexes can significantly speed up `ORDER BY` operations, especially on large datasets.
    * **Subquery Optimization:**  Rewrite subqueries as joins whenever possible.  Correlated subqueries are often performance bottlenecks.
    * **Use Common Table Expressions (CTEs):** Can improve readability and sometimes performance for complex queries.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust this value based on your server's RAM to optimize PostgreSQL's memory usage for caching.
    * **`work_mem`:**  Increase this to allow PostgreSQL to buffer more data in memory during operations like sorting and grouping.
    * **`effective_cache_size`:**  Help PostgreSQL estimate its available cache size.
    * **Connection Pooling:** Use a connection pooling mechanism (pgbouncer, etc.) to reduce the overhead of establishing new database connections.
    * **Regular Maintenance:**  Run `VACUUM` and `ANALYZE` regularly to maintain database statistics and clean up dead tuples.
* **[ ] Data Types:**
    * **Use the Right Data Types:** Choose the most appropriate data types for your columns to minimize storage and improve query performance.  Don’t use `TEXT` if you only need a limited string length.


**II. Express Application Optimization**

* **[ ] Connection Pooling:**
    * **Use a Connection Pool:**  Don't create a new database connection for each request. Use a connection pool to reuse existing connections.  Libraries like `pg-pool` and `sequelize` handle this automatically.
* **[ ] Query Optimization (in your Express code):**
    * **Avoid N+1 Queries:**  This is a common problem where you make one query to get a list of items, then make a separate query for each item in the list.  Use `JOIN`s or batch queries to avoid this.
    * **Data Validation:**  Validate data on the server-side to prevent unexpected errors and ensure data integrity.
    * **Asynchronous Operations:**  Use `async/await` or Promises to handle asynchronous operations efficiently, preventing blocking the event loop.
* **[ ] Code Optimization:**
    * **Minimize Code Complexity:** Write clean, well-
