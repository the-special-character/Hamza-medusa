#!/bin/bash
#echo "Waiting for postgres..."
#while ! nc -z postgres 5432; do
#  sleep 0.1
#done
#echo "PostgreSQL started"
#
## Wait for Redis to be ready
#echo "Waiting for Redis..."
#until [ "$(redis-cli -h cache ping)" == "PONG" ]; do
#  sleep 1
#done
#echo "Redis is ready."

npx medusa migrations run

#yarn seed-0

yarn start