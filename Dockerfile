# Stage 1: Build the frontend
FROM node:22-alpine AS builder

WORKDIR /app

COPY frontend/package.json ./
RUN npm install

COPY frontend/ .

ARG API_KEY
ARG GOOGLE_CLOUD_PROJECT
ARG GOOGLE_CLOUD_LOCATION=us-central1

ENV API_KEY=$API_KEY
ENV GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT
ENV GOOGLE_CLOUD_LOCATION=$GOOGLE_CLOUD_LOCATION

RUN npm run build

# Stage 2: Final image with nginx + Node backend
FROM node:22-alpine

# Install nginx
RUN apk add --no-cache nginx

WORKDIR /app

# Install backend production dependencies
COPY backend/package.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source
COPY backend/server.js ./backend/

# Copy built frontend into nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (serves frontend on 8080, proxies /api-proxy to port 5000)
COPY frontend/nginx.conf /etc/nginx/http.d/default.conf

# Copy startup script
COPY start.sh ./
RUN chmod +x ./start.sh

EXPOSE 8080

CMD ["./start.sh"]
