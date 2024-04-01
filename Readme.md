# homeflix-server

A monorepo based server application which provides API to fetch, parse and download torrents from ncore.cc

## How to run

### Set environmental variables on your host

```bash
export HOMEFLIX_SECRET="string"
export HOMEFLIX_SALT="string"
export HOMEFLIX_SERVER_HOST="string url / ip"
export HOMEFLIX_SERVER_PORT="8080"
export HOMEFLIX_WEB_PORT="5173"
```

### Enable ports to reach them locally:

```bash
sudo ufw allow ${HOMEFLIX_SERVER_PORT}/tcp
sudo ufw allow ${HOMEFLIX_WEB_PORT}/tcp
```

### Start docker containers

```bash
docker compose up -d
```
