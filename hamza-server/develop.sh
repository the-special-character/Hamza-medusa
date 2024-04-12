#!/bin/bash

sudo rm -r dist
sudo rm -r build
sudo rm -r .cache
sudo rm -r node_modules
sudo rm yarn.lock
sudo rm package-lock.json

medusa migrations run

medusa $1