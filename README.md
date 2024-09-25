# WebApp

This repository contains a Node.js web application with a health check endpoint and database connectivity.

## Prerequisites

- Node.js
- npm
- PostgreSQL database. 
- Sequalize for ORM PostgreSQL
  
   `npm install --save pg pg-hstore`
- Nodemon for continous server
- Express for backend framework
- dotenv


## Environment Variables

Clone the `.env.example` file into a `.env` file in the root directory of the project and add the following variables:

```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=your_database_port
PORT=8080
```

Replace the values with your actual database details and the required port number. Postgres defaults to 5432

## Installation

1. Fork the repo to your system 
2. Clone the repository:
   `
   git clone https://github.com/filter-kaapi/webapp.git
   cd webapp
   `

3. Install dependencies:
   `
   npm install
   `

## Running the Application

To start the application in development mode with auto-reload:

`
npm start
`

The server will start running at `http://localhost:8080` (or the PORT you specified in the .env file).

## Available API Endpoints

### Health Check

- **URL**: `/healthz`
- **Method**: GET
- **Description**: Checks the health of the application and database connection.
## Build and Deploy Instructions

### Local Development

1. Ensure all prerequisites are installed and the `.env` file is configured.
2. Run `npm install` to install dependencies.
3. Start the application with `npm start`.
4. The application will be available at `http://localhost:8080` (or your PORT).
