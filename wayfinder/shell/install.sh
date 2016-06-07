#!/bin/sh
##############################################################
#
#
##############################################################

if [ "$1" = "EU" ]; then
	echo 'Setting Up for PG Europe Proxy'
	export http_proxy='http://zeuproxy.eu.pg.com:9400'
	export https_proxy='http://zeuproxy.eu.pg.com:9400'
	export no_proxy='localaddress,127.0.0.1,155.123.247.140,155.123.247.139'
	export HTTP_PROXY='http://zeuproxy.eu.pg.com:9400'
	export HTTPS_PROXY='http://zeuproxy.eu.pg.com:9400'
	export NO_PROXY='localaddress,127.0.0.1,155.123.247.140,155.123.247.139'
fi

if [ "$1" = "NA" ]; then
echo 'Setting Up for PG North America Proxy'
	export http_proxy='http://autoproxy.pg.com:8080'
	export https_proxy='http://autoproxy.pg.com:8080'
	export no_proxy='localaddress,127.0.0.1,155.*,155'
	export HTTP_PROXY='http://autoproxy.pg.com:8080'
	export HTTPS_PROXY='http://autoproxy.pg.com:8080'
	export NO_PROXY='localaddress,127.0.0.1,155.*,155'
fi

echo '---------------------------------------------'
echo 'Remove Default VNC Server'
sudo apt-get -y remove vino
sudo apt-get -y autoremove

echo '---------------------------------------------'
echo 'Preform A System Update'
sudo apt-get -y update

echo '---------------------------------------------'
echo 'Install Additional Software'
sudo apt-get -y install python-software-properties software-properties-common openssh-server curl apt-transport-https git vsftpd x11vnc xdotool libavahi-compat-libdnssd-dev sysstat atsar screen

echo '---------------------------------------------'
echo 'Add Debian Node.js Repository'
sudo su
curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
echo 'deb https://deb.nodesource.com/node_0.10 utopic main' > /etc/apt/sources.list.d/nodesource.list
echo 'deb-src https://deb.nodesource.com/node_0.10 utopic main' >> /etc/apt/sources.list.d/nodesource.list
apt-get update
apt-get install nodejs -y
exit

##############################################################
echo '---------------------------------------------'
echo 'Go to Home Directory and create GIT folder'
cd ~/.

##############################################################
echo '---------------------------------------------'
echo 'Clone Project Files Into ao Folder'
git clone https://github.com/Zenitram-Oriaj/ao-webkit.git
cd ao-webkit

echo '---------------------------------------------'
echo 'Get Node Webkit'
wget http://dl.nwjs.io/v0.12.2/nwjs-v0.12.2-linux-ia32.tar.gz
tar -zxvf nwjs-v0.12.2-linux-ia32.tar.gz

echo '---------------------------------------------'
echo 'Install Modules'

if [ "$1" = "EU" ]; then
	echo 'Setting NPM for PG Europe Proxy'
	npm config set proxy http://zeuproxy.eu.pg.com:9400
	npm config set https-proxy http://zeuproxy.eu.pg.com:9400
fi

if [ "$1" = "NA" ]; then
	echo 'Setting NPM for PG North America Proxy'
	npm config set proxy http://autoproxy.pg.com:8080
	npm config set https-proxy http://autoproxy.pg.com:8080
fi


npm install

#echo '---------------------------------------------'
#echo 'Link Missing Older File To New Version'
#sudo ln -sf /lib/$(arch)-linux-gnu/libudev.so.1 /lib/$(arch)-linux-gnu/libudev.so.0

echo '---------------------------------------------'
echo 'Reset Font Cache'
fc-cache -f -v

echo '---------------------------------------------'
echo 'Disable Screen Lock'
gsettings set org.gnome.desktop.lockdown disable-lock-screen 'true'

echo '---------------------------------------------'
echo 'Prevent Screen From Going To Sleep'
gsettings set org.gnome.desktop.session idle-delay 0

##############################################################
echo '---------------------------------------------'
echo 'Agile Office Webkit Process Completed!'
