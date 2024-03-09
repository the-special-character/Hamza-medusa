
### Setup Quick Start

1. Clone this Repository
2. Create the .env files 
3. Install Packages with yarn
4. Install the Medusa CLI
5. Set up the Database
6. Run medusa seed & migrations
7. Run the Server
8. Run the Client


**1. Clone this Repository**


**2. Create the .env file in both the project root, and in ./hamza-server**
./hamza-server/.env
./hamza-client/.env.local


See .env.example. 

**3. Install Packages with yarn**


```
cd ./hamza-server
yarn install
cd ../hamza-client
yarn install 
```


**4. Install the Medusa CLI**

```
yarn global add @medusajs/medusa-cli
```


**5. Set up the Database**

Either do it by docker, or install postgresql manually on your local environment, and create an empty database call "hamza_dev_db". 

If doing it by docker, in the root of the repo: 
(sudo is optional depending on your setup) 

```
sudo docker-compose up -d
```


**6. Run medusa seed & migrations** 

```
cd ./hamza-server
npx medusa seed --seed-file=data/seed.json 
npx medusa migrations run
```


**7. Run the Server** 

```
cd ./hamza-server
yarn dev
```


**8. Run the Client** 

```
cd ./hamza-client
yarn dev
```


## Notes

To setup the project I went through the following guide: https://docs.medusajs.com/create-medusa-app

Running: `npx create-medusa-app@latest`
Automatically created thepostgres database and the admin user through the cli

I've sent the environment variable files in our discord group chat and they're pinned
make sure when you copy them over to have a . at the beginning of the file name as it doesn't save it as a .env and .env.local file in discord


### Project Structure

**Backend**: hamza-server/

Environment Variable: _.env_



**Frontend**: /hamza-client    

Environments Variable: _env.local_   

### INSTALLING PACKAGES
Run `yarn install` in both folders to install the packages

`DATABASE_URL=postgres://postgres@localhost/hamza_dev_db`

**You'll either have to name your dB the same or modify in your .env file**


[Medusa CLI Documentation:](https://docs.medusajs.com/cli/reference) 

I'm using **postgres v16**

### Create a [PostgresDB](https://docs.medusajs.com/development/backend/configurations#database_database)
You need to have postgres running for this setup, either locally or in the docker (or a docker)

in the /hamza-server folder:
Create an admin user: (Should exist already by default)
`npx medusa user --email admin@medusa-test.com --password supersecret
`

For Postgres database we can create entities in load-pipe/src/models
[Medusa uses TypeORM ](https://docs.medusajs.com/development/entities/overview)and adding entities to this folder will automatically register them in the database


### Payment Architecture:
E-commerce.pdf in root of repo has a diagram of the [payment architecture](https://docs.medusajs.com/modules/carts-and-checkout/payment)


### ADDING CURRENCIES TO THE DATABASE
[Currencies](https://docs.medusajs.com/modules/regions-and-currencies/currencies) are defined in the core of Medusa backend under: `node_modules/@medusajs/medusa/src/utils/currencies.ts`

When we run `migrations` or `seed` command, a migration uses this object to insert the currencies into the database

If we want to add more currencies, we can create a migration that inserts currencies into the database

### MIGRATIONS Adding ETH Currency Example
Manual Migration: https://docs.medusajs.com/development/entities/migrations/create
1. Create a migration file in the migrations folder
`npx typeorm migration:create src/migrations/CurrencyCreate` 
2. This created the CurrencyCreate file in load-pipe/src/migrations/{rand_numbs}-CurrencyCreate.ts
3. After manual migration is created, we can run `npm run build`
4. Then run `npx medusa migrations run` to run the migration
5. If we check the database this created the new currency in the database
*** If you made a mistake and want to REVERT, given you have written the down method 🎩
6. Run `npx medusa migrations revert` to revert the migration


