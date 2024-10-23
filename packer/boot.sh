#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

# Ensure npm cache directory has proper permissions
sudo mkdir -p /tmp/.npm-cache
sudo chown -R csye6225:csye6225 /tmp/.npm-cache
sudo -u csye6225 npm config set cache /tmp/.npm-cache --global

sudo unzip /tmp/webapp.zip -d /opt/csye6225/webapp/
sudo chown -R csye6225:csye6225 /opt/csye6225
cd /opt/csye6225/webapp

# Run npm install with the correct user
sudo -u csye6225 npm install

sudo mv /tmp/csye6225.service /etc/systemd/system/

echo "Moved the csye6225 service file"

sudo systemctl daemon-reload
sudo systemctl enable csye6225.service
