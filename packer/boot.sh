#!/bin/bash

sudo mv /tmp/csye6225.service /etc/systemd/system/

echo "moved the csye6225 service file"

sudo systemctl daemon-reload
sudo systemctl enable csye6225.service