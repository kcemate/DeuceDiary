# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T09:52:21.811741

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers performance optimization strategies for your Express.js application interacting with a PostgreSQL database. It's categorized for easier navigation and focuses on key areas.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL is executing your queries. Identify missing indexes or inefficient index usage.
    * **Covering Indexes:**  Create indexes that include all columns needed in a SELECT query's WHERE clause to avoid extra lookups.
    * **Composite Indexes:** Use them when queries frequently filter on multiple columns together.
    * **Partial Indexes:**  Index only a subset of rows based on a specific condition (useful for frequently queried specific subsets).
    * **Index Types:**  Consider appropriate index types (B-tree, GiST, GIN, BRIN) based on query patterns and data types.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only retrieve the columns you actually need.
    * **Use `WHERE` Clauses Effectively:** Filter data early to reduce the amount processed.
    * **Optimize `JOIN`s:**
        * Use appropriate `JOIN` types (INNER, LEFT, RIGHT) based on your needs.
        * Ensure join columns are indexed.
        *  Avoid nested `JOIN`s where possible.
    * **Minimize Subqueries:**  Often subqueries can be rewritten as joins for better performance.
    * **Rewrite Complex Queries:** Break down very complex queries into smaller, more manageable queries.
    * **Use `EXPLAIN` Regularly:**  Continuously monitor query execution plans.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Adjust based on available memory – a good starting point is 25-40% of RAM.
    * **`work_mem`:**  Allocate enough memory for sorting and temporary operations.
    * **`maintenance_work_mem`:** Allocate memory for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Estimate the available memory for PostgreSQL's caching.
    * **`wal_buffers`:**  Increase this for write-intensive workloads.
    * **`autovacuum`:** Enable and configure `autovacuum` for automatic table maintenance.
* **[ ] Data Types:**
    * **Use Efficient Data Types:** Choose the smallest suitable data type for each column.
    * **Avoid `TEXT` where `VARCHAR` is sufficient:** `VARCHAR` is usually faster for smaller strings.
* **[ ] Statistics:**
    * **`ANALYZE` Regularly:** Update PostgreSQL's statistics about your data. This helps the query planner make better decisions.  Schedule this regularly (daily or more often for frequently changing data).


**II. Express.js Optimization**

* **[ ] Minimize Middleware Usage:**
    * **Remove Unused Middleware:**  Only include middleware that's actually needed.
    * **Combine Middleware:**  Where possible, combine related middleware functions.
* **[ ] Optimize Route Handlers:**
    * **Keep Handlers Short and Focused:**  Reduce the amount of code in your route handlers.
    * **Cache Logic:**  If calculations are expensive and results don't change frequently, cache the results.
    * **Asynchronous Operations:** Use `async/await` or Promises to handle asynchronous operations and prevent blocking.
* **[ ] Connection Pooling:**
    * **Use a Connection Pool:**  Don't create a new database connection for each request.  Libraries like `pg-pool` or `sequelize` handle connection pooling effectively.
* **[ ] Template
