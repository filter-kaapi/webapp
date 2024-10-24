#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

# Unzip and set ownership
sudo unzip /tmp/webapp.zip -d /opt/csye6225/webapp/
sudo chown -R csye6225:csye6225 /opt/csye6225
cd /opt/csye6225/webapp

# Set HOME environment variable and run npm install
sudo npm install --omit=dev
sudo cp /opt/csye6225/webapp/.env /etc/csye6225.env

# Move the service file and enable it
sudo mv /tmp/csye6225.service /etc/systemd/system/

echo "Moved the csye6225 service file"

sudo systemctl daemon-reload
sudo systemctl enable csye6225.service
