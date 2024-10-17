#!/bin/bash

echo "Setting up"
sleep 30

sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing Node and npm"
sudo apt install -y nodejs npm

echo "Installing postgres"
sudo apt install -y postgresql postgresql-contrib

echo "Running postgres"
sudo systemctl enable postgresql
sudo systemctl start postgresql

echo "Installing unzip"
sudo apt install -y unzip

sudo mkdir -p /opt/csye6225
# sudo mv /tmp/webapp/ -d /opt/csye6225/
echo "Installation completed."
