#!/bin/bash

echo "stopping existing containers..."
docker-compose -f docker-compose.debug.yml down --remove-orphans

echo "building and starting containers in background..."
docker-compose -f docker-compose.debug.yml up --build -d

echo "Waiting for test container to be ready..."
# while ! docker-compose -f docker-compose.debug.yml logs test 2>&1 | grep -q "Waiting for client"; do
#   docker-compose docker-compose.debug.yml logs test
#   sleep 1
# done
sleep 2

echo "Attaching to logs..."
docker-compose -f docker-compose.debug.yml logs -f &
