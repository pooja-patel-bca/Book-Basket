# Product Requirements Document (PRD)

## Project Name: Book Basket

## 1. Introduction

Book Basket is a full-stack book management web application designed to help users discover books and organize their personal reading collections.

Users can create an account, log in, search for books, view book details, save books to their personal library, update reading status, and manage favourite books.

The application uses the Open Library API to retrieve book information and MongoDB Atlas to store user and library data. The frontend is developed using React.js and Vite, while the backend uses Node.js, Express.js, and Mongoose.

## 2. Problem Statement

Readers often find it difficult to maintain a proper record of the books they want to read, are currently reading, or have completed.

Searching for book details, remembering reading progress, and managing favourite books can also become inconvenient.

Book Basket addresses these problems by providing a single platform where users can discover books and manage their personal reading collections.

## 3. Project Objectives

- Provide an easy way to search for books.
- Display available book covers and information.
- Allow users to create accounts and log in securely.
- Allow users to save books to their personal library.
- Organize books according to reading status.
- Allow users to manage favourite books.
- Provide a dashboard with reading statistics.
- Allow users to view their profile.
- Store user and library information in MongoDB Atlas.
- Provide a responsive and user-friendly interface.

## 4. Target Users

Book Basket is intended for:

- Students who enjoy reading books.
- Readers who want to organize their reading lists.
- People who want to track their reading progress.
- Users who want to maintain a digital collection of books.

## 5. Project Scope

### 5.1 Included Features

1. **User Registration:** New users can create an account.
2. **User Login:** Registered users can log in to the application.
3. **Book Search:** Users can search for books using the search feature.
4. **Book Information:** The application displays available book titles, authors, descriptions, and other details.
5. **Book Covers:** Available cover images are retrieved through Open Library.
6. **Personal Library:** Logged-in users can save books to their own library.
7. **Reading Status:** Saved books can be organized into:
   - Want to Read
   - Currently Reading
   - Completed
8. **Favourite Books:** Users can add books to or remove books from their favourites.
9. **Book Management:** Users can retrieve, update, and remove saved books.
10. **Dashboard:** Users can view an overview of their reading library and statistics.
11. **Profile:** Users can access their account information and logout option.
12. **Database Storage:** User and library information is stored in MongoDB Atlas.
13. **Input Validation:** The application validates required inputs.
14. **Error Handling:** Appropriate messages are displayed when an operation fails.
15. **Responsive Interface:** The application supports desktop, tablet, and mobile layouts.

### 5.2 Out of Scope

The following features are not included in the current project version:

- Online book purchasing.
- Online payments.
- Book delivery services.
- Social networking and user discussions.
- Book ratings and reviews.
- Advanced AI-based book recommendations.
- Online reading of complete books.

## 6. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | The system should allow users to register. |
| FR-02 | The system should allow registered users to log in. |
| FR-03 | The system should protect pages that require authentication. |
| FR-04 | The system should allow users to search for books. |
| FR-05 | The system should retrieve book information from Open Library. |
| FR-06 | The system should display available book cover images and details. |
| FR-07 | The system should allow users to save books to their personal library. |
| FR-08 | The system should retrieve and display saved books. |
| FR-09 | The system should allow users to update reading status. |
| FR-10 | The system should allow users to add or remove favourite books. |
| FR-11 | The system should allow users to remove books from their library. |
| FR-12 | The system should display reading statistics on the dashboard. |
| FR-13 | The system should provide access to user profile information. |
| FR-14 | The system should store user and library data in MongoDB Atlas. |
| FR-15 | The system should validate user inputs and handle errors. |
| FR-16 | The system should allow users to log out. |

## 7. Non-Functional Requirements

- **Usability:** The application should have a simple and understandable interface.
- **Performance:** Book searches and database operations should respond within a reasonable time.
- **Reliability:** The system should handle errors during API requests and database operations.
- **Data Validation:** Required fields and invalid inputs should be handled properly.
- **Maintainability:** The application should use a structured and organized codebase.
- **Responsiveness:** The interface should adjust to desktop, tablet, and mobile screens.
- **Security:** Authentication and protected routes should prevent unauthorized access.
- **Data Protection:** Database credentials and environment variables should not be exposed publicly.

## 8. Technology Stack

| Technology | Purpose |
|---|---|
| HTML | Web page structure |
| CSS | Styling and layout |
| JavaScript | Application functionality |
| React.js | Frontend development |
| Vite | Frontend development environment |
| Node.js | Backend runtime |
| Express.js | Backend API development |
| MongoDB Atlas | Database storage |
| Mongoose | Database modelling and operations |
| Open Library API | Book search and information |
| Axios | HTTP communication |
| JWT | User authentication |
| Helmet | Backend security headers |
| CORS | Cross-origin request configuration |
| Postman | API testing |
| Visual Studio Code | Code development |
| Git and GitHub | Version control and project hosting |

## 9. System Workflow

1. The user opens the Book Basket application.
2. A new user registers or an existing user logs in.
3. The application verifies the user's authentication.
4. The user accesses the dashboard and available application pages.
5. The user enters a book title or search term.
6. The frontend sends a request to the backend.
7. The backend retrieves matching book information through Open Library.
8. The application displays available book details and cover images.
9. The user selects a book and adds it to their personal library.
10. The backend stores the library information in MongoDB Atlas.
11. The user can update the book's reading status.
12. The user can add books to or remove books from favourites.
13. The dashboard displays an overview of the user's reading collection.
14. The user can access their profile and log out.

## 10. Expected Outcome

The expected outcome is a functional full-stack book management application that allows users to search for books, view book information, and maintain a personal reading library.

Book Basket provides registration, login, book exploration, library management, reading status updates, favourites, dashboard statistics, and profile functionality.

The frontend and backend have been integrated, and the main application features have been tested.

## 11. Future Enhancements

The following features may be considered for future versions:

- Book ratings and reviews.
- Personalized book recommendations.
- Reading goals and achievements.
- Advanced reading statistics.
- Additional book filtering and sorting options.
- Improved reading progress tracking.

## 12. Conclusion

Book Basket provides a convenient platform for discovering books and organizing personal reading collections.

By integrating React.js, Node.js, Express.js, MongoDB Atlas, and the Open Library API, the application combines book discovery with personal library management.

The completed application provides a simple and responsive user experience and can be extended with additional features in future versions.