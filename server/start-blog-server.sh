#!/bin/bash
echo "Installing dependencies for Blog Server..."
cd "$(dirname "$0")"
npm install
echo "Starting Blog Server..."
npm start 