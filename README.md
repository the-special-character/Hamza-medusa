<img src="branding/hamza.png" height="70"/>    
<img src="branding/LoadPipeGray.png" height="50"/>

[![website](https://img.shields.io/badge/website-blue '')](https://hamza.biz) [![website](https://img.shields.io/badge/dev_site-red '')](https://hamza.biz) [![ethglobal](https://img.shields.io/badge/eth-london-green '')](https://ethglobal.com/showcase/hamza-u5dm7) 

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

Either do it by docker, or install postgresql manually on your local environment, and create an empty database called "hamza_dev_db". 

If doing it by docker, in the root of the repo: 
(sudo is optional depending on your setup) 

***5a. Use Docker (recommended)***

```
sudo docker-compose up -d
```

***5b. Manual Setup (optional)***

Install and run postgresql locally, and and redis locally. Optionally, you can omit redis, but also comment out the redis lines in /hamza-server/medusa-config.js
```
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

#create the database
sudo -u postgres psql
postgres=# create database hamza_dev_db;
postgres=# \c hamza_dev_db
hamza_dev_db=# ALTER USER postgres WITH PASSWORD 'postgres'
```

Install Redis: 
```
sudo apt update
sudo apt install redis 
```

**6. Seed the data** 

```
cd ./hamza-server
./import-currencies.sh
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
./import-currencies.sh
cd ./hamza-client
yarn dev
```


**9. Fresh Reset**
Backend: 
```
1. Remove the node_modules folder
2. Remove the dist folder
3. Remove the build folder
4. Remove the .cache folder
5. Remove yarn.lock
6. docker-compose down
7. docker volume rm <db_volume>
8. docker-compose up -d
9. yarn install
10. npx medusa migrations run
11. npx medusa seed --seed-file=data/seed.json
12. yarn build
13. yarn dev
```


## Notes

To set up from scratch:
https://docs.medusajs.com/create-medusa-app
Run: `npx create-medusa-app@latest`
Automatically created thepostgres database and the admin user through the cli


### Project Structure

**Backend**: hamza-server/
Environment Variable: _.env_

**Frontend**: /hamza-client    
Environments Variable: _env.local_   

For Postgres database we can create entities in load-pipe/src/models
[Medusa uses TypeORM ](https://docs.medusajs.com/development/entities/overview) ... adding entities to this folder will automatically register them in the database.

### Payment Architecture:
[E-commerce.pdf](/E-commerce.pdf) in root of repo has a diagram of the [payment architecture](https://docs.medusajs.com/modules/carts-and-checkout/payment)

