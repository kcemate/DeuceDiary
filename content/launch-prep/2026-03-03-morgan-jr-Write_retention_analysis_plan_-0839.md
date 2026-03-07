# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T08:39:21.523244

Okay, here's a retention analysis plan incorporating D1 (Day 1), D7 (Day 7), and D30 (Day 30) benchmarks. This plan is designed to be flexible and adaptable – you’ll need to tailor it to your specific product, user base, and goals.

**Retention Analysis Plan: D1/D7/D30 Benchmarks**

**1. Executive Summary:**

* **Goal:** To understand user retention patterns and identify key drivers of churn (user drop-off) within the first 30 days of engagement.
* **Methodology:**  This plan utilizes cohort analysis to track user behavior over time, focusing on key actions and metrics.
* **Key Metrics:**  We'll track the following metrics for each cohort:
    * **New User Acquisition:** Total number of users acquired during a specific period.
    * **Activation:** Percentage of new users who complete a key activation step (e.g., setting up profile, completing onboarding tutorial, making a first purchase).  *Critical for understanding initial engagement.*
    * **Daily/Weekly/Monthly Active Users (DAU/WAU/MAU):** Measures of engagement over time.
    * **Feature Usage:**  Tracking which features are used most frequently.
    * **Churn Rate:** Percentage of users who stop using the product within the specified timeframes (D1, D7, D30).

**2. Cohort Definition & Segmentation:**

* **Cohort Definition:**  A cohort is a group of users who share a common characteristic – primarily the date they first used the product (e.g., all users who signed up in January 2024).
* **Segmentation (Optional, but Highly Recommended):** Segmenting cohorts based on key characteristics can reveal valuable insights. Examples include:
    * **Acquisition Channel:** (e.g., Organic Search, Paid Advertising, Referral) – To understand which channels drive the most engaged users.
    * **User Persona:** (e.g., Newbie, Power User, Corporate User) - Understanding the different types of users.
    * **Demographic Data:** (If available and relevant) – Exploring if retention varies by age, location, etc.


**3. Data Collection & Tracking:**

* **Tools:**
    * **Analytics Platform:** (Google Analytics, Mixpanel, Amplitude, Heap, etc.) - Centralized tracking of user behavior.
    * **CRM (Customer Relationship Management):** (Salesforce, HubSpot, etc.) - To track user data, support interactions, and potential churn reasons.
    * **Database:** Ensure you have a robust database to store user data efficiently.
* **Event Tracking:** Implement detailed event tracking within your application to capture user actions (e.g., button clicks, page views, video views, feature usage).
* **Data Integrity:** Regularly validate data quality to ensure accurate reporting.

**4. Benchmarks & Targets:**

| **Timeframe** | **Metric**         | **Target (%)** | **Rationale**                                    |
|---------------|--------------------|----------------|--------------------------------------------------|
| **D1**         | Activation Rate   | 60-70%         | Initial onboarding success is crucial.  Low activation suggests friction. |
|               | Daily Active Users | 20-30%        | Percentage of activated users still engaging daily. |
|               | Churn Rate        | <5%            | A manageable initial churn rate. Higher indicates significant problems. |
| **D7**         | Daily Active Users | 15-25%        | Key period for habit formation.  Lower D7 DAU indicates users may be losing interest. |
|               | Churn Rate        | <10%           |
