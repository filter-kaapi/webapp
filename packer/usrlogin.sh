#!/bin/bash
echo "$(pwd)"

export DEBIAN_FRONTEND="noninteractive"
export CHECKPOINT_DISABLE=1

directory="/opt/csye6225"

# Check if directory exists, if not, create it
if [ ! -d "$directory" ]; then
    sudo mkdir -p "$directory"
fi

# Change ownership and permissions
sudo groupadd -f csye6225

# Create user with home directory
sudo useradd -m -d /home/csye6225 -s /usr/sbin/nologin -g csye6225 csye6225

sudo chown -R csye6225:csye6225 "$directory"
