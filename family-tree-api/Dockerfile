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
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=secure_password_123
ENV DB_DATABASE=family_tree
ENV JWT_SECRET=super_secret_jwt_key_2024
ENV JWT_EXPIRES_IN=24h
ENV SMTP_HOST=mailhog
ENV SMTP_PORT=1025
ENV SMTP_USER=
ENV SMTP_PASS=
ENV EMAIL_FROM=noreply@familytree.com
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/main.js"]
