# WebApp

This repository contains a Node.js web application with a health check endpoint and database connectivity.

## Prerequisites

- Node.js
- npm
- PostgreSQL database.
- Sequalize for ORM PostgreSQL
- Jest for integration and unit testing
  `npm install --save pg pg-hstore`

- Nodemon for continous server
- Express for backend framework
- dotenv

### Linux shell commands to install files -

- `sudo apt install nodejs npm`
- `sudo apt install postgresql postgresql-contrib`

## Environment Variables

Clone the `.env.example` file into a `.env` file in the root directory of the project and add the following variables:

```
# Environment Configuration
NODE_ENV="<your environment>"

# Database Configuration
DB_NAME="<your database name>"
DB_USER="<your database user>"
DB_PASSWORD="<your database password>"
DB_HOST="<your database host>"
DB_PORT="<your database port>"
DB_TABLE_NAME="<your database table name>"
DB_SCHEMA="<your database schema>"

# Server Configuration
PORT="<your server port>"
```

Replace the values with your actual database details and the required port number. Postgres defaults to 5432

## Installation

1. Fork the repo to your system
2. Clone the repository:
   `git clone https://github.com/filter-kaapi/webapp.git
cd webapp`

3. Install dependencies:
   `npm install`

## Running the Application

To start the application in development mode with auto-reload:

`npm start`

The server will start running at `http://localhost:8080` (or the PORT you specified in the .env file).

## Available API Endpoints

### Health Check

- **URL**: `/healthz`
- **Method**: GET
- **Description**: Checks the health of the application and database connection.

# User API Documentation

This file describes the API endpoints for user management under the `/v1/user` route.

## Endpoints

### 1. POST `/user`

- **Description**: This is a public route for user registration.
- **Request Body**:
  - `email` (string): The user's email address.
  - `first_name` (string): The user's first name.
  - `last_name` (string): The user's last name.
  - `password` (string): The user's password (must be longer than 5 characters).
- **Responses**:
  - `201 Created`: User successfully registered. Response body contains:
    ```json
    {
    	"id": "user_id",
    	"first_name": "user_first_name",
    	"last_name": "user_last_name",
    	"email": "user_email",
    	"account_created": "timestamp",
    	"account_updated": "timestamp"
    }
    ```
  - `400 Bad Request`: If any of the required fields are missing or invalid (e.g., password too short).

### 2. GET `/user/self`

- **Description**: This is an authenticated route that returns the details of the authenticated user.
- **Request Headers**: Must include BASIC authentication token (via middleware).
- **Responses**:
  - `200 OK`: Successfully retrieved user details. Response body contains:
    ```json
    {
    	"id": "user_id",
    	"email": "user_email",
    	"first_name": "user_first_name",
    	"last_name": "user_last_name",
    	"account_created": "timestamp",
    	"account_updated": "timestamp"
    }
    ```
  - `400 Bad Request`: If there are any parameters or query strings provided.
  - `405 Method Not Allowed`: If the request method is `HEAD`.

### 3. PUT `/user/self`

- **Description**: This is an authenticated route that updates user information.
- **Request Body**:
  - `first_name` (string): Updated first name (optional).
  - `last_name` (string): Updated last name (optional).
  - `password` (string): Updated password (optional).
- **Responses**:
  - `204 No Content`: Successfully updated user details.
  - `400 Bad Request`: If invalid fields are provided in the request body or if the request includes `account_created` or `account_updated`.
  - `405 Method Not Allowed`: If the request method is not supported.

### Unsupported Routes

Both `/user` and `/user/self` do not support the following HTTP methods:

- DELETE
- HEAD
- OPTIONS
- PATCH
- GET (for `/user`)
- PUT (for `/user`)

### Example of Error Responses

- `400 Bad Request` might be returned with the following message:
  ```json
  {
  	"error": "Password too small"
  }
  ```

## Build and Deploy Instructions

### Local Development

1. Ensure all prerequisites are installed and the `.env` file is configured.
2. Run `npm install` to install dependencies.
3. Start the application with `npm start`.
4. The application will be available at `http://localhost:8080` (or your PORT).

## Testing

### Local Development

1. Start the application with `npm run test:local`
   or github via
   `npm run test:github`
