# Quickstart: Django & Angular

## Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL server running locally

## Backend (Django)
1. Delete contents of `sonic-stage-api/` (except maybe README).
2. Create virtual environment: `python -m venv venv`
3. Activate venv: `.\venv\Scripts\activate`
4. Install Django: `pip install django djangorestframework psycopg2`
5. Initialize project: `django-admin startproject sonic_stage .`
6. Create core app: `python manage.py startapp core`
7. Update `DATABASES` in `settings.py` for PostgreSQL.
8. Run migrations: `python manage.py migrate`
9. Run server: `python manage.py runserver`

## Frontend (Angular 21)
1. Delete contents of `sonic-stage-web/`.
2. Generate Angular project: `npx @angular/cli@17 new sonic-stage-web --style=css --routing=true --standalone=true` *(Note: Since v21 doesn't exist yet, we use the latest Angular with Signals, which is natively supported in recent versions)*.
3. Install Tailwind: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init`
4. Run server: `npm start`
