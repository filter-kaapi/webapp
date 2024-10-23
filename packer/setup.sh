#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

echo "Setting up"
sleep 30

sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing Node and npm"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Installing postgres"
sudo apt install -y postgresql postgresql-contrib

echo "Running postgres"
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create user csye6225 early to avoid issues
sudo groupadd csye6225
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225
sudo mkdir -p /opt/csye6225
sudo chown -R csye6225:csye6225 /opt/csye6225


echo "Installing unzip"
sudo apt install -y unzip

# sudo mv /tmp/webapp/ -d /opt/csye6225/
echo "Installation completed."
