# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T08:44:09.316185

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing the performance of your Express.js application interacting with a PostgreSQL database. It's broken down into categories with explanations and actionable steps.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's logging and `EXPLAIN` to pinpoint queries with high execution times.
    * **Create Indexes on WHERE Clause Columns:**  Most crucial.  Indexes drastically speed up filtering.
    * **Consider Index Types:** `btree` is the default and generally best.  `hash` indexes might be useful for certain use cases (e.g., equality lookups).
    * **Composite Indexes:** If you frequently filter on multiple columns together, create a composite index covering those columns.  Order matters – leading with the most selective column is key.
    * **Index Maintenance:** Regularly run `VACUUM ANALYZE` to ensure statistics are up-to-date and indexes are efficient. This is *critical* for query planner efficiency.
* **[ ] Query Optimization:**
    * **EXPLAIN Your Queries:**  Always use `EXPLAIN` before deploying changes to understand how PostgreSQL is executing your queries.
    * **Avoid `SELECT *`:**  Only select the columns you actually need.  Reduces network traffic and memory usage.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Optimize `JOIN`s:**  Ensure `JOIN` conditions are properly indexed and the `JOIN` type is appropriate (INNER, LEFT, etc.).
    * **Subquery Optimization:**  Rewrite subqueries as `JOIN`s whenever possible.
    * **Avoid `LIKE '%...'` (Leading Wildcards):**  These prevent index usage. If you absolutely need it, consider full-text search.
    * **Use Parameterized Queries:**  Prevent SQL injection and allow PostgreSQL to cache query plans.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase to a reasonable percentage of RAM (e.g., 25-50%) for PostgreSQL to cache frequently accessed data.
    * **`work_mem`:** Increase this to allow PostgreSQL to do more sorting and hashing in memory.
    * **`maintenance_work_mem`:** Increase this for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Estimate your total RAM, including OS cache. Helps the query planner.
    * **Connection Pooling:** Use a connection pooler (e.g., PgBouncer) to reduce the overhead of establishing new connections.
* **[ ] Data Types:**
    * **Use Appropriate Data Types:** Choose the smallest data type that can hold the data.  `TEXT` vs `VARCHAR`, `INTEGER` vs `BIGINT`.
    * **Avoid `NULL`s Where Possible:** `NULL` values can complicate queries and indexing.


**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**
    * **Use a Library:**  Don't manually manage connections. Utilize a library like `pg-pool` or `sequelize`'s connection pooling features.
    * **Proper Pool Size:** Tune the pool size to handle expected request concurrency without excessive overhead. Monitor connections.
* **[ ] Asynchronous Operations:**
    * **`async/await`:** Use `async/await` for handling database calls. Avoid callback hell.
    * **Minimize Blocking Operations:**  Ensure database calls are asynchronous to avoid blocking the Node.js event loop.
* **[ ] Request Handling:**
    * **Optimize Route Handlers:** Keep route handlers concise and efficient
