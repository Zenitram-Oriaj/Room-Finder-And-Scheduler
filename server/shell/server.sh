#!/bin/sh
##############################################################
#
#
##############################################################

Q1="CREATE DATABASE IF NOT EXISTS \`agileoffice-gateway\`;"
Q2="GRANT ALL ON *.* TO \`ao\`@\`%\` IDENTIFIED BY 'a1b2c3d4e5';"
Q3="FLUSH PRIVILEGES;"
SQL="${Q1}${Q2}${Q3}"

sudo killall update-notifier

echo '--------------------------------------------------------'
echo 'Remove Default VNC Server'
sudo apt-get -y remove vino
sudo apt-get -y autoremove

echo '--------------------------------------------------------'
echo 'Preform A System Update'
sudo apt-get -y update

echo '--------------------------------------------------------'
echo 'Install MySQL Server First'
sudo apt-get -y install mysql-server

mysql -u root -p -e "$SQL"

echo '--------------------------------------------------------'
echo 'Install Additional Software'
sudo apt-get -y install software-properties-common python-software-properties openssh-server curl git git-core make gcc g++ vsftpd gnome-core xfce4 vnc4server xinetd xdotool xrdp libavahi-compat-libdnssd-dev sysstat atsar screen

echo '--------------------------------------------------------'
echo 'Add Chris-Lea Node.js Repository'
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs

##############################################################
echo '---------------------------------------------'
echo 'Install Global NodeJS Modules'
sudo npm install -g mdns

##############################################################
echo '---------------------------------------------'
echo 'Go to Home Directory and Clone Repository'
cd ~/.
git clone https://github.com/Zenitram-Oriaj/ao.git
cd ao

##############################################################
echo '--------------------------------------------------------'
echo 'Install Required Node Modules'
sudo npm install

##############################################################
echo '--------------------------------------------------------'
echo 'Import Database Schema To MySQL'
mysql -u root -p agileoffice-gateway < schema.sql

##############################################################
echo '--------------------------------------------------------'
echo 'Agile Office Gateway Install Process Completed!'
