# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-03T20:19:53.999479

## CDN and Asset Optimization Plan

This plan outlines a strategy to improve website performance by leveraging a Content Delivery Network (CDN) and optimizing all assets (images, CSS, JavaScript) for speed and efficiency.

**I. Goals & Objectives:**

* **Reduce Page Load Time:**  Improve overall website speed, aiming for under 3 seconds.
* **Improve User Experience:**  Faster loading times lead to increased engagement, lower bounce rates, and better user satisfaction.
* **Reduce Server Load:** Offload static content delivery to the CDN, freeing up server resources.
* **Improve SEO:** Faster website speed is a ranking factor in Google's algorithm.
* **Increased Global Reach:** Ensure a consistent, fast experience for users regardless of their location.

**II. CDN Implementation:**

* **CDN Provider Selection:**  Choose a CDN based on your budget, features, and global coverage. Popular options include:
    * **Cloudflare:** Highly recommended for beginners – free tier available, excellent performance, and easy setup.
    * **Amazon CloudFront:** Scalable and integrates well with AWS services.
    * **Akamai:** Enterprise-level CDN with advanced features and global presence.
    * **Google Cloud CDN:**  Leverages Google’s global network and integrates with Google Cloud Platform.
* **CDN Setup & Configuration:**
    * **Domain Name Configuration:** Point your website's domain to the CDN's DNS servers.
    * **Origin Server Configuration:**  Specify your website's origin server (where your website files reside) within the CDN.
    * **Caching Rules:** Configure caching rules to determine how long files are stored on the CDN's edge servers.  This will depend on your content's update frequency.
    * **Protocol Support:** Ensure the CDN supports HTTP/2 and ideally HTTP/3 for faster transfer speeds.
    * **SSL/TLS Configuration:**  Implement secure connections using HTTPS.

**III. Asset Optimization:**

* **Image Optimization:**
    * **Compression:**  Use tools like ImageOptim, TinyPNG, or ShortPixel to compress images without significant quality loss. Experiment with different compression levels to find the optimal balance.
    * **Format Selection:**  Use WebP for modern browsers (superior compression and quality) and JPEG for older browsers.  Consider AVIF for even better compression, but browser support is still evolving.
    * **Responsive Images:**  Serve different image sizes based on the user's device and screen size using the `<picture>` element or the `srcset` attribute in `<img>` tags.
    * **Lazy Loading:** Implement lazy loading for images below the fold (images that aren't immediately visible) to improve initial page load time.
* **CSS & JavaScript Optimization:**
    * **Minification:** Remove unnecessary characters (whitespace, comments) from CSS and JavaScript files to reduce their size.
    * **Concatenation:** Combine multiple CSS and JavaScript files into fewer files to reduce the number of HTTP requests. Be mindful of potential caching issues.
    * **Code Splitting:**  Divide large JavaScript bundles into smaller chunks that are loaded on demand, only when needed (especially beneficial for single-page applications).
    * **Remove Unused Code:** Identify and remove unused CSS and JavaScript code. Tools like PurifyCSS or UnCSS can help.
* **Font Optimization:**
    * **Use Web Fonts Sparingly:**  Web fonts can significantly impact performance. Limit the number of web fonts used.
    * **Font Subsetting:**  Only include the characters you actually use in your font files.
    * **Font Formats:** Use WOFF2, which provides the best compression and browser support.
* **HTML Optimization:**
    * **Minification:** Minify your HTML files.
    * **Clean Code:** Ensure your HTML code
