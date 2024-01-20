To setup the project I went through the following guide: https://docs.medusajs.com/create-medusa-app

I've sent the environment variable files in the discord


**Backend**: medusa-v1/load-pipe
Backend Environments are in: _.env_


**Frontend**: medusa-v1/load-pipe-storefront    
Frontend Environments are in: _env.local_   

I've used NPM to install the packages
Run `npm install` in both folders to install the packages

Running: `npx create-medusa-app@latest`
Running this command automatically created the postgres database and the admin user through the cli

`DATABASE_URL=postgres://postgres@localhost/medusa-NvEk`


[Medusa CLI Documentation:](https://docs.medusajs.com/cli/reference) 

I'm using **postgres v16**

To manually go through this steps:

Install the medusa cli: `npm install @medusajs/medusa-cli -g`

Create a PostgresDB

Create an admin user: `medusa user --email <email> [--password <password>]`

For Postgres database we can create entities in load-pipe/src/models
[Medusa uses TypeORM ](https://docs.medusajs.com/development/entities/overview)and adding entities to this folder will automatically register them in the database

