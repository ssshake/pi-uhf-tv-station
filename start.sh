#!/bin/bash
pm2 serve ./app/dist 8080 --watch --name uhf-app
pm2 start ./api/api.js --watch --name uhf-api
pm2 start ./stream/stream.js --watch --name uhf-stream
