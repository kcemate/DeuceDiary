# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T23:17:51.247633

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to optimize your Express application running against a PostgreSQL database. It's categorized for easier troubleshooting and prioritization.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` for slow queries to identify missing indexes or inefficient query plans.
    * **Key Indexes:** Ensure indexes are on frequently queried columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for multi-column queries with specific order of columns.
    * **Partial Indexes:** Optimize indexes for frequently queried subsets of data.
    * **Index Maintenance:** Regularly run `VACUUM ANALYZE` to update statistics and reclaim dead tuples.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only retrieve the necessary columns.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Optimize Joins:** Understand join types (INNER, LEFT, RIGHT) and choose the most efficient one. Consider denormalization if joins are consistently slow.
    * **Limit Results:** Use `LIMIT` clauses to return only the required number of rows.
    * **Use `EXISTS` instead of `COUNT(*)` for Existence Checks:** `EXISTS` is generally faster.
    * **Subqueries:** Evaluate subqueries for performance. Often, rewriting them as JOINs can be more efficient.
* **[ ] Schema Design:**
    * **Data Types:** Use the smallest appropriate data type for each column to reduce storage and improve performance.
    * **Normalization:**  Balance normalization with performance – excessive normalization can lead to complex JOINs.
    * **Consider Denormalization:** Carefully consider denormalizing data to reduce JOINs in frequently executed queries. (Trade-off: increased storage & potential data inconsistencies.)
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Tune to the appropriate amount based on available RAM (generally 25-50%).
    * **`work_mem`:** Increase if you see excessive temporary table creation.
    * **`effective_cache_size`:**  Provide PostgreSQL with an estimate of your system's cache size.
    * **`maintenance_work_mem`:**  Increase for operations like `VACUUM` and `CREATE INDEX`.
    * **Connection Pooling:**  Utilize a connection pooler like PgBouncer or connection pooling within your Express application to reduce connection establishment overhead.


**II. Express Application Optimization**

* **[ ] Connection Pooling:**  (Crucial for performance)
    * **Use a Robust Pooler:**  Employ a dedicated connection pooler (e.g., `pg-pool`, `node-postgres`) instead of relying solely on Express's built-in connection handling.
    * **Pool Size:**  Set the pool size appropriately based on your application's concurrency needs. Too small can lead to connection bottlenecks; too large can strain the database.
* **[ ] Asynchronous Operations:**
    * **Use `async/await`:** Ensure all database interactions are performed asynchronously using `async/await` to avoid blocking the event loop.
* **[ ] Data Serialization/Deserialization:**
    * **Efficient Data Formats:**  Use efficient data formats like JSON for data transfer between Express and PostgreSQL.
    * **Avoid Excessive Parsing:** Minimize unnecessary parsing of data during requests and responses.
* **[ ] Route Optimization:**
    * **Route Structure:**  Organize routes logically and avoid excessively complex route structures.
    * **Route Parameters:** Use route parameters sparingly – consider using query parameters instead
