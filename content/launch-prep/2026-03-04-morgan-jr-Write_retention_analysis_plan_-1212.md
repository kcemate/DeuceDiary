# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-04T12:12:56.401416

Okay, here's a retention analysis plan, outlining benchmarks at D1 (1-day), D7 (7-day), and D30 (30-day). This plan is designed to be a starting point and needs to be adapted based on your specific product, user base, and goals.

**Retention Analysis Plan**

**1. Goal:**

*   To understand user retention patterns and identify key drivers (or inhibitors) of user engagement and long-term usage.  This will inform product improvements, marketing strategies, and user onboarding efforts.

**2. Definitions & Metrics:**

*   **Retention Rate:** The percentage of users who continue to use your product/service after a specific period. Calculated as:
    *   `((Number of Users at Time Period N) - (Number of New Users Acquired in Time Period N)) / (Number of Users at Start of Time Period N)`
*   **Cohort:**  A group of users who started using the product within the same time period (e.g., all users who signed up in July 2024).  This is crucial for accurate analysis.
*   **DAU (Daily Active Users):**  Users who engage with the product at least once during a given day.
*   **WAU (Weekly Active Users):** Users who engage with the product at least once during a given week.
*   **MAU (Monthly Active Users):** Users who engage with the product at least once during a given month.  (Important: define this carefully – does a single interaction count, or do you need multiple?)

**3. Data Collection & Tracking:**

*   **Analytics Platform:**  You *must* be using an analytics platform that tracks user activity (e.g., Amplitude, Mixpanel, Google Analytics, Heap).  Ensure it accurately captures the events you consider "engagement" (e.g., creating an account, completing a key action, making a purchase, logging in).
*   **User Segmentation:**  Segment your users by key characteristics (e.g., acquisition channel, plan type, demographics) to see if different groups have different retention rates.
*   **Data Accuracy:** Regularly check your tracking to ensure events are being recorded correctly.  A faulty tracking system will invalidate your analysis.

**4. Benchmarks & Analysis Timeline**

| **Time Period** | **Metric**           | **Target Retention Rate (Example)** | **Analysis Focus**                                                              | **Actionable Insights**                                                                                   |
|------------------|-----------------------|-------------------------------------|-------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| **D1 (1-Day)**    | 1-Day Retention      | 40-60% (This varies GREATLY!)     |  Immediate first-impression.  What's the drop-off rate right after signup?          | - **High Drop-off:**  Poor onboarding flow?  Technical issues? Misleading messaging? - **Low Drop-off:** Great initial experience -  Understand what’s working. |
| **D7 (7-Day)**    | 7-Day Retention       | 15-30%                              | First-week engagement. Are users returning? What's preventing them?            | - **Low Retention:**  Product too complex?  Lack of perceived value? Not engaging enough features?     |
| **D30 (30-Day)**   | 30-Day Retention      | 5-10% (Again, highly variable)       |  Long-term value.  Are users sticking around after the initial honeymoon?             | - **Low Retention:**  Product isn’t meeting needs; competition is better; churn risk needs addressing.  |



**5. Detailed Analysis Steps (For
