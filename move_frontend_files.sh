#!/bin/bash

# Create frontend directory structure if it doesn't exist
mkdir -p frontend/public
mkdir -p frontend/src

# Copy frontend files
cp -r src/* frontend/src/
cp -r public/* frontend/public/

# Copy frontend configuration files
cp package.json frontend/
cp package-lock.json frontend/
cp bun.lockb frontend/
cp tsconfig.json frontend/
cp tsconfig.app.json frontend/
cp tsconfig.node.json frontend/
cp vite.config.ts frontend/
cp postcss.config.js frontend/
cp tailwind.config.ts frontend/
cp eslint.config.js frontend/
cp components.json frontend/

echo "Frontend files moved to frontend/ directory"