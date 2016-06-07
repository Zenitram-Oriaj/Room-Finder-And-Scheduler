#!/bin/sh
##############################################################
#
#
##############################################################
echo '---------------------------------------------'
echo 'Remove Default VNC Server'
sudo apt-get -y remove vino
sudo apt-get -y autoremove

echo '---------------------------------------------'
echo 'Preform A System Update'
sudo apt-get -y update

echo '---------------------------------------------'
echo 'Install Additional Software'
sudo apt-get -y install python-software-properties openssh-server curl git vsftpd chromium-browser nodejs x11vnc ttf-mscorefonts-installer xdotool

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
cd ~/.
cd ao
cd ao-webkit

##############################################################
echo '---------------------------------------------'
echo 'Update Project Files Via GIT'
git pull

##############################################################
echo '---------------------------------------------'
echo 'Copy Files To There Needed Directories'
cd files
sudo cp lightdm.conf /etc/lightdm/lightdm.conf

mkdir ~/.config/autostart
sudo cp nw.desktop ~/.config/autostart/nw.desktop
cd ..


##############################################################
echo '---------------------------------------------'
echo 'Run Application'
sudo ./nw

##############################################################
echo '---------------------------------------------'
echo 'Agile Office Webkit Update Completed!'
