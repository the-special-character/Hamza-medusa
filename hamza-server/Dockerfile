FROM node:18.0.0

WORKDIR /app

#RUN if [ -d "dist" ]; then rm -r dist; fi && \
#    if [ -d "build" ]; then rm -r build; fi && \
#    if [ -d ".cache" ]; then rm -r .cache; fi && \
#    if [ -d "node_modules" ]; then rm -r node_modules; fi

COPY package.json .
COPY yarn.lock .

RUN yarn

# Copy the rest of the application source files
COPY . .

# Assuming currency-data is within the Docker context, adjust the COPY commands
COPY currency-data/server/adminui-ui-src-utils/currencies.ts node_modules/@medusajs/admin-ui/ui/src/utils/
COPY currency-data/server/utils-dist-defaults/currencies.js node_modules/@medusajs/utils/dist/defaults/

# Build the application
RUN yarn build

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
