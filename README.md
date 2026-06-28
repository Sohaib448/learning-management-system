# Learning Management System (LMS)

A Learning Management System built with **Django**, **Django REST Framework**, and **JWT Authentication**. Admins manage user approvals, Teachers create and review assignments, and Students submit their work — all through a RESTful API with role-based access control.

**Live Demo:** [own-lms.vercel.app](https://own-lms.vercel.app)

## Features

**Authentication**
- User registration and login
- JWT authentication (access + refresh tokens)
- Secure password hashing
- Protected API endpoints

**Admin**
- Approve or reject new account requests
- View total approved users, teachers, and students
- View pending requests

**Teacher**
- Create, update, delete, and view assignments
- Review student submissions

**Student**
- View available assignments
- Submit assignment solutions
- Track submission status (pending vs. submitted)

## Tech Stack

- **Backend:** Python, Django, Django REST Framework
- **Auth:** JWT (Simple JWT)
- **Database:** SQLite
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Vercel

## Project Structure

```
learning-management-system/
├── assignment/
├── submissions/
├── users/
├── core/
├── frontend/
├── manage.py
├── requirements.txt
├── Procfile
├── db.sqlite3
└── .gitignore
```

**users/** — registration, login, JWT generation, role management
**assignment/** — create, update, delete, and list assignments
**submissions/** — student submissions, submission history, linking students to assignments
**core/** — project settings, URL routing, middleware, auth configuration

## REST API

**Auth:** Register, Login, Refresh Token, User Profile
**Assignments:** Create, Retrieve, Update, Delete
**Submissions:** Submit, View Submission, View All Submissions

## Architecture

```
Client → Frontend (HTML/CSS/JS) → REST API → Django REST Framework → SQLite
```

## Installation

```bash
git clone https://github.com/Sohaib448/learning-management-system.git
cd learning-management-system

python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Screenshots

**Admin** — Login / Dashboard
![Admin Login](demo5.png)
![Admin Dashboard](demo.png)

**Teacher** — Login / Dashboard
![Teacher Login](demo3.png)
![Teacher Dashboard](demo4.png)

**Student** — Login / Dashboard
![Student Login](demo1.png)
![Student Dashboard](demo2.png)

## Deployment

Deployed on Vercel. Backend configured for production with a Procfile and CORS support for the live frontend domain.

## Learning Outcomes

Django, Django REST Framework, JWT authentication, REST API development, role-based authorization, CRUD operations, database relationships, API testing with Postman, frontend integration, deployment preparation, Git/GitHub workflow.

## Future Improvements

File upload support, assignment grading, teacher feedback, notifications, email verification, course management, attendance system, admin analytics dashboard, Docker support, PostgreSQL integration, Redis caching, CI/CD pipeline.

## Author

**Sohaib Nisar**
Backend Developer | Python | Django | Django REST Framework
GitHub: [github.com/Sohaib448](https://github.com/Sohaib448)

## License

This project is intended for educational purposes and portfolio demonstration.
