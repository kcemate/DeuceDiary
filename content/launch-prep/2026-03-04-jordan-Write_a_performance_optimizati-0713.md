# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T07:13:30.782636

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing your Express.js application with a PostgreSQL database. It's categorized for easier navigation and prioritizes impactful changes.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to pinpoint queries performing poorly.
    * **Create Indexes on WHERE Clauses:**  Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries with multiple `WHERE` conditions on related columns.
    * **Index Types:**  Choose the right index type (B-tree, GiST, GIN, HASH) based on query patterns and data types.
    * **Index Maintenance:** Regularly analyze and vacuum your database (`ANALYZE` and `VACUUM`) to keep indexes optimized.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only retrieve the columns you need.
    * **Use `WHERE` Clauses Effectively:** Filter data early in the query to reduce the amount of data processed.
    * **Optimize `JOIN`s:**  Ensure `JOIN` conditions are properly indexed and use efficient `JOIN` types (INNER, LEFT, RIGHT) appropriately.
    * **Avoid `LIKE '%keyword%'` (Leading Wildcards):**  These are notoriously slow. Consider full-text search if applicable.
    * **Use Prepared Statements:**  Reduces parsing overhead for frequently executed queries.
    * **Rewrite Complex Queries:** Simplify complex queries by breaking them down into smaller, more manageable queries.
* **[ ] Data Types:**
    * **Choose Appropriate Data Types:** Use the smallest possible data type that can accommodate your data to minimize storage and improve performance.
    * **Avoid Implicit Type Conversions:** Explicitly cast data types to avoid PostgreSQL interpreting them differently.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Set appropriately based on your server's RAM. (Typically 25% - 50%)
    * **`work_mem`:**  Allocate enough memory for sorting and operations in memory.
    * **`maintenance_work_mem`:**  Increase for operations like `VACUUM` and index creation.
    * **`effective_cache_size`:**  Helps PostgreSQL estimate the size of its cache.
    * **Connection Pooling:** Use a connection pooler (like `pgbouncer` or a library-based pool) to reduce the overhead of creating and closing connections.

**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**
    * **Use a Connection Pool:**  Don't create a new database connection for every request. Use a connection pool library (e.g., `pg-pool`) to reuse connections efficiently.
* **[ ] Middleware Optimization:**
    * **Minimize Middleware:** Only include middleware you absolutely need.
    * **Order Middleware Carefully:** Place expensive middleware (e.g., authentication) later in the chain to avoid unnecessary processing for every request.
* **[ ] Route Handling:**
    * **Optimize Route Logic:**  Keep route handler functions concise and efficient.
    * **Avoid Synchronous Operations:** Use asynchronous functions and callbacks to avoid blocking the event loop.
* **[ ] Request Body Parsing:**
    * **Stream Parsing:** Use stream parsing (e.g., `body-parser@1.19.0` with streams) for large request bodies to prevent memory exhaustion.
* **[ ] Caching:**
    * **Implement Caching:** Cache frequently accessed data in memory (e.g., using `node-cache` or `lru
