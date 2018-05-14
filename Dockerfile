#FROM nginx
FROM node

MAINTAINER sean<'cnxiaolin@126.com'>

#RUN apt-get update \
#    && apt-get install -y curl \
#    && rm -rf /var/lib/apt/lists/*
#CMD [ "curl", "-s", "http://ip.cn" ]

#ENV VERSION=1.0 DEBUG=on

#RUN cd /root
#RUN echo $VERSION/$DEBUG  > test.txt
#RUN echo $VERSION
#WORKDIR  /root
#RUN echo $VERSION/$DEBUG  > test.txt

#RUN useradd -ms /bin/bash newuser
#USER newuser
#WORKDIR /home/newuser
#EXPOSE 8081

RUN npm install -g pm2
#RUN pm2 dump

RUN mkdir /root/webApp
WORKDIR /root/webApp
RUN mkdir /root/webApp/mock
WORKDIR /root/webApp/mock

COPY ./bin ./bin
COPY ./config ./config
COPY ./node_modules ./node_modules
COPY ./public ./public
COPY ./package.json ./
COPY ./.babelrc ./
COPY ./.env ./
COPY ./dist ./dist
COPY ./server.json ./
COPY ./src ./src

#EXPOSE 8081
#RUN [ "npm", "run", "compile" ]
#CMD [ "pm2", "start", "./server.json","--no-daemon" ]
#CMD [ "pm2-docker", "start", "./server.json","--no-daemon" ]
#CMD pm2 start --no-daemon  server.json
CMD ["npm","start"]


