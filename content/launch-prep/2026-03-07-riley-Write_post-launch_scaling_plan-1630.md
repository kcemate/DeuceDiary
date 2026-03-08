# Write post-launch scaling plan with thresholds.
Agent: riley
Generated: 2026-03-07T16:30:37.447758

Okay, let's craft a post-launch scaling plan for a new product or feature, incorporating key thresholds to guide your decisions. This plan focuses on a phased approach, recognizing that scaling is rarely a single event.

**Product/Feature:** (Replace this with your actual product/feature name – e.g., “New Mobile App”, “Premium Subscription Tier”)

**Overall Goal:** To deliver a consistently positive user experience and maintain stable performance as we grow user base and feature usage.

**I. Phases of Scaling**

* **Phase 1: Initial Launch & Stabilization (Weeks 1-4)** - Focus: Monitoring & Quick Bug Fixes
* **Phase 2: Early Growth & Refinement (Weeks 5-8)** - Focus:  Basic Scaling & User Feedback
* **Phase 3:  Scaling for Volume (Weeks 9-16)** - Focus:  Infrastructure & Automation
* **Phase 4:  Continued Optimization & Expansion (Week 17+)** - Focus:  Advanced Scaling & New Features

**II. Key Metrics & Thresholds**

| Metric Category        | Metric                  | Threshold (Low) | Threshold (Medium) | Threshold (High) | Action                                                            |
|------------------------|-------------------------|------------------|--------------------|------------------|-------------------------------------------------------------------|
| **Performance**         | Response Time (Average) | < 2 seconds       | < 1 second          | < 0.5 seconds     | Investigate & Optimize – Code, Database, CDN                      |
|                        | Error Rate (Overall)    | < 1%              | < 0.5%             | < 0.1%            | Rollback affected code, investigate root cause                      |
| **User Engagement**     | Daily Active Users (DAU) | 50                 | 500                | 1000+            | Analyze DAU trends, identify usage patterns, plan for more resources |
|                        | Monthly Active Users (MAU)| 200               | 2000               | 5000+            | Refine onboarding, explore new engagement tactics                |
|                        | Feature Usage (Key Feature X) | 20%                | 50%                | 80%+             |  Optimize feature experience, consider promoting the feature        |
| **Infrastructure**      | CPU Utilization (Avg.)   | 30%               | 60%                | 80%+             | Scale up servers, optimize code for efficiency                     |
|                        | Memory Utilization (Avg.) | 40%               | 70%                | 90%+             | Investigate memory leaks, optimize data structures                   |
|                        | Database Query Time (Avg.)| < 100ms           | < 50ms             | < 20ms            | Optimize queries, add indexes                                     |
| **Support/Operations**  | Support Tickets          | 10/week            | 50/week            | 100+/week          | Scale support team, improve documentation, automate responses        |
|                        | Uptime (%)               | 99.5%             | 99.8%             | 99.99%+           | Implement robust monitoring & alerting, have a disaster recovery plan |
| **Cost**                | AWS Cost (Monthly)      | $500              | $1500              | $5000+            | Analyze cost drivers, implement cost-saving measures               |



**III. Scaling Actions – By Phase**

**Phase 1: Initial Launch & Stabilization (Weeks 1-4)**

* **Focus:**  Immediate bug fixes, performance tuning based on initial user data
