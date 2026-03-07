# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T09:29:34.423906

## Performance Optimization Checklist for Express + PostgreSQL

This checklist covers key areas for optimizing the performance of your Express.js application interacting with a PostgreSQL database.  It's broken down into categories for easier navigation.

**I. Express.js Application Optimization:**

* **[ ] Route Design & Efficiency:**
    * **Minimize Route Overlap:**  Design routes to avoid unnecessary repetition.
    * **Use `params` Effectively:** Leverage Express's parameter parsing for efficiency.
    * **Keep Routes Concise:**  Avoid overly complex route definitions.
* **[ ] Middleware Management:**
    * **Reduce Middleware Usage:**  Only use middleware that's truly necessary.
    * **Order Matters:**  Order middleware strategically – more impactful middleware should be placed earlier.
    * **Caching Middleware:**  Consider caching responses for frequently accessed, static content.
* **[ ] Request Parsing:**
    * **`bodyParser.json()` and `bodyParser.urlencoded()`:**  Ensure you're using the correct parser and that it’s configured appropriately.  Consider using a lighter alternative like `express-body-parser` or `multer` for file uploads.
* **[ ] Session Management:**
    * **Efficient Session Storage:**  Use a fast in-memory session store (for smaller applications) or Redis/Memcached for scalability.
* **[ ] Code Optimization:**
    * **Reduce Unnecessary Calculations:**  Pre-compute values if possible.
    * **Use Efficient Data Structures:** Choose appropriate data structures for your data model.
    * **Optimize Loops:**  Review loops for performance bottlenecks.
* **[ ] Error Handling:**  Robust error handling is essential but can introduce overhead. Implement efficient error logging and recovery.


**II. PostgreSQL Database Optimization:**

* **[ ] Indexing:** This is *crucial*.
    * **Analyze Queries:**  Use `EXPLAIN ANALYZE` to understand query execution plans and identify missing indexes.
    * **Index Relevant Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for queries using multiple columns in a `WHERE` clause.
    * **Index Types:** Choose the appropriate index type (B-tree, Hash, GiST, GIN) based on query patterns. B-tree is usually a good starting point.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Use `EXPLAIN ANALYZE` Regularly:**  This is your best friend for identifying slow queries.
    * **Rewrite Complex Queries:**  Simplify complex joins, subqueries, and nested queries.
    * **Use `JOIN` Wisely:**  Use `INNER JOIN` when possible and understand the implications of different join types.
    * **Avoid `SELECT *`:**  Only retrieve the columns you need.
    * **Optimize `WHERE` Clauses:**  Use efficient operators and avoid functions in `WHERE` clauses.
    * **Use `LIMIT` and `OFFSET`:**  For pagination, use `LIMIT` and `OFFSET` effectively, but understand their potential performance impact.  Consider using keyset pagination for efficiency.
    * **Use Prepared Statements/Parameterized Queries:** This prevents SQL injection and improves performance by reusing the query plan.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Increase this value (typically 25-50% of RAM) to allow PostgreSQL to cache data in memory.
    * **`work_mem`:**  Allocate sufficient memory for sorting and other in-memory operations.
    * **`maintenance_work_mem`:**  Increase this value for
