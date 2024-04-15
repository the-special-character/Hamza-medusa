#./import-currencies.sh
#yarn build
medusa migrations run
medusa seed --seed-file=data/seed-0.json
yarn dev
