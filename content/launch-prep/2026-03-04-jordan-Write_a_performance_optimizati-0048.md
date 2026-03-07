# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T00:48:12.738844

## Performance Optimization Checklist: Express + PostgreSQL

This checklist provides a breakdown of potential optimization areas when building a web application with Express.js and PostgreSQL. It's categorized for easier navigation and offers a range of strategies, from quick wins to deeper dives.

**I. Database Optimization (PostgreSQL):**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to pinpoint queries lacking appropriate indexes.
    * **Index Appropriate Columns:** Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns together.
    * **Partial Indexes:** Index only a subset of rows based on a specific condition (e.g., index `users` where `status = 'active'`).
    * **Index Type:** Choose the right index type (B-tree, Hash, GiST, GIN) based on query patterns.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you actually need.
    * **Use `JOIN` Effectively:** Analyze `JOIN` order and ensure you're using the correct `JOIN` type (INNER, LEFT, RIGHT).
    * **Rewrite Complex Queries:** Simplify complex queries.  Consider breaking them down into smaller, more manageable queries.
    * **Use `EXISTS` instead of `COUNT(*)`:** When checking for the existence of data, `EXISTS` is often faster.
    * **Optimize `LIKE` Clauses:** Use `LIKE '%string%'` carefully (often slow).  Consider full-text search if relevant.
    * **Utilize PostgreSQL Features:**  Leverage features like Common Table Expressions (CTEs), window functions, and materialized views.
* **[ ] Database Server Configuration:**
    * **Memory Allocation:**  Ensure PostgreSQL has sufficient RAM based on your workload.
    * **Connection Pooling:**  Use a connection pooler like `pgbouncer` to reduce connection overhead.
    * **WAL (Write-Ahead Logging) Configuration:**  Tune WAL settings based on your write workload.
    * **Vacuuming & Analyzing:**  Regularly run `VACUUM ANALYZE` to optimize table statistics and reclaim dead tuples.  Automate this.
    * **Autovacuum:** Ensure Autovacuum is enabled and configured appropriately.
* **[ ] Schema Design:**
    * **Normalization:**  Properly normalize your database schema to reduce redundancy and improve data integrity.
    * **Data Types:** Choose the most appropriate data types for your columns.
    * **Foreign Keys:** Use foreign keys to enforce relationships and improve data consistency.

**II. Express.js Optimization:**

* **[ ] Middleware Management:**
    * **Remove Unused Middleware:** Regularly review and remove unnecessary middleware.
    * **Optimize Middleware Order:**  Order middleware carefully, placing performance-sensitive middleware closer to the request handling.
    * **Lazy Load Middleware:**  Load middleware only when it’s needed.
* **[ ] Route Optimization:**
    * **Route Efficiency:** Avoid excessively complex route handlers.
    * **Route Grouping:** Group related routes for better organization and potential caching.
    * **Route Parameters:** Use route parameters efficiently.
* **[ ] Request Handling:**
    * **Minimize Processing:**  Reduce the amount of processing done within your route handlers.
    * **Caching:** Implement caching mechanisms for frequently accessed data. (e.g., Redis, Memcached)
    * **Async/Await:**  Use `async/await` for cleaner asynchronous code and better error handling.
* **[ ] Template Engines (if using):**
    * **Minimize Template Complexity:**  Keep your template files simple and efficient.
    *
