#!/bin/sh
# this script is used to boot the Docker container

source venv/bin/activate
exec gunicorn --bind 0.0.0.0:5000 --access-logfile - --error-logfile - wsgi:app
