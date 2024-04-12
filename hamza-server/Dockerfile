FROM node:18.18.1

WORKDIR /app

COPY .env medusa-config.js package.json yarn.lock ./

RUN apt-get update

RUN if [ -d "node_modules" ]; then rm -rf node_modules; fi


RUN yarn install

RUN cp ../currency-data/server/adminui-ui-src-utils/currencies.ts ./node_modules/@medusajs/admin-ui/ui/src/utils/
RUN cp ../currency-data/server/utils-dist-defaults/currencies.js ./node_modules/@medusajs/utils/dist/defaults/

RUN yarn build
RUN npx medusa migrations run
RUN yarn seed-0

COPY . .

EXPOSE 9000

ENTRYPOINT ["yarn", "run", "dev"]
