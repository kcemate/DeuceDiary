# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T11:23:03.525475

## Performance Optimization Checklist: Express + PostgreSQL

This checklist provides a comprehensive guide to optimizing your Express.js application’s performance, specifically when interacting with a PostgreSQL database. It’s broken down into categories with actionable steps.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and areas lacking indexes.
    * **Index Relevant Columns:** Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:**  Create composite indexes for queries that filter on multiple columns.
    * **Index Types:** Choose the appropriate index type (B-tree, Hash, GIN, GiST) based on your data and query patterns. B-tree is generally a good starting point.
    * **Avoid Over-Indexing:**  Too many indexes can slow down writes (inserts, updates, deletes). Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Write Efficient Queries:** Avoid `SELECT *`.  Specify the exact columns you need.
    * **Use `JOIN`s Effectively:**  Understand the different `JOIN` types and use the most appropriate one for your data relationship.
    * **Use `WHERE` Clauses Correctly:** Filter data as early as possible in the query.
    * **Optimize `ORDER BY` and `GROUP BY`:**  Ensure indexes are used for these clauses.
    * **Avoid `LIKE '%...'`:**  Leading wildcards in `LIKE` queries prevent index usage. Consider alternative search strategies.
    * **Use `LIMIT` and `OFFSET` Sparingly:** For large datasets, `LIMIT` and `OFFSET` can be inefficient.  Consider pagination techniques.
    * **Use Prepared Statements:**  Prepared statements help the database parse and optimize the query only once.
* **[ ] Database Configuration:**
    * **Memory Allocation:** Ensure PostgreSQL has enough memory allocated to the shared buffers, work_mem, and maintenance work_mem parameters.  Tune these based on your workload.
    * **Connection Pooling:** Use a connection pooler like pgpool-II or pgbouncer to reduce the overhead of establishing and tearing down connections.
    * **Write-Ahead Logging (WAL):**  Ensure WAL is configured correctly for data durability and performance.
    * **Regular Maintenance:** Run `VACUUM` and `ANALYZE` regularly to optimize table statistics and reclaim dead tuples.
* **[ ] Data Modeling:**
    * **Normalization:** Properly normalize your database schema to reduce data redundancy and improve data integrity.
    * **Data Types:** Use the most appropriate data types for each column to minimize storage space and improve query performance.



**II. Express.js Optimization**

* **[ ] Middleware Optimization:**
    * **Reduce Middleware:**  Only use middleware that's truly necessary.
    * **Order Middleware Carefully:** Place performance-critical middleware closer to the request handler.
    * **Asynchronous Operations:** Utilize `async/await` or Promises for all asynchronous operations (database queries, file operations) to prevent blocking the event loop.
* **[ ] Request Parsing & Handling:**
    * **`express.json()` and `express.urlencoded()`:**  Only use these parsers when you need to handle JSON or URL-encoded data.
    * **Error Handling:** Implement robust error handling to prevent unhandled exceptions from crashing the server.  Don't expose sensitive information in error messages.
* **[ ] Routing Optimization:**
    * **Route Specificity:**  Use more specific route patterns to avoid unnecessary route matching.
    * **Combine Routes:**  If possible, combine multiple routes that share the same handler function.
*
