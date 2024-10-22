#!/bin/bash
set -e
sudo unzip /tmp/webapp.zip -d /opt/csye6225/webapp/
sudo chown -R csye6225:csye6225 /opt/csye6225
cd /opt/csye6225/webapp
sudo -u csye6225 npm install --production
sudo mv /tmp/csye6225.service /etc/systemd/system/

echo "moved the csye6225 service file"

sudo systemctl daemon-reload
sudo systemctl enable csye6225.service