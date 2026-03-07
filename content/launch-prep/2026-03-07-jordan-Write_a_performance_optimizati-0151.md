# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T01:51:12.471221

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines areas to investigate and optimize when building a web application with Express.js for the backend and PostgreSQL for the database. It's broken down into categories for easier navigation.

**I. Express.js Optimization**

* **[ ] Code Efficiency:**
    * **Minimize Middleware:**  Remove unnecessary middleware, particularly in production.
    * **Efficient Route Handlers:** Write concise and optimized route handlers. Avoid complex logic within routes.
    * **Use `async/await` Correctly:**  Properly structure asynchronous operations using `async/await` to prevent callback hell and improve readability.
    * **Caching:** Implement caching at various levels (HTTP response, database queries) - consider tools like `express-cache-control`, `express-rate-limit`, and a dedicated caching layer like Redis.
* **[ ] Request Parsing:**
    * **Limit Request Body Size:**  Set `multer.maxFileSize` (if using Multer) or use middleware to limit request body size.
    * **Validate Input:** Thoroughly validate all incoming data (using libraries like `express-validator`) to prevent unexpected errors and improve security.
* **[ ] Logging:**
    * **Strategic Logging:**  Log only essential information. Over-logging can significantly impact performance.
    * **Use Asynchronous Logging:**  Use asynchronous logging methods to avoid blocking request handlers.
* **[ ] Process Management:**
    * **Node.js Version:** Use a recent, stable version of Node.js with performance improvements.
    * **PM2 or Similar:**  Use a process manager like PM2 or Forever to ensure automatic restarts and efficient resource utilization.  Configure PM2 for optimal settings (CPU cores, memory limits).

**II. PostgreSQL Optimization**

* **[ ] Schema Design:**
    * **Appropriate Data Types:**  Choose the smallest and most appropriate data types for each column (e.g., `SMALLINT` instead of `BIGINT` if range allows).
    * **Normalization:** Ensure proper normalization to reduce redundancy and improve data integrity.  Be mindful of over-normalization.
    * **Indexes:** This is *crucial*.
        * **Index Frequently Queried Columns:** Index columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
        * **Composite Indexes:**  Consider composite indexes for queries that filter on multiple columns.
        * **Index Types:**  Select the appropriate index type (B-tree is the most common, but consider others like Hash or GiST for specific scenarios).
        * **Avoid Over-Indexing:** Too many indexes can slow down write operations (inserts, updates, deletes).
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries and identify bottlenecks.
    * **Write Efficient Queries:**
        * **Avoid `SELECT *`:**  Only select the columns you need.
        * **Use `JOIN`s Effectively:**  Optimize `JOIN`s – consider using `INNER JOIN` when appropriate.
        * **Use `WHERE` Clauses Correctly:**  Filter data as early as possible in the query.
        * **Avoid `OR` in `WHERE` Clauses:**  `OR` clauses often prevent index usage.  Consider alternative strategies like `UNION` or rewriting the query.
        * **Subqueries:**  Be cautious with subqueries – they can be inefficient.  Rewrite them as `JOIN`s when possible.
    * **Prepared Statements:** Utilize prepared statements to reuse query plans and improve performance, especially for frequently executed queries.
    * **Query Hints:**  Use query hints cautiously – they can be useful, but incorrect hints can actually *harm*
