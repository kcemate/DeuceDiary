# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T11:58:25.908281

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas for performance optimization when building applications using Express.js for the frontend and PostgreSQL for the backend. It's broken down into categories with suggested actions and considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and the missing indexes.
    * **Targeted Indexes:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Prioritize composite indexes for multi-column searches.
    * **Index Types:**  Choose appropriate index types:
        * `B-tree`: For standard equality, range, and sorting.
        * `Hash`: For equality comparisons (often less common).
        * `GiST/GIN`: For specialized data types, text searches, and JSON.
        * `BRIN`:  For large tables where data is physically ordered (e.g., time series).
* **[ ] Query Optimization:**
    * **Use `SELECT` Only Necessary Columns:** Avoid `SELECT *` - retrieve only the columns you need.
    * **Optimize `WHERE` Clauses:** Use efficient operators.  Avoid `LIKE '%pattern%'` if possible (full-text search is better for complex patterns).
    * **Rewrite Complex Queries:** Break down complex queries into smaller, more manageable queries.  Consider using common table expressions (CTEs) or temporary tables.
    * **Use `JOIN` Wisely:**  Ensure `JOIN` conditions are indexed.  Optimize the order of `JOIN` operations.
    * **Avoid `OR` in `WHERE` Clauses:** `OR` can often prevent index usage.  Consider rewriting using `UNION ALL` if feasible.
    * **Use `EXISTS` Instead of `COUNT(*)`:** When checking for the existence of rows, `EXISTS` is often faster because it stops after finding the first match.
* **[ ] Data Modeling:**
    * **Normalization:** Ensure your database schema is properly normalized to reduce data redundancy and improve data integrity.  However, be mindful of the potential performance impact of excessive joins.
    * **Data Types:** Use the most appropriate data types for each column (e.g., `INTEGER` instead of `VARCHAR` for IDs).
    * **Large Text Columns:** Consider using `TEXT` for long strings, but be aware of potential impact on index usage.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Adjust based on available RAM.  Generally, 25-50% of RAM is a good starting point.
    * **`work_mem`:** Controls the amount of memory used for sorting and hashing. Increase if you see excessive disk I/O during sorting.
    * **`maintenance_work_mem`:**  Memory used for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Helps the query planner estimate the available disk cache.
    * **Regular `VACUUM` and `ANALYZE`:** These commands maintain index statistics and reclaim dead tuples, crucial for performance.
* **[ ] Connection Pooling:** Use a connection pooler (like `pgb`) in your PostgreSQL server to avoid the overhead of establishing new connections for each request.



**II. Express.js Optimization**

* **[ ] Middleware Optimization:**
    * **Remove Unused Middleware:** Regularly review and remove middleware you no longer use.
    * **Order Matters:**  Put performance-critical middleware (e.g., authentication) closer to the request pipeline.
* **[ ] Routing Optimization:**
    * **Efficient Route Hand
