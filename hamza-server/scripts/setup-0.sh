./scripts/import-currencies.sh
yarn build
medusa migrations run
yarn seed
yarn dev
