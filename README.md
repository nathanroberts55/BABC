# Big A Book Club Website

## Prequisities
- Python Version < 3.10
- pip Version < 23.3
- Node Version < 18.12
  
## Environment Requirements
After cloning the `main` branch of the repository you'll want to:
- Create a python virtual environment:  
  - My prefered method is `python -m venv venv` command
  - Then install the required packages using `pip install -r requirements.txt`
- Create a `.env` file in the base directory with the following secrets
  - Mandatory:
    - DEBUG
    - SECRET_KEY                 _[Feel Free to Generate Your Own for Development]_
    - SOCIAL_AUTH_DISCORD_KEY    _[Contact Admin for Keys/Generate your own]_
    - SOCIAL_AUTH_DISCORD_SECRET _[Contact Admin for Keys/Generate your own]_
    - RECAPTCHA_PRIVATE_KEY _[Contact Admin for Keys]_
    - RECAPTCHA_PUBLIC_KEY _[Contact Admin for Keys]_
  - Optional:
    - POSTGRES_NAME     = postgres
    - POSTGRES_USER     = postgres
    - POSTGRES_PASSWORD = postgres
    - POSTGRES_HOST     = postgres
    - POSTGRES_PORT     = 5432
- From the base directory running `python manage.py makemigrations` then `python manage.py migrate` will create the database
- From the base directory running `python manage.py createsuperuser` to create a admin account (needed for approving books and accessing the admin panel)
- Navigate into the `/frontend/` app, and run the `npm install` command to install the required

## Running the Application
 To run the application:
 - Open two terminals/command prompts
 - Initialize the virtual environment
 - Backend: In the first terminal, from the base directory of the project run the following command `python manage.py runserver`
 - Frontend: In the second terminal, navigate to the `/frontend` app run the following command `npm run dev`

## Pull Requests
- Pull Requests meet the following requirements:
  - Must make own branch for PR (no commits straight to `main`)
  - Python code must be accompanied with tests, and have a threshold of 85% test coverage and must pass all tests to ensure functionality.
  - Code must pass the Pull Request Check Pipeline (build and test)
  - Reviews must be approved by CODEOWNERS before merge to main (do not force merge).
  - Before committing, navigate to the `/frontend` app run the following command `npm run build` to prepare bundle for deployment.

