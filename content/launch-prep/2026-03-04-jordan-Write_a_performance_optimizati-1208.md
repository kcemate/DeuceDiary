# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T12:08:23.287723

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas for optimizing the performance of an Express.js application leveraging a PostgreSQL database. It's divided into categories with suggestions ranging from easy wins to more involved optimizations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing or ineffective indexes.
    * **Index Appropriate Columns:** Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns in the `WHERE` clause.
    * **Index Type Selection:** Choose the appropriate index type (B-tree, Hash, GIN, GiST) based on query patterns. B-tree is generally a good starting point.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations.
* **[ ] Query Optimization:**
    * **Use `EXPLAIN ANALYZE` Regularly:**  Continuously monitor query execution plans to identify bottlenecks.
    * **Rewrite Complex Queries:** Simplify complex queries, break them down into smaller ones where appropriate, and use appropriate joins.
    * **Avoid `SELECT *`:**  Retrieve only the columns you actually need.
    * **Use `LIMIT` and `OFFSET` Correctly:**  Especially crucial for pagination.  Consider using keyset pagination for large datasets.
    * **Utilize `WITH` (Common Table Expressions - CTEs):** Can improve readability and sometimes performance.
    * **Analyze and Vacuum Tables:** `ANALYZE` updates statistics PostgreSQL uses for query planning. `VACUUM` reclaims space occupied by deleted rows and improves performance.  Automate these with cron jobs.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Increase this value (up to 25% of RAM) to allow PostgreSQL to cache data.
    * **`work_mem`:**  Adjust this based on the amount of memory available to handle sorting and hashing operations.
    * **`maintenance_work_mem`:**  Increase this for tasks like `VACUUM` and index building.
    * **`effective_cache_size`:**  Give PostgreSQL an estimate of the amount of memory available to the OS cache.
    * **Connection Pool Size:**  Configure the connection pool in Express to avoid connection overhead.  (e.g., `nodemon --max-http-servers 100` in your `nodemon` configuration)
* **[ ] Data Types:**
    * **Choose Appropriate Data Types:**  Use the smallest data type that can accommodate your data to minimize storage and improve performance.
    * **Avoid `TEXT` for Short Strings:** Use `VARCHAR` or `CHAR` instead.
* **[ ]  Normalization:**
    * **Review Normalization:**  While over-normalization can hurt performance, ensuring data is properly normalized is crucial for data integrity and often indirectly improves query performance.

**II. Express.js Optimization**

* **[ ] Asynchronous Operations:**
    * **Use `async/await`:**  Avoid blocking the event loop by using `async/await` to handle asynchronous operations like database queries.
* **[ ] Middleware Optimization:**
    * **Remove Unused Middleware:**  Regularly review your middleware and remove any that are not essential.
    * **Optimize Middleware Logic:**  Keep middleware functions lightweight and performant.
* **[ ] Routing:**
    * **Efficient Routing:**  Use the most direct routes possible.
    * **Route Groups:**  Use route groups to apply common middleware to related routes.
* **[ ]  Request Body Parsing:**
   * **`express.json()`
