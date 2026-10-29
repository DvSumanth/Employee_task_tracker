# Employee Task Tracker

A simple web application for managing employee tasks, built using Python, FastAPI, SQLite, HTML, CSS, and JavaScript.

The application allows users to create, view, update, and delete tasks through a frontend interface connected to a REST API.

## Features

- Create new employee tasks
- View all tasks
- Update existing tasks
- Delete tasks
- Assign tasks to employees
- Track task status
- REST API integration between frontend and backend
- SQLite database for storing task information

## Tech Stack

**Backend**
- Python
- FastAPI
- SQLite
- SQLAlchemy

**Frontend**
- HTML
- CSS
- JavaScript

**Tools**
- Git
- GitHub
- Visual Studio Code
- Uvicorn

## Project Structure

```text
Employee_task_tracker/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── database/
│   │   │   └── connection.py
│   │   ├── models/
│   │   │   └── task.py
│   │   ├── schemas/
│   │   │   └── task.py
│   │   ├── repositories/
│   │   │   └── task_repository.py
│   │   ├── services/
│   │   │   └── task_service.py
│   │   └── routers/
│   │       └── task_router.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── task.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

## Task Information

Each task contains the following fields:

| Field | Description |
|---|---|
| id | Unique task identifier |
| title | Task title |
| description | Details about the task |
| employee_name | Name of the assigned employee |
| status | Current task status |

Supported task statuses:

- `pending`
- `in_progress`
- `completed`

## API Endpoints

Base URL:

`http://127.0.0.1:8000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks/` | Retrieve all tasks |
| POST | `/api/tasks/` | Create a new task |
| PUT | `/api/tasks/{task_id}` | Update an existing task |
| DELETE | `/api/tasks/{task_id}` | Delete a task |

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/DvSumanth/Employee_task_tracker.git
```

### 2. Navigate to the project

```bash
cd Employee_task_tracker
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

### 5. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 6. Start the backend server

From the project root, run:

```bash
python -m uvicorn app.main:app --reload --app-dir backend
```

If your application uses a different import path, adjust the command to match your actual backend structure.

The API will be available at:

`http://127.0.0.1:8000`

### 7. Explore the API documentation

Open the following address in your browser:

`http://127.0.0.1:8000/docs`

FastAPI provides interactive API documentation for testing the endpoints.

### 8. Run the frontend

Open `frontend/task.html` using the VS Code Live Server extension.

The frontend communicates with the backend through:

`http://127.0.0.1:8000/api/tasks/`

Ensure the backend server is running before using the application.

## How It Works

1. The user interacts with the frontend to manage tasks.
2. JavaScript sends HTTP requests to the FastAPI backend.
3. FastAPI processes requests through the appropriate API routes.
4. The application interacts with SQLite to store or retrieve task information.
5. The backend returns responses that the frontend displays to the user.

## Learning Outcomes

- Building REST APIs with FastAPI
- Performing CRUD operations
- Connecting a Python backend to SQLite
- Integrating JavaScript with backend APIs
- Organizing backend code into separate modules
- Handling HTTP requests and responses

## Author

**Dega Venkata Sumanth**

GitHub: https://github.com/DvSumanth

---

This project was developed as a practical exercise in backend development and frontend integration.
