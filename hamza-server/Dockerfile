FROM node:18.18.1

WORKDIR /app

 Now, remove unnecessary files or directories
RUN if [ -d "dist" ]; then rm -r dist; fi && \
    if [ -d "build" ]; then rm -r build; fi && \
    if [ -d ".cache" ]; then rm -r .cache; fi && \
    if [ -d "node_modules" ]; then rm -r node_modules; fi

# Copy package files and install dependencies first to leverage Docker cache
COPY .env medusa-config.js tsconfig.json datasource.js tsconfig.server.json package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application source files
COPY . .

# Assuming currency-data is within the Docker context, adjust the COPY commands
COPY currency-data/server/adminui-ui-src-utils/currencies.ts node_modules/@medusajs/admin-ui/ui/src/utils/
COPY currency-data/server/utils-dist-defaults/currencies.js node_modules/@medusajs/utils/dist/defaults/

# Build the application
RUN yarn build
RUN yarn medusa migrations run
RUN yarn seed-0

EXPOSE 9000

ENTRYPOINT ["yarn", "run", "dev"]
