# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-07T16:59:20.715475

Okay, here’s a retention analysis plan outlining benchmarks at D1 (1 day), D7 (7 days), and D30 (30 days), incorporating key considerations and best practices. This plan is designed to be a starting point and should be adapted based on your specific product, user base, and business goals.

**Retention Analysis Plan**

**1. Goals & Objectives:**

* **Primary Goal:** Understand how long users remain active with our product/service and identify key drop-off points.
* **Secondary Objectives:**
    *  Segment users based on behavior (e.g., frequency of use, features used, cohort).
    *  Identify the reasons behind churn (qualitative and quantitative data).
    *  Develop targeted interventions to improve retention rates.
    *  Measure the impact of retention-focused initiatives.

**2. Data Requirements & Tracking:**

* **Key Metrics:**
    * **Daily Active Users (DAU):** Number of users who engage with the product/service on a given day.
    * **Monthly Active Users (MAU):** Number of users who engage with the product/service over a month.
    * **Retention Rate:** Percentage of users who remain active after a specific period (e.g., Day 1, Week 1, Month 1).  Calculated as: ((Users at Time X - New Users at Time X) / Total Users at Time X) * 100
    * **Churn Rate:** Percentage of users who stop using the product/service over a specific period. Calculated as: 100 - Retention Rate
    * **Time to First Value (TTFV):**  How long it takes a user to experience the core value of the product.  Lower TTFV generally correlates with higher retention.
    * **Feature Usage:** Tracking which features users engage with and how frequently.
    * **Session Length/Frequency:**  How long and how often users are using the product.
    * **User Actions:**  Tracking key actions within the product (e.g., creating a project, inviting a team member, completing a task).
* **Data Sources:**
    * **Product Analytics Platform:** (e.g., Mixpanel, Amplitude, Google Analytics, Heap) – Essential for tracking user behavior and events.
    * **CRM System:** (e.g., Salesforce, HubSpot) –  Provides user demographics, signup information, and potentially support interactions.
    * **Marketing Automation Platform:** (e.g., Marketo, Pardot) –  To track email engagement and campaign attribution.
    * **Support Tickets:**  Analyzing support interactions can reveal common issues and frustrations.

**3. Segmentation Strategy:**

* **Initial Segmentation (Recommended):**
    * **Cohort-Based:** Group users based on their signup date (e.g., all users who signed up in January 2024).  This is the most common and effective approach.
    * **Usage Level:** Segment based on feature usage – high, medium, low.
    * **Demographics:** (If available and relevant) Segment by age, location, industry, etc.
* **Advanced Segmentation (Later Phase):** As you gather more data, you can refine your segments based on behavior, acquisition channel, or other factors.


**4. Benchmarks & Timeline:**

| **Time Period** | **Metric**            | **Benchmark Target** | **Rationale**                               | **Actionable Insights**                               |
|-----------------|-----------------------|----------------------|---------------------------------------------|----------------------------------------------------|
| **D1 (1 Day)**     | 1-Day Retention Rate  | 40-60%                | Initial drop-off is highest.  Many users will explore. |  Significant drop-off indicates
