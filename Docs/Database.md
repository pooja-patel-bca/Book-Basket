# Database Design Document

## Project Name: Book Basket

## 1. Introduction

This document describes the database design and data organization used in the Book Basket application.

MongoDB Atlas is used as the cloud database, and Mongoose is used as the Object Data Modeling (ODM) library to define models and perform database operations.

The database stores user information and personal library records, including saved book details, reading status, and favourite status.

## 2. Database Details

| Item | Details |
|---|---|
| Database | MongoDB Atlas |
| Database Name | BookBasket |
| Database Technology | MongoDB |
| ODM | Mongoose |
| Data Format | BSON |

## 3. Database Collections

The Book Basket application uses the following main collections:

| Collection | Purpose |
|---|---|
| users | Stores user account information |
| libraries | Stores users' personal library records |

MongoDB collection names are generated from Mongoose model names according to Mongoose collection naming conventions.

## 4. User Collection

The User model manages user account information required for registration and login.

The collection is used for:

- Creating new user accounts.
- Storing user account information.
- Authenticating registered users.
- Supporting user-specific access to protected features.

The exact fields and validation rules are defined in the application's User model.

## 5. Library Collection

The Library model stores books added by users to their personal libraries.

Each document represents one book saved by a particular user.

### 5.1 Library Schema

| Field | Data Type | Description |
|---|---|---|
| _id | ObjectId | Unique MongoDB-generated ID |
| user | ObjectId | Reference to the User model; required |
| book | Mixed | Stores book information; required |
| status | String | Reading status; default is Want to Read |
| isFavourite | Boolean | Indicates whether the book is a favourite; default is false |
| createdAt | Date | Record creation time |
| updatedAt | Date | Last update time |

The `createdAt` and `updatedAt` fields are automatically maintained through Mongoose timestamps.

### 5.2 Reading Status Values

Each library record supports the following reading statuses:

1. Want to Read
2. Currently Reading
3. Completed

The default reading status is **Want to Read**.

### 5.3 Favourite Status

The `isFavourite` field stores the favourite status of a book.

- `true` – The book is marked as a favourite.
- `false` – The book is not marked as a favourite.

The default value is `false`.

## 6. Sample Library Document

The following is an illustrative example of a document stored in the libraries collection.

```json
{
  "_id": "MongoDB-generated-id",
  "user": "User-reference-id",
  "book": {
    "id": "book123",
    "title": "Atomic Habits",
    "authors": ["James Clear"],
    "description": "A book about building good habits."
  },
  "status": "Want to Read",
  "isFavourite": false,
  "createdAt": "2026-10-29T10:00:00.000Z",
  "updatedAt": "2026-10-29T10:00:00.000Z"
}
```

Note: The above document is an illustrative example. Actual book fields depend on the information received from the external book API.

## 7. Database Relationships

The application maintains a relationship between users and their library records.

- One user can have multiple library records.
- Each library record belongs to one user.
- The `user` field references the User model.
- The book information is stored inside the `book` field.

### Relationship Representation

```text
        USER
          |
          |
          | One-to-Many
          |
          v
       LIBRARY
          |
          |
          v
     BOOK INFORMATION
```

The Library model also defines a compound unique index on the user and book ID fields to prevent the same book from being added more than once by the same user.

## 8. Database Operations

The application performs the following operations using Mongoose:

- **Create:** Adds a book to the user's personal library.
- **Read:** Retrieves the authenticated user's saved books.
- **Update:** Changes reading status and favourite status.
- **Delete:** Removes a book from the user's personal library.

User registration and login operations also interact with the database.

## 9. Database Connection

The backend connects to MongoDB Atlas using a connection string stored in the `.env` file.

The database connection is managed through:

`backend/config/db.js`

The connection is established when the backend server starts.

Database credentials and other sensitive environment variables must remain private and should never be uploaded to GitHub.

## 10. Data Validation and Constraints

The Library model applies the following rules:

- User reference is required.
- Book information is required.
- Reading status must be one of the supported values.
- Favourite status is a Boolean value.
- Reading status defaults to Want to Read.
- Favourite status defaults to false.
- Duplicate book entries for the same user are restricted through a compound unique index.

Additional validation rules for user information are defined in the User model.

## 11. Conclusion

MongoDB Atlas provides flexible and reliable data storage for the Book Basket application.

Mongoose models help organize user accounts and personal library records. The database structure supports user authentication, book collection management, reading status updates, and favourite book functionality.

This database design provides a foundation for maintaining and extending the Book Basket application in the future.