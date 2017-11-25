#!/bin/bash
echo "Removing old database and starting over...";

# Clean it up
rm db.sqlite3;
python manage.py makemigrations;
python manage.py migrate;

# Start it over
echo ""
echo "Initializing new database"
python init.py;

npm run build