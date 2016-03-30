FROM centos:latest
MAINTAINER Albert Giménez <albert.gimenez.morales@gmail.com>

RUN curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
RUN yum install -y nodejs

RUN mkdir /server
WORKDIR /server
COPY server/package.json /server/package.json
RUN npm install

COPY server/instances.json /server/instances.json
COPY server/server.js /server/server.js

ENTRYPOINT ["node", "/server/server.js"]
