# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY family-tree-ui/package*.json ./
RUN npm ci
COPY family-tree-ui/ .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
# Install TypeScript for runtime
RUN npm install typescript
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
EXPOSE 3001
CMD ["npx", "next", "start", "-p", "3001"]
