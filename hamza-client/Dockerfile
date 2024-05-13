FROM node:18.18.1

RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

COPY ./scripts/docker-entry.sh /
RUN chmod +x ./scripts/docker-entry.sh
ENTRYPOINT ["/bin/sh", "/docker-entry.sh"]
