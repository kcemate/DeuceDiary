# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T16:07:43.433374

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines strategies to optimize your Express.js application running against a PostgreSQL database. It's categorized for clarity and prioritized based on potential impact.

**I. Database Optimization (PostgreSQL)**

* **[High Priority] Indexing:**
    * **Analyze Query Plans:**  Use `EXPLAIN ANALYZE` to identify slow queries and missing indexes.  Pay attention to `Seq Scan` operations, which are usually a sign of missing indexes.
    * **Index Relevant Columns:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries filtering on multiple columns.  Order matters!  Put the most selective column first.
    * **Partial Indexes:**  Index only a subset of rows based on a condition (e.g., `WHERE status = 'active'`).  This can significantly improve performance for queries targeting that subset.
    * **Index Types:**  Choose the appropriate index type (B-tree, GiST, GIN, BRIN) based on your data types and query patterns.
    * **Regularly Review & Maintain Indexes:**  PostgreSQL automatically maintains indexes, but you should still monitor their effectiveness and drop unused ones.
* **[High Priority] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you actually need.
    * **Use `JOIN` Instead of Subqueries:** Often, a well-written `JOIN` is more efficient than a correlated subquery.
    * **Optimize `WHERE` Clauses:**
        *  Use indexed columns in `WHERE` clauses.
        *  Avoid using functions in `WHERE` clauses that prevent index usage (e.g., `WHERE UPPER(name) = '...'`).  Consider applying the function to the value instead.
        *  Use `BETWEEN` and `IN` judiciously – they can sometimes be less efficient.
    * **Limit Results:** Use `LIMIT` to retrieve only the necessary number of rows.
    * **Analyze Query Plans & Rewrite:**  Re-evaluate the query structure after each `EXPLAIN ANALYZE` run.
* **[Medium Priority] Database Configuration:**
    * **Connection Pooling:**  Utilize a connection pooler like `pgbouncer` or a connection pool within your Express app to reduce the overhead of establishing new connections.
    * **PostgreSQL Configuration:**
        * **`shared_buffers`:**  Adjust this setting based on your server's RAM (usually 25-50% of RAM).
        * **`work_mem`:**  Increase this for operations that require sorting or hashing in memory.
        * **`effective_cache_size`:**  Inform PostgreSQL about the amount of memory available for caching.
        * **`maintenance_work_mem`:** Allocate more memory for maintenance tasks like `VACUUM` and `ANALYZE`.
        * **`autovacuum`:**  Ensure autovacuum is enabled and properly configured to prevent table bloat and performance degradation.
* **[Low Priority] Data Types & Normalization:**
    * **Choose Appropriate Data Types:**  Use the most efficient data type for your data.
    * **Normalization:**  Ensure your database is properly normalized to reduce data redundancy and improve data integrity.  However, be mindful of the potential performance impact of excessive joins.


**II. Express.js Optimization**

* **[High Priority] Code Efficiency:**
    * **Asynchronous Operations:** Use `async/await` or Promises for all database operations to avoid blocking the event loop.
    * **Minimize Database Calls:**  Combine multiple queries into a single query where possible, especially for related data.
