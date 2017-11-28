#!/bin/bash
echo "Building with npm and running the server...";

# Run npm
npm run build;

# Start the server
python manage.py runserver;