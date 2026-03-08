# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T15:00:36.877984

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing the performance of an Express.js application leveraging a PostgreSQL database. It's categorized for clarity and includes suggested actions and potential tools for monitoring.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` for slow queries to identify missing or ineffective indexes.
    * **Identify Columns for Indexing:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for multi-column filtering.
    * **Index Types:** Choose appropriate index types (B-tree, GiST, GIN, BRIN) based on data types and query patterns.
    * **Index Maintenance:** Regularly run `VACUUM ANALYZE` to update statistics and optimize index performance.
    * **Partial Indexes:**  For specific subsets of data, use partial indexes to improve performance when querying those specific ranges.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need. This reduces data transfer and memory usage.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Optimize `JOIN`s:** Ensure proper indexing on join columns. Consider the order of joins if multiple tables are involved.  Use `INNER JOIN` where appropriate.
    * **Avoid `LIKE '%...%'`:** Leading wildcards in `LIKE` clauses prevent index usage.  Consider full-text search alternatives if suitable.
    * **Use `EXISTS` instead of `COUNT(*)` in Subqueries:**  `EXISTS` is generally faster when only checking for the presence of rows.
    * **Rewrite Complex Queries:**  Break down very complex queries into smaller, more manageable queries.
    * **Use Common Table Expressions (CTEs):** Can improve readability and potentially performance for complex logic.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Increase the shared_buffers based on your server's RAM – generally 25-50% of RAM is a good starting point.
    * **`work_mem`:** Adjust `work_mem` based on the complexity of sorting and hashing operations.
    * **`effective_cache_size`:**  Set this to a realistic estimate of your server's cache size.
    * **`maintenance_work_mem`:**  Increase this for operations like `VACUUM` and `ANALYZE`.
    * **Connection Pooling:** Implement a robust connection pooling mechanism (e.g., PgBouncer, or Express.js poolers) to reduce connection overhead.
* **[ ] Data Types:**
    * **Choose Appropriate Data Types:** Use the most appropriate data types for your columns to minimize storage and improve query performance.  For example, use `INTEGER` instead of `VARCHAR` for integers.
* **[ ] Normalization:** Ensure your database schema is properly normalized to avoid data redundancy and improve data integrity.

**II. Express.js Application Optimization**

* **[ ] Asynchronous Operations:**  Utilize `async/await` or Promises to handle asynchronous database interactions correctly.  Avoid blocking the event loop.
* **[ ] Connection Pooling (Express):** Use a connection pooling middleware for Express (e.g., `pg-pool`) to manage database connections efficiently.
* **[ ] Minimize Middleware:**  Remove unnecessary middleware to reduce overhead.
* **[ ] Efficient Data Handling:**
    * **Stream Data:**  Avoid loading entire responses into memory if possible. Stream data to the client using response streaming.
    * **Pagination:**  Implement pagination for
