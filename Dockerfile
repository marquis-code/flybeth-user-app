# ── Build Stage ──
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# The API origin is compiled into the client bundle. Provide it as a build arg
# when building, e.g. --build-arg VITE_BASE_URL=https://api.flybeth.com
ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}

RUN npm run build

# ── Production Stage ──
FROM node:22-alpine

WORKDIR /app

# Copy built output
COPY --from=builder /app/.output ./.output

# Nuxt 3/4 uses port 3000 by default in the output
EXPOSE 3000

ENV HOST=0.0.0.0
ENV NODE_ENV=production
# Do NOT hardcode PORT: the platform injects it. Nitro defaults to 3000.

CMD ["node", ".output/server/index.mjs"]
