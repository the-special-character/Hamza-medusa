# Hamza Server 

### Setup Quick Start

- yarn install 
- ./import-currencies.sh (note: must be run before build, and before migrations, but definitely after yarn install)
- yarn build
- medusa migrations run 
- medusa seed --seed-file=data/seed-0.json
- api shenanigans here 
- medusa seed --seed-file=data/seed-1.json
- yarn dev
