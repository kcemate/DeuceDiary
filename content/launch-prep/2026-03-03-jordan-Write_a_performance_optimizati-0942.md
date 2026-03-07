# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T09:42:27.258206

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing performance for a common Express.js application using PostgreSQL as its database. It’s broken down into categories and prioritized by impact.

**I. Database Optimization (PostgreSQL)**

* **[High] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `auto_explain` extension to identify queries that take longer than a reasonable threshold. Analyze query plans.
    * **Index Key Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Create composite indexes when querying multiple columns together. Consider the order of columns in the index.
    * **Partial Indexes:** Use partial indexes to index only a subset of rows that meet specific criteria (e.g., `WHERE status = 'active'`).
    * **Index Maintenance:** Regularly rebuild or reorganize indexes (`VACUUM ANALYZE`) to maintain optimal performance.
* **[High] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need.
    * **Use `EXPLAIN`:**  Run `EXPLAIN` on your queries to understand their execution plans and identify potential bottlenecks.
    * **Rewrite Complex Queries:**  Simplify complex queries by breaking them down into smaller, more manageable queries or using alternative approaches.
    * **Use `JOIN` Efficiently:**  Optimize `JOIN` conditions, prefer `INNER JOIN` when appropriate, and ensure proper index usage.
    * **Use `LIMIT` and `OFFSET` Carefully:**  These can be inefficient with large datasets. Consider alternative pagination strategies.
    * **Optimize `GROUP BY` and `ORDER BY`:**  Ensure appropriate indexes are in place and avoid unnecessary sorting.
* **[Medium] Data Types & Schema Design:**
    * **Choose Appropriate Data Types:** Use the smallest data type that can accommodate your data (e.g., `INTEGER` instead of `BIGINT` if values are always small).
    * **Normalize Your Database:**  Reduce redundancy and improve data integrity.  However, over-normalization can negatively impact joins; find the right balance.
    * **Consider Denormalization:** In certain scenarios, carefully considered denormalization can improve read performance.
* **[Medium] PostgreSQL Configuration:**
    * **`shared_buffers`:** Adjust based on available RAM – generally 25-50% of RAM.
    * **`work_mem`:**  Increase if you're seeing excessive temporary table usage.
    * **`effective_cache_size`:**  Set this to the size of your system's cache.
    * **`maintenance_work_mem`:**  Increase for operations like `VACUUM` and `CREATE INDEX`.
    * **Monitoring:** Implement robust monitoring of PostgreSQL performance metrics (e.g., CPU usage, disk I/O, query latency).


**II. Express.js & Middleware Optimization**

* **[High] Efficient Routing:**
    * **Use Route Parameters Correctly:** Validate and sanitize route parameters to prevent errors and potential vulnerabilities.
    * **Route Ordering:**  Generally, shorter, more specific routes should come before broader routes.
    * **Combine Routes (When Appropriate):**  If you have multiple routes serving similar data, consider combining them.
* **[High] Middleware Optimization:**
    * **Minimize Middleware Usage:**  Only include middleware that’s genuinely necessary.
    * **Efficient Middleware:** Use optimized middleware packages (e.g., `express-validator` for validation).
    * **Sequential Middleware Order:** Place the most expensive middleware early in the chain.
* **[Medium] Request Handling:**
    * **Keep Requests Small:** Minimize the amount of
