#!/bin/bash
set -e

# Update package list
echo "Updating packages..."
sudo apt-get update -y

# Install unzip (if required)
echo "Installing unzip..."
sudo apt-get install -y unzip

# Install the CloudWatch Agent
echo "Installing CloudWatch Agent..."
wget -O /tmp/amazon-cloudwatch-agent.deb https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i /tmp/amazon-cloudwatch-agent.deb
sudo rm /tmp/amazon-cloudwatch-agent.deb

# Ensure the CloudWatch configuration directory exists and set permissions
echo "Setting up CloudWatch configuration directory..."
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc
sudo chown csye6225:csye6225 /opt/aws/amazon-cloudwatch-agent/etc
sudo chown csye6225:csye6225 /var/log/syslog 
sudo chmod 640 /var/log/syslog 

echo "CloudWatch Agent setup complete. Agent is not started."
