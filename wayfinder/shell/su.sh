#!/usr/bin/env bash
sudo su
apt-get update && apt-get install curl apt-transport-https -y
curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
echo 'deb https://deb.nodesource.com/node_0.10 utopic main' > /etc/apt/sources.list.d/nodesource.list
echo 'deb-src https://deb.nodesource.com/node_0.10 utopic main' >> /etc/apt/sources.list.d/nodesource.list
apt-get update
apt-get install nodejs -y
