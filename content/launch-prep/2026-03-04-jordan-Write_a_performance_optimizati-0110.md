# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T01:10:54.289358

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing the performance of your Express.js application interacting with a PostgreSQL database. It's broken down into categories with varying levels of effort and impact.

**I. Database Optimization (PostgreSQL - Most Impactful)**

* **[High] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` on slow queries to pinpoint missing indexes.
    * **Index Key Columns:** Add indexes on frequently queried columns, especially those used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries that filter on multiple columns frequently.
    * **Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, etc.) based on your data and query patterns.
    * **Regularly Review Indexes:**  Remove unused or redundant indexes.  `pg_stat_statements` can help identify unused indexes.
* **[High] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need. This reduces data transfer and memory usage.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:** Understand join types and ensure you’re using the most efficient join approach.  Use `INNER JOIN` when appropriate.
    * **Rewrite Complex Queries:** Break down complex queries into simpler, more manageable queries if possible.
    * **Use Prepared Statements:**  Reusing prepared statements drastically reduces parsing overhead.
    * **Use `WITH` (Common Table Expressions - CTEs):** CTEs can improve readability and performance for complex queries, but use them judiciously.
    * **PostgreSQL Specific:**
        * **Analyze Tables Regularly:** `ANALYZE` updates PostgreSQL's statistics about the table data, which the query planner uses to generate optimal execution plans. (Run this regularly, especially after significant data changes).
        * **Vacuum Tables:**  `VACUUM` reclaims space occupied by dead rows and updates statistics. (Important for maintaining performance, especially after updates and deletes).
        * **Review `work_mem`:**  This setting controls the amount of memory PostgreSQL uses for sorting and hashing operations. Adjust based on your workload.
        * **Tune PostgreSQL Configuration:** Consider tuning parameters like `shared_buffers`, `work_mem`, `effective_cache_size`, etc., based on your server's resources and workload.
* **[Medium] Data Modeling:**
    * **Normalization:** Ensure your database is properly normalized to minimize data redundancy and improve data integrity.
    * **Data Types:** Choose appropriate data types for your columns to optimize storage and query performance.
    * **Denormalization (Carefully):** In certain cases, controlled denormalization can improve query performance, but understand the trade-offs (increased redundancy, potential data inconsistencies).


**II. Express.js Optimization**

* **[High] Minimize Middleware Usage:** Each piece of middleware adds overhead. Only include middleware you absolutely need.
* **[High] Efficient Routing:**
    * **Keep Routes Simple:** Minimize the complexity of your route handlers.
    * **Route Groups:** Use route groups to apply common middleware and ensure consistent routing.
    * **Static Files:** Use Express's built-in static file handling for serving static assets (images, CSS, JavaScript).
* **[Medium] Connection Pooling:**
    * **Implement Connection Pooling:**  Use a connection pool to avoid the overhead of repeatedly establishing and closing database connections.  Most ORMs/database libraries provide built-in connection pooling.
* **[Medium] Asynchronous Operations:**
    * **Use `async/await`:**
