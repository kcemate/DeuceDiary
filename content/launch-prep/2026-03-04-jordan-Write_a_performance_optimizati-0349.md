# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T03:49:35.184546

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing performance when using Express.js with a PostgreSQL database. It's broken down into categories with suggested actions and considerations.  Remember to measure performance *before* and *after* each change to verify its impact.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify missing or ineffective indexes.
    * **Index Key Columns:** Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for multi-column queries, especially those with specific orderings.
    * **Partial Indexes:** Use partial indexes to index only a subset of data based on specific criteria.
    * **Index Types:** Evaluate different index types (B-tree, Hash, GiST, GIN) based on your data and query patterns.  B-tree is generally the best starting point.
* **[ ] Query Optimization:**
    * **Write Efficient Queries:** Avoid `SELECT *`. Select only the columns you need.
    * **Use `JOIN`s Strategically:** Choose the correct `JOIN` type (`INNER`, `LEFT`, `RIGHT`) based on your data requirements.
    * **Optimize `WHERE` Clauses:**  Filter data as early as possible in the query. Use indexes effectively in `WHERE` clauses.
    * **Limit Results:** Use `LIMIT` to retrieve only the necessary number of records, especially in API endpoints.
    * **Avoid `LIKE '%...%'`:** Leading wildcards significantly degrade index performance. Consider alternative search strategies if possible.
    * **Use `EXISTS` instead of `COUNT(*)`:** When you only need to know if a record exists, `EXISTS` is often faster.
    * **Review and Rewrite Complex Queries:**  Simplify complex queries by breaking them down into smaller, more manageable queries.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Adjust based on available RAM – typically 25-50%.
    * **`work_mem`:**  Increase this if you have many sorts and aggregations.
    * **`maintenance_work_mem`:**  For maintenance operations (e.g., VACUUM).
    * **`effective_cache_size`:**  Inform PostgreSQL about available memory for caching.
    * **`autovacuum`:** Ensure `autovacuum` is enabled and properly configured to prevent table bloat.
* **[ ] Data Types:**
    * **Use Appropriate Data Types:** Choose data types that accurately represent your data to minimize storage space and improve query performance.
    * **Avoid Large Text/JSON Columns:**  If you're storing large text or JSON documents, consider using a specialized database for these types of data.

**II. Express.js Optimization**

* **[ ] Connection Pooling:**
    * **Use a Connection Pool:**  Don’t create a new connection for each request.  Libraries like `pg-pool` offer efficient connection pooling.
* **[ ] Middleware:**
    * **Minimize Middleware:** Only include middleware that's truly necessary.
    * **Order Matters:**  Place performance-sensitive middleware (e.g., authentication) closer to the request handling.
* **[ ] Route Handling:**
    * **Efficient Route Logic:**  Keep route handler functions concise and focused.
    * **Asynchronous Operations:**  Use `async/await` or Promises to handle asynchronous database operations without blocking the event loop.
    * **Caching (Limited Use Cases):** Implement caching for frequently accessed data, but be mindful of data staleness.
*
