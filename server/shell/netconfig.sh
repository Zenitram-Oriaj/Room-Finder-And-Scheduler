#!/bin/sh

sudo mv /etc/network/interfaces /etc/network/interfaces.old
sudo mv /home/roomfinder/ao/interfaces /etc/network/interfaces
sudo service network-manager restart
sudo service networking restart
sudo service resolvconf restart