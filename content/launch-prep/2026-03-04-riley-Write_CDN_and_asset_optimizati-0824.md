# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-04T08:24:50.033934

## CDN & Asset Optimization Plan

This plan outlines a strategy for leveraging a Content Delivery Network (CDN) and optimizing assets to improve website performance, user experience, and SEO.

**I. Goals & Objectives:**

* **Reduce Page Load Times:**  A primary goal is to significantly decrease the time it takes for pages to load, leading to higher user engagement and lower bounce rates.
* **Improve User Experience:** Fast loading websites create a smoother, more enjoyable experience for visitors.
* **Boost SEO:** Page speed is a significant ranking factor for Google and other search engines.
* **Reduce Server Load:** Offloading static assets to a CDN reduces the load on your origin server.
* **Increase Mobile Performance:** Optimize for mobile users who often have slower connections.


**II. CDN Implementation:**

1. **CDN Selection:**
   * **Evaluate Options:** Consider popular CDN providers like:
      * **Cloudflare:** Generally the most cost-effective and offers excellent free tier.
      * **Amazon CloudFront:** Powerful and integrates well with AWS services.
      * **Google Cloud CDN:** Seamless integration with Google Cloud Platform.
      * **Akamai:** Enterprise-grade CDN with a strong focus on performance.
      * **Fastly:** Developer-focused CDN with granular control.
   * **Key Criteria:** Cost, geographic coverage, features (SSL, caching rules, dynamic content acceleration), ease of integration, and support.
   * **Recommendation:**  For most websites, **Cloudflare** is a strong starting point due to its excellent value and ease of use.

2. **CDN Configuration:**
   * **DNS Changes:**  Update your DNS records to point to the CDN's servers. The provider will typically provide specific DNS records to add.
   * **Origin Configuration:**  Tell the CDN which server is the "origin" of your content (your web server).
   * **Caching Rules:**  Define how long assets should be cached by the CDN.  Consider:
      * **Cache-Control Headers:**  Use HTTP headers to control caching behavior (e.g., `Cache-Control: max-age=3600` for 1 hour).
      * **Purging/Invalidation:**  Implement a mechanism to invalidate the CDN cache when content is updated.
   * **Geographic Restrictions (if needed):**  Restrict access based on location if required by legal or business reasons.

**III. Asset Optimization:**

1. **Image Optimization:**
   * **Compression:**  Use tools like TinyPNG, ImageOptim, or ShortPixel to compress images without significant quality loss.  Lossy compression is acceptable for many images.
   * **Responsive Images:**  Serve different image sizes based on the user's device and screen size using the `<picture>` element or the `srcset` attribute in `<img>` tags.
   * **WebP Format:**  Convert images to WebP format, which offers superior compression and quality compared to JPEG and PNG.
   * **Lazy Loading:**  Load images only when they are visible in the viewport to improve initial page load time.
   * **Optimization Tools:** Utilize services like Kraken.io or Cloudinary for automated image optimization.

2. **CSS & JavaScript Optimization:**
   * **Minification:** Remove unnecessary characters (whitespace, comments) from CSS and JavaScript files. Tools: UglifyJS, CSSNano.
   * **Concatenation:** Combine multiple CSS and JavaScript files into fewer files to reduce the number of HTTP requests. Be mindful of caching implications.
   * **Code Splitting (for JavaScript):** Divide JavaScript code into smaller chunks that can be loaded on demand.  This is particularly important for large applications.
   * **Defer/Async Attributes:** Use the `defer` or `async` attributes on `<script>` tags to
