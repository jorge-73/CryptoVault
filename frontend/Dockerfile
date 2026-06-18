FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY next.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./
COPY public/ ./public/
COPY src/ ./src/

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
