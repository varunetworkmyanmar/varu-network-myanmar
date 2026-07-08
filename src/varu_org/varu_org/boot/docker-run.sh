#!/bin/bash
set -e

# Activate virtual environment
source /opt/venv/bin/activate
cd /code

python manage.py migrate --noinput


# Runtime host/port with defaults
RUNTIME_PORT=${PORT:-8080}
RUNTIME_HOST=${HOST:-0.0.0.0}

# python manage.py collectstatic --noinput

exec gunicorn varu_org.wsgi:application --bind $RUNTIME_HOST:$RUNTIME_PORT
