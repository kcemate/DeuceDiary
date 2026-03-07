# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T07:32:06.687649

Okay, here's a retention analysis plan outlining key benchmarks at D1 (1-day), D7 (7-day), and D30 (30-day). This plan covers data collection, metrics to track, analysis steps, and potential actions.  It’s designed to be a flexible framework – you'll need to adapt it based on your specific product, user base, and goals.

**Retention Analysis Plan**

**1. Goals & Objectives**

* **Overall Goal:**  Understand user retention patterns to identify areas for improvement and optimize our product/service to increase long-term engagement.
* **Specific Objectives:**
    * Determine the primary drivers of user churn.
    * Identify key segments of users with different retention profiles.
    * Establish benchmark retention rates for our product.
    * Guide product development and marketing efforts to enhance user stickiness.


**2. Data Collection & Tracking**

* **Platform:** (Specify which platform you're using – e.g., Web Analytics (Google Analytics, Mixpanel), Mobile App Analytics (Firebase, Amplitude), CRM, Database)
* **Data Points to Track:**
    * **User ID:** Unique identifier for each user.
    * **Join Date/Acquisition Date:**  Date the user first interacted with the product.
    * **Activity Dates:** Dates of all significant user actions (e.g., signup, first feature use, purchase, content creation, session start, session end).  This is *crucial*.
    * **User Segmentation:** Define segments based on key characteristics (e.g., acquisition channel, user demographics, subscription tier, initial feature usage).  This allows for comparative analysis.
    * **Event Tracking:**  Implement robust event tracking to capture granular user behavior.  Don't just track logins; track specific actions within your product.
* **Data Storage & Access:** Ensure you have a centralized system to store and access this data (e.g., data warehouse, analytics platform).



**3. Retention Metrics & Benchmarks**

| Metric              | Definition                               | D1 Benchmark | D7 Benchmark | D30 Benchmark | Interpretation                                                              |
|----------------------|-------------------------------------------|--------------|--------------|---------------|--------------------------------------------------------------------------|
| **DAU/MAU (Daily/Monthly Active Users)** | Ratio of active users over a period.   |  Aim for > 20%   | Aim for > 10%  | Aim for > 5%    | High DAU/MAU indicates healthy user engagement and ongoing value.          |
| **1-Day Retention**   | Percentage of users who return the day after signup | 30-40%        | 15-25%        | 5-10%          |  A solid first-day retention is important for setting expectations.       |
| **7-Day Retention**   | Percentage of users who return 7 days after signup| 10-20%        | 5-10%         | 2-5%           |  This is a critical indicator.  Falling below 10% suggests a problem.    |
| **30-Day Retention**  | Percentage of users who return 30 days after signup| 5-10%         | 2-4%         | 1-3%           |  This is the ultimate measure of long-term value.  Lower rates require investigation. |
| **Churn Rate**       | Percentage of users who stop using the product | < 5%         | < 2%         | < 1%           | Overall rate of user attrition.  Track this alongside retention rates. |
| **Voluntary Churn** | Users who actively cancel or close accounts   |
