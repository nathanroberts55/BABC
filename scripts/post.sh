#! /usr/bin/env sh

python manage.py collectstatic 
python manage.py makemigrations && python manage.py migrate
