# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T09:19:49.482995

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider when optimizing your Express.js application running against a PostgreSQL database. It's categorized for clarity and includes actionable steps.  Remember to prioritize based on your application's specific bottlenecks.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `pg_stat_statements` or your database monitoring tools to identify the slowest queries.
    * **Create Indexes:**  Add indexes on frequently queried columns, especially those used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries that filter on multiple columns frequently.
    * **Index Type:**  Choose the appropriate index type (B-tree, GiST, GIN, HASH) based on your query patterns.  B-tree is the most common and usually a good starting point.
    * **Avoid Over-Indexing:**  Too many indexes can slow down write operations (inserts, updates, deletes). Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Use `EXPLAIN ANALYZE` to understand your query execution plan and identify potential bottlenecks (e.g., full table scans).
    * **Rewrite Slow Queries:**  Optimize SQL queries for efficiency.
        * **Use `JOIN`s instead of subqueries where possible.**
        * **Filter early:** Apply filters in the `WHERE` clause as early as possible to reduce the amount of data processed.
        * **Avoid `SELECT *`:**  Only select the columns you actually need.
        * **Optimize `ORDER BY` and `GROUP BY`:**  Ensure indexes are used for these operations.
    * **Use Prepared Statements:** Use prepared statements for frequently executed queries to reduce parsing overhead.  Express's ORM (like Sequelize or Prisma) can help with this.
* **[ ] Data Types:**
    * **Use Appropriate Data Types:** Choose the smallest possible data type that can accommodate your data to minimize storage and improve performance.
    * **Avoid `TEXT` when possible:** If you only need short text, consider `VARCHAR` or `CHAR`.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Adjust the `shared_buffers` setting to a reasonable value based on your server's memory.
    * **`work_mem`:**  Increase `work_mem` if you have many operations requiring temporary tablesort.
    * **`effective_cache_size`:**  Set this value based on your system's memory and PostgreSQL's caching capabilities.
    * **Connection Pooling:**  Use a connection pooler (like PgBouncer or a built-in pooler) to reduce the overhead of establishing new database connections.
* **[ ] Statistics:**
    * **Regularly Update Statistics:** Ensure PostgreSQL has accurate statistics about your data to optimize query plans.  `ANALYZE` is your friend.


**II. Express.js Application Optimization**

* **[ ] Code Optimization:**
    * **Efficient Algorithms:**  Use efficient algorithms and data structures in your Express routes and middleware.
    * **Minimize Middleware:**  Use only the necessary middleware.  Each middleware function adds overhead.
    * **Caching:** Implement caching mechanisms (e.g., Redis, Memcached) to store frequently accessed data and reduce database load.
    * **Lazy Loading:**  Load data only when it's needed, rather than loading everything at once.
    * **Asynchronous Operations:**  Use `async/await` or Promises to handle asynchronous operations efficiently. Avoid synchronous operations, which can block the event loop.
* **[ ] Route Handling:**
