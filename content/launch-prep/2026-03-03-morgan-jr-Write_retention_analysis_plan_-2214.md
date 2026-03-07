# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T22:14:29.015878

## Retention Analysis Plan - D1/D7/D30 Benchmarks

This plan outlines a comprehensive approach to analyzing user retention, focusing on key milestones: Day 1, Day 7, and Day 30. It details the metrics to track, the methods for data collection and analysis, and the actions to take based on the findings.

**I. Goals & Objectives:**

* **Understand User Journey:** Identify where users are dropping off and understand the reasons behind it.
* **Identify Key Churn Drivers:** Determine the most impactful factors contributing to early churn.
* **Optimize Onboarding & Engagement:**  Use retention data to inform improvements to the product onboarding experience and subsequent engagement strategies.
* **Track Impact of Changes:** Monitor retention after implementing changes to the product or marketing campaigns.

**II. Metrics & Definitions:**

* **DAU (Daily Active Users):** Number of unique users who engage with the product on a given day.
* **WAU (Weekly Active Users):** Number of unique users who engage with the product during a given week.
* **MAU (Monthly Active Users):** Number of unique users who engage with the product during a given month.
* **Retention Rate:** Percentage of users who return to the product after a specific period.  Calculated as: `((Users at Timepoint X) / (Users at Timepoint 0)) * 100`
* **Cohort Analysis:** Grouping users based on their acquisition date to track retention trends over time for specific groups.
* **Churn Rate:** Percentage of users who stopped using the product over a specific period. Calculated as: `(Number of Users Lost During Period / Total Number of Users at Start of Period) * 100`
* **Activation Rate:** Percentage of users who complete key onboarding steps or perform a specific action within a defined timeframe.
* **Session Duration:** Average length of a user’s interaction with the product.

**III. Data Collection & Tracking:**

* **Platform:** Utilize your analytics platform (e.g., Google Analytics, Mixpanel, Amplitude, Firebase) to track user behavior.
* **Event Tracking:** Implement robust event tracking to capture key user actions:
    * **Sign-up:** Track the initial registration.
    * **Onboarding Completion:** Identify when users complete key onboarding steps.
    * **Feature Usage:** Track usage of core product features.
    * **Engagement Events:**  Capture events that indicate continued engagement (e.g., posting content, completing tasks, inviting friends).
* **User Segmentation:** Segment users based on acquisition channel, demographics, and behavior to analyze retention trends for specific groups.
* **Data Freshness:** Ensure data is being updated regularly (ideally in near real-time) for accurate analysis.


**IV. Benchmark Timeline & Analysis (D1/D7/D30):**

| **Time Period** | **Metric Focus** | **Retention Rate (Target)** | **Key Questions & Analysis** | **Actionable Insights** |
|---|---|---|---|---|
| **D1 (Day 1)** | Activation & Initial Engagement | 30-40% (Minimum) | * Are users successfully completing the core onboarding flow? * What percentage of users are performing key initial actions? * Is the initial experience intuitive and engaging? *  Segment by Acquisition Channel – are some channels performing significantly better? | * Identify and fix onboarding friction points. * A/B test onboarding flows. * Prioritize communication based on channel performance. * Immediately address any significant performance dips based on acquisition channel. |
| **D7 (Day 7)** | Early Engagement & Habit Formation | 15-25% (Minimum) | * Are users continuing to engage with the product? * What features are they using most frequently? *
