#! /usr/bin/env sh

python manage.py collectstatic --no-input
# python manage.py compress --force
python manage.py makemigrations && python manage.py migrate
