# Backend Task - CRUD with authentication

## Scope
Required to use:
- nodejs
- mongodb
- mongoose

You decide which modules use:
- server
- test library

1. Implement model „User” - which contains information like:
- email
- password
- name
    
2. Implement login functionality with authentication. All other
requests need a valid token to make a request.

3. Implement model „Task” using mongoose (mongodb). Task will contain
information like:
- title
- description
- time when it should be done
- time when show reminder notification
- it’s completed
    
4. Implement REST API server with CRUD endpoints for „tasks”. Only
logged users can do requests.
- create
- read (get)
- update
- delete
    
5. Write endpoint tests

## Running locally
Requirements:
* Node.js 12
* Npm 6
* Docker

First enable the mongo container, and (leave it running)

`docker-compose -f docker-compose.local.yaml up`

Install dependencies (only first time)

`npm install`

Run the server in watch mode (restarts after code changes are detected)

`npm run start:watch`

The API should be available at

[http://localhost:3000](http://localhost:3000)

### API
POST /users/login - performs login.

POST /users/register - registers a new user.

POST /users/logout - logs current user out.

GET /users/me - returns information about current user.

/tasks/ Endpoint available only for authenticated users

GET /tasks/ - lists existing tasks.  

POST /tasks/ - creates a new task.  

GET /tasks/:id - retrieves existing task.

PATCH /tasks/:id - updates existing task.  

DELETE /tasks/:id - deletes existing task.  

## Implementation details
Implemented using express.js, reuses code encapsulated in middlewares.
Added persistent sessions based in MongoDB. 
Session identifier is stored in a cookie on the client-side 

## TODO
Add API tests.