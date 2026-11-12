# System Architecture Document

## Project Name: Book Basket

## 1. Introduction

This document describes the system architecture of Book Basket, a full-stack book management web application.

It explains how the frontend, backend, database, and external book API work together to provide book discovery, user authentication, personal library management, reading status updates, and favourite book management.

Book Basket follows a client-server architecture with a modular MVC-style backend structure.

## 2. Architecture Overview

Book Basket uses the MERN stack architecture.

The application consists of the following major components:

- React.js and Vite frontend.
- Node.js and Express.js backend.
- MongoDB Atlas database.
- Mongoose for database operations.
- Open Library API for book information.

The frontend communicates with the backend through REST APIs. The backend processes requests, performs authentication and database operations, and returns JSON responses to the frontend.

## 3. Architecture Components

### 3.1 Frontend (Presentation Layer)

The frontend is developed using React.js and Vite.

Responsibilities:

- Display the Book Basket user interface.
- Provide user registration and login pages.
- Allow users to search for books.
- Display book details and cover images.
- Manage the user's personal library.
- Update reading status.
- Manage favourite books.
- Display dashboard statistics.
- Provide a responsive interface for different screen sizes.
- Communicate with backend APIs using Axios.

### 3.2 Backend (Application Layer)

The backend is developed using Node.js and Express.js.

Responsibilities:

- Receive HTTP requests from the frontend.
- Provide REST API endpoints.
- Handle user registration and authentication.
- Validate incoming requests.
- Manage book and library operations.
- Communicate with MongoDB Atlas.
- Retrieve book information from the external API.
- Handle errors and return JSON responses.
- Protect authenticated routes using JWT.

### 3.3 Database Layer

MongoDB Atlas is used as the cloud database, and Mongoose is used to manage database operations.

The application stores information related to:

**User Information**
- Name.
- Email address.
- Password information in the format used by the authentication system.

**Library Information**
- User reference.
- Book information.
- Reading status.
- Favourite status.
- Creation and update timestamps.

The database supports user-specific library management.

### 3.4 Controller Layer

The controller layer contains the application logic for processing API requests.

It handles operations related to:

- User registration and login.
- Book searching and book details.
- Adding books to a personal library.
- Retrieving saved books.
- Updating reading status.
- Updating favourite status.
- Removing books from the library.
- Validating incoming data.
- Returning appropriate responses.

### 3.5 Routes Layer

The routes layer defines API endpoints and connects them to their corresponding controller functions.

The backend uses three main route groups:

| Route Group | Base Path | Responsibility |
|---|---|---|
| Book Routes | `/api/books` | Book search and details |
| Authentication Routes | `/api/auth` | Registration and login |
| Library Routes | `/api/library` | Personal library operations |

### 3.6 Middleware Layer

Middleware functions process requests before they reach the appropriate controller.

The application uses middleware for:

- User authentication.
- Protecting private routes.
- Handling unknown routes.
- Centralized error handling.
- Parsing JSON request bodies.
- Configuring CORS.
- Applying HTTP security headers using Helmet.

### 3.7 External API

Book Basket uses the Open Library API to retrieve book information.

**API Endpoint:**

`https://openlibrary.org/search.json`

The external service provides available book information such as titles, authors, and cover information.

Book cover images can be retrieved through the Open Library Covers service.

## 4. System Architecture Diagram

```text
                    USER
                      |
                      v
              REACT FRONTEND
                (Vite + React)
                      |
                      | HTTP Requests
                      | Axios
                      v
              EXPRESS BACKEND
                (Node.js)
                      |
              -----------------
              |       |       |
              v       v       v
            BOOK    AUTH    LIBRARY
           ROUTES   ROUTES   ROUTES
              |       |       |
              v       v       v
          CONTROLLERS AND MIDDLEWARE
                      |
             -------------------
             |                 |
             v                 v
        MONGODB ATLAS     OPEN LIBRARY
         (Mongoose)           API
             |                 |
             -------------------
                      |
                      v
                JSON RESPONSE
                      |
                      v
               REACT FRONTEND
                      |
                      v
                USER DISPLAY
```

## 5. Application Workflow

1. The user opens the Book Basket application.
2. The React frontend displays the login or registration page.
3. The user registers or logs in using their credentials.
4. The frontend sends authentication requests to the Express backend.
5. The backend validates the request and processes authentication.
6. After successful login, the user can access protected application features.
7. When the user searches for a book, the frontend sends a request to the backend.
8. The backend retrieves available book information from the Open Library API.
9. The user can add selected books to their personal library.
10. The backend stores the library information in MongoDB Atlas.
11. Users can update reading status, manage favourites, and remove saved books.
12. The backend returns JSON responses to the frontend.
13. The frontend updates the interface and displays the results.

## 6. Backend Structure

The backend follows a modular MVC-style folder structure.

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│
├── middleware/
│   ├── middleware.js
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   └── Library.js
│
├── routes/
│   ├── bookRoutes.js
│   ├── authRoutes.js
│   └── libraryRoutes.js
│
├── .env
├── package.json
└── server.js
```

### Folder Responsibilities

- **config:** Contains MongoDB database connection configuration.
- **controllers:** Contains the application logic for handling API requests.
- **middleware:** Handles authentication, unknown routes, and centralized error handling.
- **models:** Contains Mongoose models for database operations.
- **routes:** Defines API endpoints and connects them to controller functions.
- **.env:** Stores private environment variables.
- **package.json:** Contains backend dependencies and scripts.
- **server.js:** Initializes Express, configures middleware, connects routes, establishes the database connection, and starts the server.

## 7. Frontend Structure

The frontend is developed using React.js and Vite.

```text
frontend/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
└── index.html
```

### Folder Responsibilities

- **components:** Contains reusable interface components.
- **pages:** Contains application pages such as Login, Dashboard, Explore, My Library, and Favourites.
- **services:** Contains API communication configuration.
- **App.jsx:** Manages the main application structure and navigation.
- **main.jsx:** Entry point of the React application.
- **.env:** Stores frontend environment configuration.

## 8. Communication Between Components

| Components | Communication |
|---|---|
| User and React | User interface interactions |
| React and Express | HTTP requests and JSON responses |
| Frontend and Backend | Axios |
| Routes and Controllers | Express route handlers |
| Controllers and Models | Mongoose operations |
| Models and MongoDB | Database operations |
| Backend and Open Library | External API requests |

## 9. Security Architecture

Book Basket uses the following security measures:

- JWT-based authentication for protected routes.
- Environment variables for sensitive configuration.
- Helmet middleware for HTTP security headers.
- CORS configuration for frontend and backend communication.
- Input validation and centralized error handling.
- User-specific access to personal library records.

## 10. Conclusion

The Book Basket application follows a modular client-server architecture using the MERN stack.

React.js provides the user interface, Express.js and Node.js handle application logic, and MongoDB Atlas stores user and library information.

The integration of the external Open Library API allows users to discover books and manage their personal reading collections.

The modular architecture makes the application easier to maintain, test, and extend with additional features in the future.