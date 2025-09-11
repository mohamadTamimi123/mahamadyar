# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:5002
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
# Install TypeScript for runtime
RUN npm install typescript
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
# Copy TypeScript config if exists
COPY --from=builder /app/tsconfig.json ./tsconfig.json 2>/dev/null || true
EXPOSE 3001
CMD ["npx", "next", "start", "-p", "3001"]
