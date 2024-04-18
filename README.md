<img src="branding/hamza.png" height="70"/>    
<img src="branding/LoadPipeGray.png" height="50"/>

[![website](https://img.shields.io/badge/website-blue)](https://hamza.biz) [![website](https://img.shields.io/badge/dev_site-red)](https://hamza.biz) [![ethglobal](https://img.shields.io/badge/eth-london-green)](https://ethglobal.com/showcase/hamza-u5dm7)

### Setup Quick Start

1. Clone this Repository
2. Create the .env files
3. Install Packages with yarn
4. Install the Medusa CLI
5. Set up the Database
6. Run medusa seed & migrations
7. Run the Server
8. Run the Client



### Meilisearch 
I have added Meilisearch to the docker-compose.yml, so it should just be the same command
**(recommended)**
1. docker-compose up -d 
2. Obtain API Key w/ curl request: (Master_Key is in the docker-compose.yml MeiliSearch section)
`curl -X GET 'http://localhost:7700/keys' \
   -H 'Authorization: Bearer MASTER_KEY'`
**This has also been added to the POSTMAN collection as a GET request, so you can use that as well.**
3. Add the Default Admin API Key to the .env `MEILISEARCH_API_KEY=Default_Admin_API_Key``` 
4. http://localhost:7700 Now the Meiliesearch should be working
5. Copy & Paste the last three env variables from .env.local.example to the .env.local file
6. Add `Default_Admin_API_Key` to .env.local 

**However if you want to download it locally;** 
1. curl -L https://install.meilisearch.com | sh
2. ./meilisearch --master-key=key 


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

Setting up the DB without docker is no longer recommended, as the docker is doing more than just running the DB now.


```
sudo docker-compose up -d
```


**6. Set up and Run the Server**

```
cd ./hamza-server
yarn setup-0
# WAIT for the server to start listening on port 9000
yarn setup-1
# at this point, you can shut the server down if you wish
```

**7. Just Run the Server (if not already running) **

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

**9. Other Helpful Scripts**
Backend:

```
yarn clean
yarn deepclean
yarn softclean
yarn nuke
```

### Docker Cheat Sheet (WIP) - G
**We can either do `docker-compose` or `docker compose` (the `-` is optional)**
1. docker compose up -d

**This is nice to clean up everything, but be careful, it will remove all volumes and images)**
2. docker compose down --volumes --rmi all

**Find all running containers**
3. docker ps

**Show container logs**
4. docker logs <container-name>


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
