#!/bin/bash
until npm start; do
    echo "Server 'augur-node' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
