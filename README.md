To setup the project I went through the following guide: https://docs.medusajs.com/create-medusa-app

I've sent the environment variable files in the discord


**Backend**: medusa-v1/load-pipe
Backend Environments are in: _.env_


**Frontend**: medusa-v1/load-pipe-storefront    
Frontend Environments are in: _env.local_   

I've used NPM to install the packages
Run `npm install` in both folders to install the packages

Running: `npx create-medusa-app@latest`
Running this command automatically created thepostgres database and the admin user through the cli

`DATABASE_URL=postgres://postgres@localhost/medusa-NvEk`


[Medusa CLI Documentation:](https://docs.medusajs.com/cli/reference) 

I'm using **postgres v16**

To manually go through this steps:

Install the medusa cli: `npm install @medusajs/medusa-cli -g`

Create a PostgresDB

in the /load-pipe folder:
Create an admin user:
`npx medusa user --email admin@medusa-test.com --password supersecret
`

For Postgres database we can create entities in load-pipe/src/models
[Medusa uses TypeORM ](https://docs.medusajs.com/development/entities/overview)and adding entities to this folder will automatically register them in the database

[Currencies](https://docs.medusajs.com/modules/regions-and-currencies/currencies) are defined in the core of Medusa backend under: node_modules/@medusajs/medusa/src....

When we run `migrations` or `seed` command, a migration uses this object to insert the currencies into the database

If we want to add more currencies, we can create a migration that inserts currencies into the database