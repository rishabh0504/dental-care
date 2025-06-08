# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install deps (includes Next.js)
RUN pnpm install --frozen-lockfile

# Copy rest of the code
COPY . .

# Build Next.js app
RUN pnpm build

# -------------------------------
# Stage 2: Run in production
# -------------------------------
FROM node:20-alpine AS runner

# Install libc for Node compatibility
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy build output and runtime deps from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/node_modules ./node_modules

# Expose Next.js default port
EXPOSE 3000

# Start the app using Node
CMD ["node", "node_modules/next/dist/bin/next", "start"]
