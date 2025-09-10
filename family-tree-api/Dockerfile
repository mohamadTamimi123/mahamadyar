# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY family-tree-api/package*.json ./
RUN npm ci
COPY family-tree-api/ .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/main.js"]
