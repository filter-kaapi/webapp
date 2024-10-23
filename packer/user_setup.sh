#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive
export CHECKPOINT_DISABLE=1

# Create user and group
sudo groupadd csye6225 || true
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225 || true

# Setup application directory
sudo mkdir -p /opt/csye6225/webapp
sudo chown -R csye6225:csye6225 /opt/csye6225