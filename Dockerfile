# ── Build Stage ──
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Production Stage ──
FROM node:22-alpine

WORKDIR /app

# Copy built output
COPY --from=builder /app/.output ./.output

# Nuxt 3/4 uses port 3000 by default in the output
EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
