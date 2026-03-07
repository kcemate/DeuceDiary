# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T14:48:08.140072

## Performance Optimization Checklist: Express + PostgreSQL

This checklist provides a structured approach to optimizing the performance of your Express.js application interacting with a PostgreSQL database. It’s divided into categories with varying levels of effort and impact.

**I. Database Optimization (PostgreSQL Focus - ~50% of effort)**

* **[High] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `EXPLAIN` command to analyze query performance and identify missing indexes.
    * **Index Relevant Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries filtering on multiple columns.
    * **Index Data Types:** Ensure indexes are created on the correct data types.
    * **Regularly Review Indexes:** Downtimes for maintenance are a good time to review and optimize indexes.  Remove unused indexes.
* **[Medium] Query Optimization:**
    * **Write Efficient Queries:** Use `SELECT` only the necessary columns (avoid `SELECT *`).
    * **Use `EXISTS` instead of `COUNT(*)`:** When checking for existence, `EXISTS` is often faster.
    * **Optimize `JOIN`s:** Understand and utilize proper `JOIN` types. `INNER JOIN` is usually faster than `LEFT JOIN` if you only need matching records.
    * **Avoid `LIKE '%...%'`:**  Leading wildcards in `LIKE` queries are notoriously slow.  Consider alternative solutions (fulltext search if applicable).
    * **Use `WITH` (Common Table Expressions - CTEs):** For complex queries, CTEs can improve readability and potentially performance.
    * **Analyze Query Plans:** Regularly use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries and identify bottlenecks.
* **[Medium] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase this value (typically 25-50% of RAM) to improve PostgreSQL’s in-memory caching.
    * **`work_mem`:** Increase this value for operations like sorting and hashing within PostgreSQL.
    * **`effective_cache_size`:**  Provide PostgreSQL with an accurate estimate of the size of the OS cache.
    * **`maintenance_work_mem`:**  Increase this for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`wal_buffers`:** Adjust based on your write workload.
    * **Connection Pooling:** Configure your PostgreSQL connection pooler (e.g., pgPool-II) for optimal concurrency.
* **[Low] Regular Maintenance:**
    * **`VACUUM`:** Run `VACUUM` regularly to reclaim dead tuples and update statistics.
    * **`ANALYZE`:** Run `ANALYZE` to update PostgreSQL's statistics used for query planning.
    * **`pg_stats` (for newer PostgreSQL versions):**  Consider using `pg_stats` for more automated and accurate statistics collection.

**II. Express.js Application Optimization (~30% of effort)**

* **[High] Route Optimization:**
    * **Use Specific Routes:** Avoid wildcard routes (e.g., `/api/*`) where possible.
    * **Route Groups:** Use Express Route Groups with methods to avoid code duplication.
    * **Route Ordering:** Order routes from most specific to most general.
* **[Medium] Middleware Optimization:**
    * **Minimize Middleware Usage:**  Only include middleware necessary for each route.
    * **Optimize Middleware:** Ensure your middleware logic is efficient.
    * **Cache Middleware Responses:** Use caching middleware for static content or frequently accessed data.
* **[Medium] Request Parsing & Body Parsing:**
