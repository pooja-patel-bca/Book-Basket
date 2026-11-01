# Project Rules and Development Guidelines

## Project Name: Book Basket

## 1. Introduction

This document defines the coding standards, development guidelines, and basic rules followed during the development of Book Basket.

These guidelines help maintain code quality, security, consistency, and proper project organization.

## 2. General Development Rules

- Keep project folders properly organized.
- Use meaningful names for files, variables, and functions.
- Write clean, readable, and maintainable code.
- Avoid unnecessary code duplication.
- Follow a consistent coding style.
- Test features after implementation.
- Update project documentation whenever necessary.
- Use appropriate comments wherever clarification is needed.

## 3. Frontend Development Rules

- Use React.js with Vite for building the user interface.
- Divide the interface into reusable components.
- Organize frontend files into suitable folders.
- Use meaningful component and variable names.
- Keep API communication separate from UI components where practical.
- Display suitable loading and error messages.
- Show clear messages for empty search results.
- Validate required form inputs.
- Make the interface responsive for desktop, tablet, and mobile screens.
- Maintain consistent colours, fonts, spacing, and layouts.
- Protect pages that require user authentication.

## 4. Backend Development Rules

- Use Node.js and Express.js.
- Follow an MVC-style architecture.
- Keep database configuration, models, controllers, routes, and middleware organized.
- Follow REST API conventions.
- Use appropriate HTTP status codes.
- Validate incoming request data.
- Handle errors in asynchronous controller operations.
- Use middleware for authentication, security, and request handling.
- Do not expose database credentials or sensitive configuration.
- Ensure that users can access only their own protected library data.

## 5. Database Rules

- Use MongoDB Atlas for database storage.
- Use Mongoose to define schemas and interact with MongoDB.
- Store user information in the user collection.
- Store personal library records separately.
- Associate each library record with its respective user.
- Keep the book information object required in library records.
- Use only the supported reading statuses:
  - Want to Read
  - Currently Reading
  - Completed
- Use a Boolean field to identify favourite books.
- Set the default reading status to Want to Read.
- Set the default favourite value to false.
- Store creation and update timestamps.
- Prevent duplicate book entries for the same user using the configured unique index.

## 6. API Development Rules

- Use clear and consistent API endpoint names.
- Return data in JSON format.
- Use GET for retrieving data.
- Use POST for creating data.
- Use PATCH for updating specific fields.
- Use DELETE for deleting data.
- Validate request data before database operations.
- Validate MongoDB document IDs before ID-based operations.
- Return meaningful error messages and appropriate status codes.
- Keep route definitions separate from controller logic.
- Protect personal library routes using authentication middleware.

## 7. External API Rules

- Use the Open Library API for book searches and available book information.
- Encode search terms before sending API requests.
- Handle unavailable services and failed requests.
- Set a reasonable timeout for external API requests.
- Display a placeholder when a book cover is unavailable.
- Do not assume every search result contains complete book information.
- Handle external API responses safely before displaying information.

## 8. Security Rules

- Store sensitive configuration in the `.env` file.
- Never upload `.env` or database credentials to GitHub.
- Keep `node_modules` out of version control.
- Validate user input before database operations.
- Use JWT-based authentication for protected operations.
- Use Helmet to configure HTTP security headers.
- Configure allowed frontend origins appropriately using CORS.
- Avoid exposing internal error details to users.
- Use environment variables for database connection settings and server configuration.
- Ensure that protected data is accessible only to authenticated users.

## 9. Testing Rules

- Test API endpoints using Postman.
- Check successful and unsuccessful requests.
- Test missing and invalid inputs.
- Verify registration and login functionality.
- Check authentication and protected routes.
- Verify that saved data remains available after refreshing the application.
- Test database operations such as adding, retrieving, updating, and deleting library records.
- Test reading status and favourite functionality.
- Test external API search functionality.
- Verify frontend and backend integration.
- Check responsive layouts on different screen sizes.
- Record testing results for future reference.

## 10. Git and Documentation Rules

- Use meaningful commit messages.
- Keep project documentation updated.
- Do not commit temporary files or sensitive information.
- Maintain a clear project folder structure.
- Keep README.md and CHANGELOG.md updated.
- Review changes before pushing them to GitHub.
- Use `.gitignore` to exclude unnecessary files and folders.
- Verify that environment files are not included in version control.

## 11. Conclusion

Following these rules helps maintain code quality, security, consistency, and proper organization throughout the development of Book Basket.

These guidelines also make the application easier to maintain, test, and improve in future versions.