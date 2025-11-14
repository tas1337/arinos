# Multi-stage build for production
# Build context should be from project root
FROM node:18-alpine AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./

FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build -- --configuration production

# Production image
FROM node:18-alpine

# Install fontconfig for sharp text rendering
RUN apk add --no-cache fontconfig ttf-dejavu

WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend ./backend

# Copy frontend build - handle both browser subdir and direct output
RUN mkdir -p backend/public
# Use mount to check and copy conditionally
RUN --mount=from=frontend-build,source=/app/frontend/dist/stego-frontend,target=/tmp/dist \
    if [ -d /tmp/dist/browser ]; then \
      cp -r /tmp/dist/browser/* ./backend/public/; \
    else \
      cp -r /tmp/dist/* ./backend/public/; \
    fi

RUN mkdir -p backend/uploads

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.js"]
