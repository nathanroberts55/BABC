#! /usr/bin/env sh

python manage.py collectstatic --no-input
python manage.py makemigrations && python manage.py migrate
