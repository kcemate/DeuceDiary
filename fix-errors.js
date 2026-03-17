const fs = require('fs');
let content = fs.readFileSync('server/routes.ts', 'utf8');

// Fix 503s
content = content.replace(/res\.status\(503\)\.json\([^}]+\}\);/g, 'Errors.internal(res, "Service degraded");');

// Fix theme validation
content = content.replace(/return res\.status\(400\)\.json\(\{ message: `Invalid theme\. Must be one of: \$\{VALID_THEMES\.join\(\', \'\)\}` \}\);/, 'return Errors.badRequest(res, `Invalid theme. Must be one of: ${VALID_THEMES.join(", ")}`);');

// Fix remaining 403 and 400
content = content.replace(/return res\.status\(403\)\.json\(\{ message: `Not authorized for group \$\{gid\}` \}\);/, 'return Errors.forbidden(res, `Not authorized for group ${gid}`);');
content = content.replace(/return res\.status\(400\)\.json\(\{ message: `Maximum of \$\{MAX_PUSH_TOKENS_PER_USER\} devices reached` \}\);/, 'return Errors.badRequest(res, `Maximum of ${MAX_PUSH_TOKENS_PER_USER} devices reached`);');

fs.writeFileSync('server/routes.ts', content);
