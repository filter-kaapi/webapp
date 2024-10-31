#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive
export CHECKPOINT_DISABLE=1

echo "Setting up"
sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing Node and npm"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs


# echo "Installing postgres"
# sudo apt install -y postgresql postgresql-contrib
# sudo systemctl enable postgresql
# sudo systemctl start postgresql

# until sudo systemctl is-active --quiet postgresql; do
#   echo "Waiting for PostgreSQL to start..."
#   sleep 5
# done

# sudo -u postgres psql <<EOF
# CREATE DATABASE ${DB_NAME};
# CREATE USER ${DB_USER} WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';
# GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
# EOF


echo "Installing unzip"
sudo apt install -y unzip

echo "Installation completed."