NodeJS reverse HTTP Proxy on Docker
==========

This repo contains a Dockerfile to build a very simple reverse proxy with basic authentication, that links to Zeppelin containers run using a [Docker Zeppelin image](https://github.com/alghimo/docker-zeppelin).

## Building the image
```
docker build -t alghimo/docker-httpproxy:latest .
```

## Running the image
*Important*: If you are on Windows:
- Increase the memory of the VM that your docker is using. By default, the compose will create 3 different Zeppelin instances, so you would need at leastg 8GB of RAM.
- Enable port forwarding (port 8080 on the proxy server).

```
docker-compose --project-name=zeppelin up --force-recreate
```
or
```
docker-compose --project-name=zeppelin up --force-recreate -d
```

## Testing

Once running (it might take a while until all of the zeppelin containers are up and running), just browse to http://localhost:8080/{instance}.

Out of the box, these are the projects that are included:

http://localhost:8080/datasci
http://localhost:8080/reporting
http://localhost:8080/public

You can add / remove instances by changing the "server/instances.json" file and rebuilding the image.
