# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T21:11:51.230808

## Performance Optimization Checklist: Express.js + PostgreSQL App on Railway

This checklist focuses on optimizing your Express.js app running on Railway, with a strong emphasis on database performance and leveraging Railway's features.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and missing indexes.  This is *the* most important step.
    * **Index Columns Used in WHERE Clauses:** Prioritize indexing columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Create composite indexes for queries frequently using multiple columns together.
    * **Index Cardinality:** Understand index cardinality – how selective the index is.  Over-indexing can be as detrimental as under-indexing.
    * **Data Type Matching:** Ensure index columns match the data types used in queries.
    * **Regular Index Maintenance:**  PostgreSQL automatically maintains indexes, but monitoring and manual rebuilding (rare) might be needed for large datasets or frequent updates.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the necessary columns. Reduces bandwidth and parsing overhead.
    * **Use `JOIN`s Efficiently:**  Ensure `JOIN`s are using appropriate indexes and are the most efficient method for connecting data.
    * **Avoid `LIKE '%...'`:** Leading wildcards in `LIKE` clauses prevent index usage. Consider alternative search strategies if possible.
    * **Optimize `WHERE` Clauses:** Simplify `WHERE` clauses. Avoid complex logic within `WHERE` when simpler alternatives exist.
    * **Limit Results with `LIMIT`:**  Use `LIMIT` to restrict the number of rows returned, especially for pagination.
    * **Use `EXISTS` instead of `COUNT(*)`:** When checking for existence, `EXISTS` is generally faster.
    * **Review Query Plans:** Regularly review query plans to identify bottlenecks.  Railway's database dashboard often provides query plan views.
* **[ ] Schema Design:**
    * **Normalization:**  Properly normalize your schema to reduce redundancy and improve data integrity.
    * **Data Types:**  Choose appropriate data types to optimize storage and query performance. Avoid overly large data types when smaller ones suffice.
* **[ ] Connection Pooling:**  Railway handles connection pooling automatically, but ensure your code isn't prematurely closing connections.
* **[ ] Database Monitoring:** Utilize Railway’s database monitoring tools (if available) or external tools to track metrics like query execution time, CPU usage, and disk I/O.


**II. Express.js Application Optimization**

* **[ ] Code Efficiency:**
    * **Avoid Unnecessary Calculations:** Optimize calculations within routes and middleware.
    * **Minimize Middleware Usage:**  Only use middleware that’s absolutely necessary. Each middleware adds overhead.
    * **Asynchronous Operations:**  Utilize `async/await` for efficient handling of asynchronous operations.
    * **Code Splitting (if applicable):**  If your app has large JavaScript bundles, consider code splitting to load only the necessary code.
* **[ ] Request Handling:**
    * **Keep Requests Small:** Minimize the amount of data transferred in requests and responses.
    * **Efficient Data Serialization/Deserialization:**  Use efficient methods for serializing and deserializing data (e.g., `JSON.stringify()`/`JSON.parse()`).
* **[ ] Logging:**  Don't over-log.  Excessive logging can impact performance. Use a logging library that allows you to configure log levels.


**III. Railway Specific Optimizations**

* **[ ] Instance Size:**  Choose the appropriate Railway instance size for your app’s needs.  Start small and
