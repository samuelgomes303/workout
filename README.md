# Workout App

A workout management application with a React web interface and a Spring Boot REST API. It allows users to create and track workouts, schedule sessions, and view reports.

## Features

- User registration and authentication with JWT
- Create, view, update, and delete workouts
- Browse available exercises
- Start and finish workouts
- Schedule and view scheduled workouts
- Generate workout reports
- Web interface for managing the application

## Technologies

### Frontend

- React Bootstrap

### Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- JSON Web Tokens (JWT)
- PostgreSQL
- Maven

## Project structure

```text
workoutApp/
├── frntmanager/       # React application
└── workoutProject/    # Spring Boot API
    └── src/main/java/com/example/workoutproject/
        ├── authentication/  JWT implementation
        ├── controller/      REST API endpoints
        ├── dto/             Data Transfer Objects for API requests and responses     
        ├── entity/          JPA entities
        ├── exception/       Some class exceptions
        ├── respository/     JPA entities repository
        ├── service/         Methods for business logic 
        └── utils/           Data seeder and other methods
```

## Requirements

- Java 17 or later
- Node.js and npm
- PostgreSQL

## Database

The database schema script is located at `workoutProject/src/main/resources/db_schema.sql`. It was generated from the project ERD in pgAdmin and defines the tables, primary keys, and foreign keys.

## Run locally

1. Clone the repository
2. Ensure you have Java 17 and Maven installed
3. Start PostgreSQL database and configure the database connection in your local application.properties file with your database credentials

### 2. Start the backend

From the repository root, run:

```powershell
cd .\workoutProject
.\mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Start the frontend

Open another terminal at the repository root and run:

```powershell
cd .\frntmanager
npm install
npm start
```

The web application will be available at `http://localhost:3000`.

## API Endpoint

Login and registration are publicly accessible. All workout and schedule endpoints require a valid JWT bearer token.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a user |
| `POST` | `/api/v1/auth/login` | Log in |
| `POST` | `/api/v1/workout/create` | Create a workout |
| `GET` | `/api/v1/workout/list` | List the user's workouts |
| `GET` | `/api/v1/workout/listExercices` | List all available exercises |
| `GET` | `/api/v1/workout/listById/{workoutId}` | Get a workout |
| `GET` | `/api/v1/workout/listByState/{state}` | Filter workouts by state |
| `PUT` | `/api/v1/workout/update/{workoutId}` | Update a workout |
| `DELETE` | `/api/v1/workout/deleteById/{workout_id}` | Delete a workout |
| `POST` | `/api/v1/workout/start/{workoutId}` | Start a workout |
| `POST` | `/api/v1/workout/finish/{workoutId}` | Finish a workout |
| `POST` | `/api/v1/workout/generateReport` | Generate a report |
| `POST` | `/api/v1/schedule/create/{workoutId}` | Schedule a workout |
| `GET` | `/api/v1/schedule/list` | List scheduled workouts |
