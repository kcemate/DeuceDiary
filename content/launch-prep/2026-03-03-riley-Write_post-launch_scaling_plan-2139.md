# Write post-launch scaling plan with thresholds.
Agent: riley
Generated: 2026-03-03T21:39:20.447391

Okay, here's a post-launch scaling plan with thresholds, designed to be adaptable. This is a template – you'll need to customize it heavily based on your specific product, technology stack, and business goals.

**Product:** [Insert Product Name Here]
**Launch Date:** [Insert Launch Date Here]
**Goal:** [Clearly State Primary Goal - e.g., Acquire 10,000 Users, Achieve X% Conversion Rate]

**I. Monitoring & Key Metrics (Real-time & Scheduled)**

| Metric Category          | Metric                   | Tool(s) Used       | Frequency       | Target (Baseline) | Threshold Warning | Threshold Critical | Action                                     |
|--------------------------|--------------------------|--------------------|-----------------|------------------|--------------------|----------------------|--------------------------------------------|
| **Usage/Engagement**     | Daily Active Users (DAU) | Amplitude, Google Analytics, Mixpanel | Real-time/Daily  | 500                | 20% Drop           | 50% Drop             | Investigate, Optimize onboarding, Run user research |
|                         | Monthly Active Users (MAU) | Amplitude, Google Analytics, Mixpanel | Weekly/Monthly  | 2,000              | 15% Drop           | 30% Drop             | Analyze user behavior, content performance   |
|                         | Session Duration          | Google Analytics, Mixpanel | Daily/Weekly     | 5 Minutes         | 30% Drop           | 50% Drop             | Identify drop-off points in user flows        |
|                         | Features Used             | Amplitude, Google Analytics | Daily/Weekly     | 30% (Key Feature) | 20% Drop           | 40% Drop             | Prioritize feature development, improve promotion |
| **Performance**          | Page Load Time (Average)   | Google PageSpeed Insights, Pingdom | Real-time/Daily  | < 2 Seconds       | 3 Seconds          | > 4 Seconds           | Optimize code, images, CDN configuration     |
|                         | API Response Time          | Datadog, New Relic, CloudWatch | Real-time/Daily  | < 100ms           | 300ms              | > 500ms              | Investigate API bottlenecks, optimize DB queries|
| **Errors & Stability**   | Error Rate                | Sentry, Rollbar, Bugsnag | Real-time/Daily  | < 1%               | 5%                 | > 10%                | Immediate investigation, hotfix deployment   |
|                         | Crash Rate                | Firebase Crashlytics, Crashlytics | Real-time/Daily  | < 0.5%             | 2%                 | > 3%                 | Investigate root cause, prioritize fixes     |
| **Infrastructure**       | CPU Utilization (Avg)     | Cloud Provider Monitoring (AWS CloudWatch, Azure Monitor, GCP Monitoring) | Real-time/Hourly  | 30%                | 60%                | 80%                 | Scale compute resources (auto-scaling)      |
|                         | Memory Utilization (Avg)   | Cloud Provider Monitoring | Real-time/Hourly  | 50%                | 75%                | 90%                 | Optimize application memory usage          |
|                         | Database Connections       | Database Monitoring Tools | Real-time/Hourly  | 100                | 150                | 200                 | Optimize queries, increase database size     |
| **Financial**            | Monthly Recurring Revenue (MRR) | Billing System        | Monthly           | $1,000             | $500 Drop           |
