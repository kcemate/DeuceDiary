# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npm rebuild sharp

# ---- builder ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm rebuild sharp

# Built assets
COPY --from=builder /app/dist ./dist

# Uploads persist via volume
RUN mkdir -p dist/public/uploads
VOLUME ["/app/dist/public/uploads"]

EXPOSE ${PORT:-10000}
CMD ["node", "dist/index.js"]
