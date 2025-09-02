📌 Task Manager App

A full-stack Java application with a Spring Boot backend and a Bootstrap/JavaScript frontend.
Supports CRUD operations on tasks with Docker Compose for easy local and cloud deployment.

🔹 Features

Backend: Spring Boot (Java 17, Maven), REST API

Frontend: HTML, Bootstrap 5, Vanilla JS

CRUD: Create, Read, Update, Delete tasks

Validation: Ensures title is required and status is PENDING or DONE

Edit Modal: Update title, description, and status

Serial Number + Unique ID columns in task table

Dockerized: Run with one command via docker-compose

🔹 Project Structure

task-manager-app/
├── backend/ # Spring Boot REST API
│ ├── src/ # Java source code
│ ├── pom.xml # Maven config
│ └── Dockerfile
│
├── frontend/ # Bootstrap + JS frontend
│ ├── index.html
│ ├── app.js
│ ├── style.css
│ ├── config.js # Injected API URL
│ ├── entrypoint.sh # Nginx startup script
│ └── Dockerfile
│
├── docker-compose.yml # Orchestrates frontend + backend
├── .gitignore # Ignore build artifacts, IDE files
└── README.md # (this file)

Run Locally with Docker Compose

1. Build images
   docker-compose build
2. Start containers
   docker-compose up
   Backend API → http://localhost:8080/api/tasks
   Frontend UI → http://localhost:8081
3. Stop containers
   Press CTRL+C, then:
   docker-compose down

🔹 API Endpoints (Backend)
| Method | Endpoint | Description |
| ------ | ----------------- | ----------------- |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}` | Update task by ID |
| DELETE | `/api/tasks/{id}` | Delete task by ID |

Example (create a task):
curl -X POST http://localhost:8080/api/tasks \
 -H "Content-Type: application/json" \
 -d '{"title":"Learn Docker","description":"Step 5","status":"PENDING"}'

🔹 Cloud Deployment

Push this repo to GitHub.

Choose a cloud provider:

Render → Easiest free hosting (build from docker-compose.yml)

Heroku → Container deploy with heroku container:push

AWS ECS/Fargate → For production-grade deployment

Make sure to set API_URL in frontend container’s environment variable:
environment:

- API_URL=https://myapi.example.com/api/tasks

For Cleaning:
rm -rf backend/target
rm -rf .vscode

🔹 Development Notes

Backend runs on Java 17 (check your JDK).

backend/target/ is ignored (generated on build).

CORS is currently @CrossOrigin(origins = "\*") → in production, restrict it to your frontend domain.

Frontend API base URL is injected dynamically via config.js at container startup.
