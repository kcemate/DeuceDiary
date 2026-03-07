# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-03T11:16:15.175121

## CDN and Asset Optimization Plan

This plan outlines a strategy for leveraging a Content Delivery Network (CDN) and optimizing assets to improve website performance, reduce load times, and enhance user experience.

**I. Goals & Objectives:**

* **Reduce Page Load Times:** Aim for an average page load time under 3 seconds.
* **Improve User Experience:** Minimize bounce rates and increase engagement.
* **Reduce Server Load:** Offload static content delivery to the CDN, freeing up server resources.
* **Increase Mobile Performance:** Optimize assets for mobile devices, crucial for a significant portion of web traffic.
* **Global Reach:** Deliver content quickly to users worldwide.


**II. CDN Implementation:**

* **CDN Provider Selection:**
    * **Options:** AWS CloudFront, Akamai, Cloudflare, Google Cloud CDN, Fastly
    * **Selection Criteria:** Price, geographical coverage, features (e.g., SSL certificates, image optimization, dynamic content acceleration), ease of integration, and support.
    * **Recommendation:** **Cloudflare** is often a good starting point due to its generous free tier and global network.
* **CDN Configuration:**
    * **Origin Server:**  Point the CDN to your website's origin server (where your website's code and assets live).
    * **Caching Rules:** Configure caching rules based on asset types, expiry times, and geographical targeting.
        * **Images:**  Set longer cache times (e.g., 1 week or 1 month) for static images.
        * **CSS & JavaScript:** Shorter cache times (e.g., 1-3 days) due to more frequent updates.
        * **Fonts:** Even shorter cache times (e.g., 1-2 days) for font files.
    * **Geo-Filtering (Optional):** Limit CDN access to specific regions based on user demographics or legal requirements.
    * **SSL/TLS Configuration:** Ensure all CDN connections are secure using HTTPS.

**III. Asset Optimization:**

* **1. Image Optimization:**  This is often the biggest win for performance.
    * **Format:** Use WebP for superior compression and quality (modern browsers support it).  Fallback to JPEG for older browsers.  Consider AVIF for even better compression.
    * **Compression:** Utilize lossless and lossy compression techniques. Tools like TinyPNG, ImageOptim, or ShortPixel can automate this.
    * **Resizing:**  Serve images at the exact dimensions needed, avoiding oversized images that are scaled down.  Use responsive images with the `<picture>` element or `srcset` attribute to deliver different sizes based on screen size.
    * **Lazy Loading:** Implement lazy loading for images below the fold. This ensures images aren't loaded until they're visible to the user.
* **2. CSS & JavaScript Optimization:**
    * **Minification:** Remove unnecessary characters (whitespace, comments) from CSS and JavaScript files to reduce their size.
    * **Concatenation:** Combine multiple CSS and JavaScript files into fewer files to reduce the number of HTTP requests.  (Modern build tools often handle this automatically).
    * **Code Splitting:**  Break down large JavaScript bundles into smaller chunks that can be loaded on demand. This is crucial for Single Page Applications (SPAs).
    * **Tree Shaking:** Remove unused code from your JavaScript bundles.
* **3. Font Optimization:**
    * **Subset Fonts:**  Only include the characters you actually need in your font files to reduce their size.
    * **Use WOFF2:** WOFF2 is the most modern and efficient font format.
    * **Preload Fonts:**  Use the `<link rel="preload">` tag to preload critical fonts early in the page loading process.
* **4. HTML Minification:**
