# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T07:50:02.813066

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing a performance of an Express.js application utilizing PostgreSQL. It's broken down into categories and includes suggestions with varying levels of effort.

**I. Database Optimization (PostgreSQL)**

* **[Low Effort] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` on slow-running queries to pinpoint bottlenecks.
    * **Index Relevant Columns:** Add indexes to columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Focus on columns used in equality predicates (`=`) and range predicates (`>`, `<`, `BETWEEN`).
    * **Composite Indexes:** Consider composite indexes for queries that filter on multiple columns simultaneously.
    * **Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, etc.) based on your data and query patterns. B-tree is generally a good starting point.
* **[Medium Effort] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you actually need to reduce data transfer and memory usage.
    * **Use `WHERE` Clauses Effectively:** Ensure your `WHERE` clauses are using indexes and are written in the most efficient way.
    * **Optimize `JOIN` Operations:**
        * **Correct `JOIN` Types:**  Use the appropriate `JOIN` type (INNER, LEFT, RIGHT) based on your requirements.
        * **Join Order:** PostgreSQL's query planner usually optimizes this, but understanding the join order can help in complex scenarios.
    * **Limit Result Sets:** Use `LIMIT` to restrict the number of rows returned, especially in API endpoints.
    * **Avoid Functions in `WHERE` Clauses:**  Using functions on columns in a `WHERE` clause often prevents the use of indexes.  Try to pre-compute values or use a different approach.
    * **Subqueries vs. Joins:** Evaluate whether subqueries or joins are more efficient for your specific situation.
    * **Rewrite Complex Queries:** Simplify complex queries by breaking them down into smaller, more manageable queries or using temporary tables.
* **[High Effort] Database Schema Design:**
    * **Normalization:** Ensure your schema is properly normalized to reduce data redundancy and improve data integrity.
    * **Data Types:** Choose the most appropriate data types for your columns (e.g., `VARCHAR` vs. `TEXT`, `INTEGER` vs. `BIGINT`).
    * **Large Text/Binary Columns:** For very large text or binary columns, consider using the `BYTEA` or `TEXT` data types depending on your needs.
    * **Regular Table Maintenance:** Regularly run `VACUUM` and `ANALYZE` on your tables to optimize storage and improve query performance.
* **[High Effort] PostgreSQL Configuration:**
    * **`shared_buffers`:** Adjust this based on your server's memory and workload (typically 25-50% of RAM).
    * **`work_mem`:**  Control memory used for sorting operations.
    * **`effective_cache_size`:**  Inform the query planner about available memory for caching data.
    * **Connection Pool:** Use a connection pool (e.g., `pg-pool`) to reduce the overhead of establishing new database connections.


**II. Express.js Application Optimization**

* **[Low Effort] Route Optimization:**
    * **Use Efficient Route Handlers:**  Keep your route handlers concise and focused on their specific tasks.
    * **Avoid Excessive Logic in Routes:** Move complex logic to separate services or middleware.
* **[Medium Effort] Middleware Optimization:**
    * **Minimize Middleware Usage:** Only include middleware that is truly necessary.
