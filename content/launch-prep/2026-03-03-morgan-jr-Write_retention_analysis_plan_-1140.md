# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T11:40:11.080541

Okay, here's a Retention Analysis Plan incorporating D1 (Day 1), D7 (Day 7), and D30 (Day 30) benchmarks, designed to be adaptable to various products and businesses. This plan outlines the key steps, metrics, and considerations for measuring and understanding retention.

**Retention Analysis Plan**

**1. Goals & Objectives**

* **Primary Goal:** To understand user behavior and identify areas for improvement to increase user retention across key timeframes.
* **Specific Objectives:**
    * Determine overall user retention rates at D1, D7, and D30.
    * Identify the leading causes of churn (users who don’t return) within these timeframes.
    * Prioritize actions to improve retention based on the root causes identified.
    * Establish a baseline for future retention tracking and optimization efforts.

**2. Data Collection & Tracking**

* **Key User Signals:**
    * **First Launch/Signup:** Record the date and time of the first launch/signup.
    * **Activation:**  Define “Activation” – this is critical.  It's the moment a user truly starts to engage with the core value proposition of your product. Examples: completing a key task, inviting a friend, creating content, etc.
    * **Return/Login:** Track every login event – the date and time of each login.
    * **Key Action Completion:**  Track completion of important features or tasks. (e.g., in a SaaS: setting up a project, integrating a third-party tool, creating a report).
    * **Churn Definition:** Clearly define what constitutes "churn." This might be:
        * No login after a certain period (e.g., 7 days after activation).
        * Cancellation of a subscription.
        * Explicit opt-out.
* **Data Sources:**
    * **Product Analytics Tools:** (Mixpanel, Amplitude, Google Analytics, Heap) - For tracking user behavior and events.
    * **CRM System:** (Salesforce, HubSpot) – For user demographics and account information.
    * **Database:**  For raw data tracking logins, activations, and other relevant events.
* **Tagging & Event Tracking:**  Ensure robust tagging within your product and analytics tools to accurately capture user actions and segment users.


**3. Benchmarks & Metrics**

| Benchmark | Definition                    | Target (Example) | Measurement Frequency | Notes                                         |
|-----------|-------------------------------|--------------------|-----------------------|------------------------------------------------|
| **D1**      | Percentage of users who return after initial signup/launch. | 30-50%                | Daily                | This is the most critical benchmark.  High drop-off here signals serious issues. |
| **D7**      | Percentage of users who return after 7 days.   | 15-25%                | Weekly                |  Indicates early engagement and initial stickiness. |
| **D30**     | Percentage of users who return after 30 days. | 5-10%                | Monthly               |  Represents long-term retention; a more challenging goal. |
| **Cohort Analysis:** Track retention based on groups of users who joined at the same time (e.g., all users who signed up in January). | Allows for comparison of retention rates across different cohorts. | N/A                 | Essential for identifying trends and patterns. |
| **Retention Rate:** (Formula:  (Number of Users at Time X - Number of New Users at Time X) / Total Number of Users at Time X) * 100 |  Calculates the percentage of users retained over a specific period. | N/A                 | Standard retention metric. |
| **Churn Rate:**
