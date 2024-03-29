FROM node:18 AS setup
WORKDIR /homeflix
COPY . .

FROM node:18 AS builder
WORKDIR /homeflix

COPY .gitignore .gitignore
COPY --from=setup /homeflix/ . 
RUN npm i
RUN npm run build:server

FROM node:18 AS runner
WORKDIR /homeflix
COPY --from=builder /homeflix .
CMD node apps/server/dist/apps/server/src/index.js
EXPOSE 8080
