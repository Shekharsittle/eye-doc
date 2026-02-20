#!/bin/sh
set -e

# Start the Node.js backend on port 5000 in the background
node /app/backend/server.js &

# Start nginx in the foreground (keeps container alive)
nginx -g "daemon off;"
