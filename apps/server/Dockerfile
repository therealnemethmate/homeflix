FROM node:18 AS builder
# Set working directory
WORKDIR /app
COPY . .

FROM node:18 AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/ .
RUN npm i

# Build the project
RUN npm run build:server

FROM node:18 AS runner
WORKDIR /app

COPY --from=installer /app .
CMD node apps/server/dist/index.js
