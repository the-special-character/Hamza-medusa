#!/bin/bash
echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 5
done
echo "PostgreSQL started"

# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 5
done
echo "Redis is ready."

npx medusa migrations run

yarn seed-0

yarn dev