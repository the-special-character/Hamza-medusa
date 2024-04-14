FROM node:18.18.1

# Set the working directory for all subsequent commands
WORKDIR /app

# Copy the package.json and yarn lock files to the working directory
COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

# Copy all files in the current directory (.) to the working directory in the container
COPY docker-entry.sh /
RUN chmod +x /docker-entry.sh
ENTRYPOINT ["/bin/sh", "/docker-entry.sh"]
