# Build Stage for Next.js Application
FROM node:21-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Builder Stage
FROM node:21-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build args for Next.js
ARG NEXT_PUBLIC_APP_API_URL
ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ENV NEXT_PUBLIC_APP_API_URL=$NEXT_PUBLIC_APP_API_URL
ENV NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=$NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

# Build without turbopack for production
RUN npm run build

# Production Stage
FROM node:21-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files for standalone output
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]