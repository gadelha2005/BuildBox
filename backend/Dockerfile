
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build
RUN mkdir -p dist/docs && cp src/docs/openapi.yaml dist/docs/openapi.yaml


FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]