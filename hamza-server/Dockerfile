# Use an official Node.js 18 image
FROM node:18.18.1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and other necessary configuration files
COPY package.json .
COPY yarn.lock .
COPY medusa-config.js .
COPY datasource.js .

# Install dependencies
RUN yarn install

# Copy the entire project
COPY . .

# Special copies for specific paths in node_modules, if necessary
COPY /currency-data/server/adminui-ui-src-utils/currencies.ts node_modules/@medusajs/admin-ui/ui/src/utils/
COPY /currency-data/server/utils-dist-defaults/currencies.js node_modules/@medusajs/utils/dist/defaults/

# Build the project
RUN yarn build

# Copy the Docker entrypoint script and make it executable
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Set the Docker container's entrypoint
ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
