# Write post-launch scaling plan with thresholds.
Agent: riley
Generated: 2026-03-04T08:13:45.021644

Okay, here's a post-launch scaling plan with thresholds, designed to be a starting point. This is a template – you'll need to adapt it to your specific product, business model, and infrastructure.  It focuses on a phased approach, prioritizing rapid growth while maintaining stability.

**Product:** [Insert Product Name Here]
**Date of Launch:** [Insert Launch Date]
**Goal:**  Sustainable Growth & Scalable Infrastructure

**I. Phase 1: Initial Traction (0-30 Days Post-Launch)**

* **Focus:** Stabilizing the platform, capturing early adopters, and gathering immediate feedback.
* **Key Metrics:**
    * **Daily Active Users (DAU):** Threshold: 500 - 1,000.  Alert: Below 300 (Investigate - potential issues, lack of marketing impact)
    * **Monthly Active Users (MAU):** Threshold: 2,000 - 5,000. Alert: Below 1,000 (Requires immediate marketing review & optimization)
    * **Conversion Rate (Free to Paid, if applicable):** Threshold: 5% - 10%. Alert: Below 3% (Needs immediate optimization of onboarding, pricing, or value proposition)
    * **Error Rate (Website/App):** Threshold: < 2%. Alert: > 3% (Critical - investigate server performance, code issues)
    * **Session Duration:** Threshold: 15-30 minutes. Alert: < 10 minutes (Suggests user engagement issues)
    * **Server Load (CPU, Memory):** Threshold: < 70% utilization. Alert: > 80% (Indicates potential bottlenecks, start monitoring closely)
* **Scaling Actions:**
    * **Monitoring & Alerting:** Implement robust monitoring tools (e.g., New Relic, Datadog, Prometheus) and set alerts based on the above thresholds.
    * **Basic Infrastructure Scaling:**  Scale up database instances (if applicable) and server resources as needed.  Consider using auto-scaling if feasible.
    * **Customer Support:**  Prioritize proactive support and address user issues quickly.
    * **Feedback Collection:** Implement in-app surveys, user forums, and actively monitor social media.



**II. Phase 2:  Growth Acceleration (30-90 Days Post-Launch)**

* **Focus:**  Expanding user base, refining the product based on feedback, and optimizing key workflows.
* **Key Metrics (Expanded):**
    * **All Phase 1 metrics +**
    * **Customer Acquisition Cost (CAC):** Threshold: < $50. Alert: > $75 (Requires re-evaluation of marketing channels)
    * **Customer Lifetime Value (CLTV):**  Threshold: > $100 (Starting point – track and adjust based on retention)
    * **Retention Rate (30-day, 90-day):** Threshold: 10% - 20%. Alert: Below 8% (Significant retention issues - investigate)
    * **Feature Usage:** Track which features are most popular and which are underutilized.
* **Scaling Actions:**
    * **Infrastructure Scaling:** Implement more sophisticated auto-scaling based on demand patterns.  Consider using a CDN for static assets.
    * **Database Optimization:**  Tune database queries, add indexes, and explore database sharding if necessary.
    * **Marketing Expansion:**  Scale up successful marketing channels, experiment with new channels.
    * **A/B Testing:**  Conduct A/B tests on key features and user flows to optimize for conversion and engagement.



**III. Phase 3:  Sustainable Scaling (90+ Days Post-
