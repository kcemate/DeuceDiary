# Write post-launch scaling plan with thresholds.
Agent: riley
Generated: 2026-03-03T21:16:38.734918

Okay, here's a post-launch scaling plan for a new product or feature, incorporating key stages, thresholds, and considerations. This is a template – you’ll need to tailor it heavily to your specific product, market, and business goals.

**Product:** [Insert Product Name Here]
**Feature:** [Insert Feature Name Here]
**Date Launched:** [Date]

**Overall Goal:**  Sustainable, controlled growth with minimal disruption, ensuring a positive user experience and maximizing return on investment.

**I. Phase 1: Initial Traction (0-7 Days Post-Launch)**

* **Goal:** Validate core functionality, gather initial user feedback, and establish a baseline.
* **Metrics:**
    * **Daily Active Users (DAU):** < 100 (Initial Target – this is *very* small)
    * **Monthly Active Users (MAU):** < 500
    * **Conversion Rate (e.g., Free to Paid):** < 2%
    * **Average Session Duration:** 5-10 minutes
    * **Bounce Rate:** < 50% (This is highly dependent on the feature - a landing page might have a higher bounce rate)
    * **Error Rate:** < 5% (Track specific errors in the product)
* **Scaling Actions:**
    * **Monitoring & Alerting:**  Set up robust monitoring dashboards (e.g., Datadog, New Relic, Sentry) for all key metrics.  Configure alerts for spikes in errors or performance degradation.
    * **Customer Support:**  Increase responsiveness in customer support channels (email, chat). Prioritize bug fixes based on impact.
    * **Quick Feedback Loops:**  Implement in-app surveys, feedback buttons, and actively monitor social media for mentions.
    * **Simple Infrastructure Adjustments:**  If resource usage (CPU, memory) is consistently hitting 75%, scale up the hosting environment slightly (e.g., move to a larger VM instance).
* **Threshold Trigger:** If DAU consistently exceeds 200 for 3 consecutive days, immediately move to Phase 2.


**II. Phase 2: Growth & Optimization (8-30 Days Post-Launch)**

* **Goal:**  Expand user base, refine feature based on feedback, and optimize for performance.
* **Metrics:**
    * **DAU:** 200 – 1000
    * **MAU:** 800 – 3000
    * **Conversion Rate:** 2% – 5%
    * **Average Session Duration:** 10-20 minutes
    * **Bounce Rate:** 30-45% (Acceptable for some features, investigate higher rates)
    * **Error Rate:** < 2%
    * **Page Load Times:**  < 3 seconds (Critical for performance)
* **Scaling Actions:**
    * **A/B Testing:** Start implementing A/B tests for key UI elements, messaging, and flows.
    * **Performance Tuning:**  Identify and address performance bottlenecks (database queries, code inefficiencies).
    * **Content Updates:**  Create more comprehensive help documentation and tutorials.
    * **Expanded Infrastructure:**  Scale up database servers, CDN bandwidth, or application servers as needed based on usage patterns.
    * **Community Building:** Start fostering a community around the product (forum, Slack channel, etc.)
* **Threshold Trigger:** If MAU consistently exceeds 5000 for 7 consecutive days and Conversion Rate > 5%, move to Phase 3.



**III. Phase 3: Scaling & Refinement (31+ Days Post-Launch)**

* **Goal:**  Handle increased user volume, refine the
