#!/bin/bash
echo "$(pwd)"

export DEBIAN_FRONTEND="noninteractive"
export CHECKPOINT_DISABLE=1

directory="/opt/csye6225"

# Check if directory exists, if not, create it
if [ ! -d "$directory" ]; then
    sudo mkdir -p "$directory"
fi

if [ "$(ls -A $directory)" ]; then
    sudo chown -R csye6225:csye6225 "$directory"/*
else
    echo "No files in $directory to change ownership."
fi

# Change ownership and permissions
sudo groupadd csye6225
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225
sudo chown -R csye6225:csye6225 "$directory"/*