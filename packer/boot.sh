#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

sudo mkdir -p /opt/csye6225/webapp
sudo chown -R csye6225:csye6225 /opt/csye6225


# Extract webapp
cd /tmp
sudo unzip /webapp.zip -d /opt/csye6225/webapp/
sudo chown -R csye6225:csye6225 /opt/csye6225

# Install dependencies
cd /opt/csye6225/webapp
sudo -u csye6225 npm install --omit=dev --no-fund --no-audit

# Setup service
sudo mv /tmp/csye6225.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable csye6225.service