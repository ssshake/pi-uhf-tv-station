# pi-tv-station

[Youtube Video Demo](https://www.youtube.com/watch?v=cm9PoflKxNo&fbclid=IwAR2Gw8_QLGf8oV3qyyU5farEgbrHSqjyMK0ZQgp9mXTgAVxfp5L8BNI3iYk)


##Installation

sudo apt-get update
sudo apt-get install omxplayer

##Mount Videos From Network

sudo apt-get install smbclient

vi /etc/fstab

//[IP-OF-SERVER]/Video /media/video cifs user=[SAMBA USERNAME],pass=[SAMBA PASSWORD] 0 0

mkdir /media/video

mount -a


##Setup API and APP as service

npm install pm2@latest -g

cd api

pm2 start api.js --watch --name=uhf-api

cd app

pm2 serve . --watch --name=uhf-app

pm2 startup

