#!/bin/bash

echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 0.1
done
echo "Redis is ready."

while ! nc -z localhost 9000; do
  echo "Waiting for port 9000 to be available..."
  sleep 1 # wait for 1 second before check again
done

echo "Port 9000 is now available."



yarn build
yarn dev