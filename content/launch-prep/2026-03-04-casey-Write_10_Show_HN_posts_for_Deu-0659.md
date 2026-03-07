# Write 10 Show HN posts for Deuce Diary with technical angle.
Agent: casey
Generated: 2026-03-04T06:59:05.346770

Okay, here are 10 Show HN posts for Deuce Diary, focusing on technical aspects and designed to be engaging for the Deuce community. I've aimed for a variety of topics and levels of detail, reflecting the diverse areas of work happening at Lyft.

---

**1. Post Title: Optimizing Kafka Latency with a Custom Shard Router**

**Image:** A simplified diagram showing the Deuce shard router routing traffic to different Kafka shards based on a key.

**Body:**

“We’ve been tackling a persistent latency issue in our internal event pipelines, specifically around Kafka processing for [mention specific feature, e.g., ride request validation].  Our initial approach relied on Deuce’s standard shard routing, but we found it wasn’t granular enough to effectively mitigate congestion.  We built a custom shard router that leverages more sophisticated key-based routing logic – specifically, adding [mention a specific metric or data point used for routing, e.g., ride duration, distance] to the Kafka topic key.

*   **Tech Details:** We're using [mention framework/language, e.g., Go] and leveraging Kafka Streams to implement the router.  We've seen a ~[quantify improvement, e.g., 15%] reduction in average processing latency.  We're open to discussing the design choices and how you might approach similar routing challenges. [Link to internal documentation/code repo - redacted for privacy]. #kafka #latency #routing”

---

**2. Post Title:  Introducing Dynamic Schema Evolution in Deuce Operators**

**Image:** A before-and-after schema diagram illustrating a change with minimal impact.

**Body:**

“We’re excited to announce a new feature in the Deuce operator: dynamic schema evolution!  Previously, modifying schema definitions required a redeployment, which was disruptive. Now, we can define schema evolutions that are applied *incrementally* without service interruptions.  This is facilitated by [mention key tech, e.g., Kafka Schema Registry, Avro evolution rules].

*   **Tech Details:**  We're utilizing [Mention specific tooling/protocol, e.g., Kafka Schema Registry's schema evolution capabilities] with a carefully crafted set of rules. This allows us to shift to new versions of our event schemas without impacting producers.  We'd love to hear about your experiences with schema evolution in other systems.  [Link to internal documentation/experiment details - redacted]. #schemaevolution #kafka #operators”

---

**3. Post Title:  Profiling Deuce’s Load Balancing Algorithm - How We Found Bottlenecks**

**Image:** A heat map visualization showing resource contention during a load test.

**Body:**

“We recently conducted a deep dive into the performance of our load balancing algorithm.  Using [mention profiling tool, e.g., pprof, flamegraphs], we identified a surprising bottleneck: contention around shard assignment for [mention a specific area of contention, e.g., peak ride times].

*   **Tech Details:** The key takeaway was [briefly describe the root cause - e.g., the linear scan of shard IDs]. We've implemented [mention the mitigation, e.g., a hash-based shard assignment] which has resulted in a [quantify improvement, e.g., 20%] increase in throughput. We are sharing this work to help the wider engineering community think about shard routing strategy. [Link to internal analysis/visualization - redacted]. #loadbalancing #performance #profiling”

---

**4. Post Title:  Integrating Prometheus with Deuce – Real-Time Monitoring & Alerting**

**Image:** A screenshot of the Deuce UI showing a Prometheus graph.

**Body:**

“We’ve dramatically improved our observability by integrating Deuce directly with Prometheus.
