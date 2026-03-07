# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T08:16:55.875744

Okay, here's a Retention Analysis Plan, structured around D1 (Day 1), D7 (Day 7), and D30 (Day 30) benchmarks. This plan provides a framework – you'll need to adapt it to your specific product, audience, and data availability.

**Retention Analysis Plan**

**1. Executive Summary:**

*   **Goal:** To understand user retention patterns and identify key drivers of churn within the first 30 days of using our product/service.  This data will inform strategies to improve user engagement and long-term retention.
*   **Timeframe:** This analysis will span the first 30 days of a user's onboarding experience.
*   **Key Metrics:**  We will primarily focus on the following:
    *   **D1 Retention:** Percentage of users who return to use the product/service on day 1 after initial onboarding.
    *   **D7 Retention:** Percentage of users who return to use the product/service on day 7.
    *   **D30 Retention:** Percentage of users who return to use the product/service on day 30.
    *   **Churn Rate:** Calculated as 1 - Retention Rate for each period.
    *   **Activation Rate:**  Percentage of users who complete key activation milestones (e.g., setting up profile, completing a first task).  (This will be used to understand if activation is a barrier to retention).
    *   **Feature Usage:** Track which features users are actively utilizing (especially during the early days).

**2. Data Collection & Tracking:**

*   **Data Source:** [Specify your data source – e.g., Product Analytics platform (Mixpanel, Amplitude, Google Analytics), CRM, Database]
*   **Events Tracked:**
    *   **User Sign-Up:** The event marking the start of the user’s onboarding.
    *   **Login/App Open:**  Tracks user activity within the application.  This is our primary event for measuring retention.
    *   **Key Activation Events:**  Define 2-3 critical actions users *need* to take to experience the core value of your product (e.g., creating a project, inviting a team member, uploading content).  Tracking these events provides insight into whether users are truly engaging.
    *   **Feature Usage Events:** Track specific actions within the application (e.g., adding a tag, sending a message, creating a report).
*   **Segmentation:**  Segment users based on relevant criteria.  This is *crucial* for identifying patterns. Examples:
    *   **Traffic Source:** (e.g., Organic Search, Paid Advertising, Referral) - Understand if certain acquisition channels are associated with higher or lower retention.
    *   **User Persona:** (If applicable) –  Tailor analysis based on different user types.
    *   **Plan Type:** (e.g., Free Trial, Basic, Premium) -  Retention rates might differ across plans.
    *   **Onboarding Completion:** Categorize users as "Completed Onboarding" (having taken the key activation steps) vs. "Incomplete Onboarding".

**3. Benchmarks & Targets:**

| Benchmark  | Target (%) | Justification                                                                                             |
| :--------- | :--------- | :------------------------------------------------------------------------------------------------------- |
| **D1**      | 30-40%     | Initial excitement and the “aha!” moment are key.  A low D1 retention suggests a poor onboarding experience. |
| **D7**      | 15-25%     | Users are beginning to understand the value proposition, but some may be losing interest.                   |
| **D30**     | 5-
