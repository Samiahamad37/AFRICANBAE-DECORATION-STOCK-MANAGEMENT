#!/bin/sh

echo "Running migrations..."
python manage.py migrate --noinput

echo "Starting server..."
gunicorn config.wsgi:application --bind 0.0.0.0:8000