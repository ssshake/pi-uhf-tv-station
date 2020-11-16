#!/bin/bash

sudo mount //10.0.0.10/Video /media/video/ -t cifs -o username=share

/usr/bin/node /home/pi/pitv/api/api.js

echo "should start front end"
