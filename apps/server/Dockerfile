FROM node:18 AS setup
WORKDIR /app
COPY . .

FROM node:18 AS builder
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=setup /app/ .
RUN npm i
RUN npm run build:server

FROM node:18 AS runner
WORKDIR /app
COPY --from=builder /app/dist .
CMD node apps/server/src/index.js
EXPOSE 3001
