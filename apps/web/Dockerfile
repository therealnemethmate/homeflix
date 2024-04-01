# BUILD PROJECT
FROM node:18-alpine AS build

WORKDIR /homeflix

COPY . .

RUN npm i
RUN npm run build

# BUILD SERVER
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *

COPY --from=build /homeflix/dist .
COPY ./.docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
