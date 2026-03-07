# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-07T11:31:30.294850

## CDN and Asset Optimization Plan

This plan outlines a strategy for implementing a Content Delivery Network (CDN) and optimizing your website's assets to improve performance, reduce latency, and enhance user experience.

**I. Goals & Objectives:**

* **Reduce Page Load Time:**  Significantly decrease the time it takes for pages to load, improving user engagement and potentially SEO ranking.
* **Improve User Experience:** Provide a faster, smoother browsing experience, leading to increased user satisfaction.
* **Reduce Server Load:** Offload static content delivery to the CDN, reducing the burden on your origin server and improving its overall performance.
* **Global Reach:**  Deliver content quickly to users worldwide.
* **Mobile Optimization:** Ensure a fast experience for users accessing your site on mobile devices.


**II. CDN Implementation:**

* **CDN Selection:**
    * **Evaluate Options:** Research and compare popular CDNs like:
        * **Cloudflare:** Offers a generous free tier and strong security features.
        * **Amazon CloudFront:**  Integrates seamlessly with AWS services, highly scalable.
        * **Akamai:** Known for high performance and a focus on enterprise solutions.
        * **Google Cloud CDN:**  Leverages Google’s global network for fast delivery.
        * **Key Considerations:** Price, geographic coverage, features (SSL/TLS, caching rules, security), ease of integration, and support.
    * **Recommendation (Starting Point):** Cloudflare is often a good starting point due to its free tier and ease of use.
* **CDN Configuration:**
    * **Domain Routing:** Configure your domain to point to the CDN’s edge servers.  Typically, this involves changing your DNS records.
    * **Caching Rules:**  Configure caching rules to determine how long content is cached.  Consider these factors:
        * **Cache-Control Headers:**  Implement appropriate `Cache-Control` headers in your HTML and static asset files (e.g., `max-age`, `private`, `public`).
        * **CDN-Specific Rules:**  Utilize the CDN’s interface to set custom caching rules based on file types, URL paths, and user agents.
    * **SSL/TLS Configuration:** Ensure all content is served over HTTPS for security. The CDN usually handles SSL certificate management.
    * **Purge Cache:** After any content changes, trigger a cache purge within the CDN to ensure users receive the latest version.

**III. Asset Optimization:**

* **Image Optimization:** This is *crucial* for performance.
    * **Compression:** Use image compression techniques (lossy or lossless) to reduce file sizes without significant quality loss. Tools: TinyPNG, ImageOptim, ShortPixel.
    * **Format:** Optimize image formats. Use WebP for superior compression and quality, JPEG for photographs, and PNG for graphics with transparency.
    * **Responsive Images:** Serve appropriately sized images based on the user's device and screen size using the `<picture>` element or the `srcset` attribute in `<img>` tags.
    * **Lazy Loading:** Load images only when they are visible in the viewport.
* **CSS & JavaScript Optimization:**
    * **Minification:** Remove unnecessary characters (whitespace, comments) from CSS and JavaScript files to reduce their size. Tools: UglifyJS, CSSNano.
    * **Concatenation:** Combine multiple CSS and JavaScript files into fewer files to reduce HTTP requests. (However, HTTP/2 often makes concatenation less critical).
    * **Code Splitting (for JavaScript):**  Break large JavaScript files into smaller chunks that can be loaded on demand, improving initial page load time.
* **Font Optimization:**
    * **Web Font Formats:** Use WOFF2 as the primary format – it offers the best compression.
    * **Subset
