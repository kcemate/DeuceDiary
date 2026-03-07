# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T18:50:31.392791

Okay, here's a retention analysis plan outlining benchmarks for D1 (1 day), D7 (7 days), and D30 (30 days) retention, incorporating best practices and considerations. This plan is designed to be a starting point; you'll need to adapt it to your specific product, business, and goals.

**Retention Analysis Plan**

**1. Goals & Objectives:**

* **Primary Goal:** Understand how long users continue to engage with our product/service and identify key drop-off points.
* **Secondary Objectives:**
    *  Identify the primary reasons for churn.
    *  Segment users based on retention patterns (e.g., by acquisition channel, user persona, feature usage).
    *  Inform product development, marketing, and onboarding efforts to improve retention.
    *  Establish baseline retention metrics for ongoing monitoring.

**2. Data Collection & Setup:**

* **Tracking:**  Implement robust tracking to capture user activity. This *must* include:
    * **Registration/Acquisition Date:** The date a user first registered or started using the product.
    * **Key Actions:** Define and track the core actions users perform in your product (e.g., creating a project, uploading data, inviting a teammate, completing a tutorial).  These will be your "engagement events."
    * **Session Data:** Record user sessions (start time, end time, pages visited, features used).
    * **Churn Event:**  Clearly define what constitutes a churn event (e.g., account inactivity for a specified period, cancellation of a subscription).
* **Data Sources:**
    * **Product Analytics:** (Mixpanel, Amplitude, Google Analytics, etc.) - Essential for tracking user behavior.
    * **CRM:** (Salesforce, HubSpot, etc.) - For user demographics and potentially engagement data.
    * **Database:**  Raw data to confirm and validate analytics.
* **Data Quality:** Implement rigorous data validation processes to ensure accuracy.

**3. Metric Definitions:**

* **Retention Rate:** The percentage of users who remain active after a specific period.  Calculate this as:
   * `(Number of Users Active at Day X) / (Number of Users Active at Day 0) * 100`
* **Cohort:** A group of users who share a common characteristic (e.g., acquired on the same day, used the same onboarding flow).  This is *critical* for accurate analysis.
* **DAU/MAU (Daily Active Users / Monthly Active Users):**  A standard metric for gauging engagement.  Helps identify trends in overall activity.


**4. Benchmarks & Analysis Schedule:**

| **Time Period** | **Metric**              | **Target Retention Rate (Example)** | **Analysis Focus**                               | **Actions to Consider**                               |
|-----------------|------------------------|--------------------------------------|---------------------------------------------------|------------------------------------------------------|
| **D1 (1 Day)**    | 1-Day Retention        | 50% - 70% (Highly Dependent on Product) | Initial Drop-Off:  Is the onboarding process confusing?   | Immediate onboarding tweaks, welcome email sequence.    |
| **D7 (7 Days)**   | 7-Day Retention        | 20% - 40%                              | Understanding early engagement patterns.          | Identify problematic features, refine onboarding flow. |
| **D30 (30 Days)** | 30-Day Retention       | 5% - 15%                               |  Core Retention - Key indicator of long-term value. |  Deep dive into churn reasons, address underlying issues.|

**5. Segmentation & Analysis Techniques:**

* **Cohort Analysis:**  Analyze retention rates *within* cohorts.  This will reveal
