#!/bin/bash
# Watchdog: keeps the merged game served on 127.0.0.1:8777 (restarts only if it is down).
cd "$(dirname "$0")/game"
while true; do
  if ! curl -s -o /dev/null --max-time 5 http://127.0.0.1:8777/; then
    echo "$(date) restarting server" >> /tmp/merged-keepalive.log
    setsid nohup python3 -m http.server 8777 --bind 127.0.0.1 >> /tmp/merged-http.log 2>&1 &
  fi
  sleep 10
done
