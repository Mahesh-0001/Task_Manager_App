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


🔹 API Endpoints (Backend)
| Method | Endpoint | Description |
| ------ | ----------------- | ----------------- |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}` | Update task by ID |
| DELETE | `/api/tasks/{id}` | Delete task by ID |

Build & run

From the extracted Task_Manager/ folder (the one that contains the Dockerfile):
# Build image
docker build -t task-manager .

# Run container
docker run --rm -p 8080:8080 task-manager

Open:

App UI: http://localhost:8080/index.html

Health check: http://localhost:8080/api/health

Notes (in case you tweak things)

Changing port: edit backend/src/main/resources/application.properties (server.port=8080) and re-build the image.

JAVA_OPTS: you can pass JVM flags as needed:
docker run --rm -p 8080:8080 -e JAVA_OPTS="-Xms256m -Xmx512m" task-manager
CORS: the controllers already allow *, so the in-container UI and API work together without extra config.



CRUD:

1. Create a Task (POST)

curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish Docker setup",
    "description": "Complete Dockerfile testing",
    "status": "DONE"
  }'

2. Read All Tasks (GET)

curl -X GET http://localhost:8080/api/tasks

3. Read a Task by ID (GET)

curl -X GET http://localhost:8080/api/tasks/1

4. Update a Task (PUT)

curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish Docker setup (updated)",
    "description": "Ensure Docker container works",
    "completed": true
  }'

5. Delete a Task (DELETE)

curl -X DELETE http://localhost:8080/api/tasks/1


6. Health Check (GET)

curl -X GET http://localhost:8080/api/health

For Cleaning:
rm -rf backend/target
rm -rf .vscode

