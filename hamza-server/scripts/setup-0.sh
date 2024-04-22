./scripts/import-currencies.sh
yarn up
yarn build
node ./scripts/init-search-api.js
medusa migrations run
yarn seed
yarn dev
