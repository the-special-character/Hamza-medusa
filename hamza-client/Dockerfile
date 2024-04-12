# Set the base image to Node 18-alpine3.18
FROM node:18-alpine3.18

# Set the working directory for all subsequent commands
WORKDIR /app/storefront

# Copy the package.json and yarn lock files to the working directory
COPY .env.local package.json yarn.lock ./

# Run the apk update command to update package information
RUN apk update

# Install the dependencies
RUN yarn install

# Copy all files in the current directory (.) to the working directory in the container
COPY . .

# Set the default command to run the application in development mode
ENTRYPOINT ["yarn", "run", "dev"]
