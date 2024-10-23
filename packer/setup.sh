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

echo "Installing postgres"
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

echo "Installing unzip"
sudo apt install -y unzip

echo "Installation completed."