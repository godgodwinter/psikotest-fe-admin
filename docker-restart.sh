#!/bin/bash

# Menjalankan docker-compose down
docker-compose down

# Menjalankan docker-compose build
docker-compose build

# Menjalankan docker-compose up dalam mode detached (-d)
docker-compose up -d
