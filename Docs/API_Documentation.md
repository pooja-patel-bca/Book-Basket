# API Documentation

## Project Name: Book Basket

## 1. Introduction

This document describes the REST APIs used in the Book Basket application.

The APIs connect the frontend with the backend and support user authentication, book searching, book details, personal library management, reading status updates, and favourite book management.

**Base URL:**

`http://localhost:5000`

**API Base Path:**

`/api`

All API requests and responses use JSON format.

## 2. API Route Groups

The application uses three main API route groups:

| Route Group | Base Path | Purpose |
|---|---|---|
| Books | `/api/books` | Book search and details |
| Authentication | `/api/auth` | User registration and login |
| Library | `/api/library` | Personal library management |

## 3. Book APIs

### 3.1 Search Books

- **Method:** GET
- **Endpoint:** `/api/books/search?q=bookName`
- **Purpose:** Searches for books using the external Open Library API.

**Example:**

`GET /api/books/search?q=Atomic%20Habits`

**Success Response:** `200 OK`

Returns matching book information, including available titles, authors, and cover images.

### 3.2 Get Book Details

- **Method:** GET
- **Endpoint:** `/api/books/:id`
- **Purpose:** Retrieves detailed information about a selected book.

**Example:**

`GET /api/books/BOOK_ID`

**Success Response:** `200 OK`

Returns the selected book details.

## 4. Authentication APIs

### 4.1 User Registration

- **Method:** POST
- **Endpoint:** `/api/auth/register`
- **Purpose:** Creates a new user account.

**Request Body Example:**

```json
{
  "name": "Pooja",
  "email": "pooja@example.com",
  "password": "your_password"
}
```

**Success Response:** `201 Created` (if configured by the registration controller).

Creates a new user account.

### 4.2 User Login

- **Method:** POST
- **Endpoint:** `/api/auth/login`
- **Purpose:** Authenticates an existing user.

**Request Body Example:**

```json
{
  "email": "pooja@example.com",
  "password": "your_password"
}
```

**Success Response:** `200 OK`

Returns the authentication response, including the JWT token when login is successful.

**Error Response:**

`401 Unauthorized` – Invalid email or password.

## 5. Personal Library APIs

**Note:** Library routes require authentication. The JWT token must be sent in the Authorization header.

Example:

`Authorization: Bearer YOUR_JWT_TOKEN`

### 5.1 Add a Book to Library

- **Method:** POST
- **Endpoint:** `/api/library`
- **Purpose:** Adds a selected book to the user's personal library.

**Request Body Example:**

```json
{
  "book": {
    "id": "book123",
    "title": "Atomic Habits",
    "authors": ["James Clear"]
  },
  "status": "Want to Read"
}
```

**Success Response:** `201 Created`

Adds the book to the personal library.

### 5.2 Get My Library

- **Method:** GET
- **Endpoint:** `/api/library`
- **Purpose:** Retrieves the authenticated user's saved books.

**Success Response:** `200 OK`

Returns the user's personal library.

### 5.3 Update Reading Status

- **Method:** PATCH
- **Endpoint:** `/api/library/:id`
- **Purpose:** Updates the reading status of a saved book.

**Request Body Example:**

```json
{
  "status": "Currently Reading"
}
```

**Success Response:** `200 OK`

Returns the updated library record.

### 5.4 Update Favourite Status

- **Method:** PATCH
- **Endpoint:** `/api/library/:id/favourite`
- **Purpose:** Adds or removes a book from the user's favourites.

**Request Body Example:**

```json
{
  "isFavourite": true
}
```

**Success Response:** `200 OK`

Updates the favourite status of the selected book.

### 5.5 Remove a Book from Library

- **Method:** DELETE
- **Endpoint:** `/api/library/:id`
- **Purpose:** Removes a saved book from the user's personal library.

**Success Response:** `200 OK`

Returns a success message after removing the book.

## 6. Reading Status Values

The application supports the following reading status values:

- Want to Read
- Currently Reading
- Completed

## 7. HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | OK – Request successful |
| 201 | Created – Resource created |
| 400 | Bad Request – Invalid request |
| 401 | Unauthorized – Authentication required or invalid credentials |
| 404 | Not Found – Resource does not exist |
| 500 | Internal Server Error |
| 502 | Bad Gateway – External service error |
| 504 | Gateway Timeout – External service timeout |

The exact status code depends on the API operation and backend response.

## 8. Authentication and Security

- JWT-based authentication is used for protected routes.
- Personal library routes require a valid authentication token.
- Helmet is used for HTTP security headers.
- CORS is configured for frontend and backend communication.
- Environment variables are used for sensitive configuration.
- Input validation and error handling help manage invalid requests.

## 9. API Testing

The Book Basket backend APIs were tested using Postman.

The testing covered:

- User registration and login.
- Book searching and book details.
- Adding books to the personal library.
- Retrieving saved books.
- Updating reading status.
- Updating favourite status.
- Removing books from the library.
- Invalid input and authentication handling.
- Database persistence.
- Security headers and CORS configuration.

**Testing Result:**

The initial Postman test suite passed all 29 test cases (29/29). Additional API operations and middleware checks were also manually tested after backend refactoring.

The main application functionalities were subsequently tested through the integrated frontend.

## 10. Conclusion

The Book Basket REST APIs provide communication between the frontend and backend. They support user authentication, book discovery, personal library management, reading status updates, and favourite book management.

MongoDB Atlas is used to store application data, while the external Open Library API provides book information.