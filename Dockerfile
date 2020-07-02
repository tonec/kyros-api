# ---------- Base ----------
FROM node:10-slim AS base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# ---------- Builder ----------
# Creates:
# - node_modules: production dependencies (no dev dependencies)
# - dist: A production build compiled with Babel
FROM base AS builder

COPY package*.json .babelrc ./

USER node

RUN npm install

COPY ./src ./src

RUN npm run build

# RUN npm prune --production # Remove dev dependencies

# ---------- Release ----------
FROM base AS release

COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist

# COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
