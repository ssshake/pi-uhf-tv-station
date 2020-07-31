# pi-tv-station

![youtube video thumbnail](https://raw.githubusercontent.com/ssshake/pi-tv-station/master/docs/covertitle.jpg)
[Youtube Video Demo](https://www.youtube.com/watch?v=cm9PoflKxNo&fbclid=IwAR2Gw8_QLGf8oV3qyyU5farEgbrHSqjyMK0ZQgp9mXTgAVxfp5L8BNI3iYk)

![remote app](https://raw.githubusercontent.com/ssshake/pi-uhf-tv-station/master/docs/darmok.jpg)

## Hardware Required

A UHF/VHF TV Transmitter with Composite Video 

![tv transmitter](https://raw.githubusercontent.com/ssshake/pi-tv-station/master/docs/tvtransmitter.jpg)

## Installation Prerequisites

sudo apt-get update

sudo apt-get install omxplayer #command line video play for raspberry pi, written by member of Kodi team

npm install pm2@latest -g #optional but recommended, used to have the API and App as system services

pm2 startup #so that pm2 will start on reboot


## Setup API as service

cd api

nvm use

npm install

pm2 start api.js --watch --name=uhf-api


## Setup APP as Service

cd app

nvm use

npm install

npm run build

cd dist

pm2 serve . --watch --name=uhf-app


## Mount Videos From Network

sudo apt-get install smbclient

vi /etc/fstab

//[IP-OF-SERVER]/Video /media/video cifs user=[SAMBA USERNAME],pass=[SAMBA PASSWORD] 0 0

mkdir /media/video

mount -a


## Configure Smart Plug Power On/Off

Create an account at ifttt.com

Create two webhooks called uhf_power_on and uhf_power_off

Associate these webhooks with your smart plug of choice

Get your API key

Add IFTTT_KEY=[your key] to the .env in the api directory

