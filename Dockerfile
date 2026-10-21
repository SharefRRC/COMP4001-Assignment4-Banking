# Compile native SQLite/bcrypt dependencies separately from the runtime.
FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json package-lock.json server.js ./
COPY --chown=node:node Public/ ./Public/
COPY --chown=node:node database/ ./database/
RUN chown node:node /app
USER node
EXPOSE 5090
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=6 CMD node -e "require('http').get('http://127.0.0.1:5090/',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "server.js"]
