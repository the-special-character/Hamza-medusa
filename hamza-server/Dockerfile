FROM node:18.18.1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

COPY /currency-data/server/adminui-ui-src-utils/currencies.ts node_modules/@medusajs/admin-ui/ui/src/utils/
COPY /currency-data/server/utils-dist-defaults/currencies.js node_modules/@medusajs/utils/dist/defaults/

RUN yarn build

COPY ./scripts/docker-entrypoint.sh /
RUN chmod +x ./scripts/docker-entrypoint.sh
ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
