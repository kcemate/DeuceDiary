# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T06:20:06.325395

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas for optimizing the performance of your Express application interacting with a PostgreSQL database. It's broken down into categories with suggestions ranging from quick wins to more involved changes.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries. Identify missing or inefficient indexes.
    * **Index Strategic Columns:** Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:**  Create composite indexes for queries using multiple columns in `WHERE` clauses. Order columns in the index based on query selectivity.
    * **Partial Indexes:** Consider partial indexes for specific subsets of data based on a condition.
    * **Index Types:** Evaluate different index types (B-tree, Hash, GIN, GiST) based on your data and query patterns. B-tree is the default and most common.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you need. This reduces data transfer and memory usage.
    * **Use `JOIN`s Wisely:** Optimize `JOIN` clauses. Understand different `JOIN` types and choose the most efficient one.
    * **Limit Result Sets:** Use `LIMIT` in your queries to avoid returning unnecessary data, especially when fetching data for pagination.
    * **Prepared Statements/Parameterized Queries:**  Use prepared statements to prevent SQL injection and improve query performance by reusing the query plan.  Express frameworks often handle this for you.
    * **Optimize `WHERE` Clauses:** Use efficient operators (e.g., `=` instead of `LIKE '%...%'` when possible).
    * **Rewrite Complex Queries:** Break down complex queries into smaller, more manageable ones.  Consider using temporary tables or views.
    * **Avoid Functions in `WHERE` Clauses:** Functions in `WHERE` clauses often prevent index usage. Try to rewrite the query to avoid them or create functional indexes.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Adjust this setting based on your server's memory. (Generally, 25-50% of RAM)
    * **`work_mem`:**  Increase this setting if you have a lot of sorting or hashing operations.
    * **`maintenance_work_mem`:**  Increase this for tasks like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Inform PostgreSQL about the amount of memory available for caching.
    * **Connection Pooling:**  Use a connection pooler like `pgbouncer` or `pgpool` for increased efficiency and reduced overhead.
* **[ ]  Data Types:** Use the most appropriate data types for your columns to minimize storage and improve performance.
* **[ ]  Vacuuming and Analyzing:** Regularly run `VACUUM` to reclaim dead tuples and `ANALYZE` to update statistics used by the query optimizer. (Automated with cron jobs).


**II. Express Application Optimization**

* **[ ] Connection Pooling:**  Ensure your Express application is using a connection pooler to manage database connections efficiently.
* **[ ]  Asynchronous Operations:**  Use `async/await` for all database interactions.  This prevents blocking the event loop.
* **[ ]  Middleware Optimization:**
    * **Remove Unnecessary Middleware:**  Disable or remove middleware that isn't essential.
    * **Optimize Middleware Order:**  Place performance-critical middleware earlier in the chain.
* **[ ]  Caching:**
    * **HTTP Caching:**  Leverage browser caching (using `Cache-Control` headers).
    * **Application
