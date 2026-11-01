# UI/UX Design Document

## Project Name: Book Basket

## 1. Introduction

This document describes the user interface and user experience design of Book Basket, a full-stack book management web application.

The application provides a simple and user-friendly interface that allows users to discover books, view book details, manage their personal library, organize reading status, and maintain a collection of favourite books.

The frontend is developed using React.js and Vite.

The design focuses on simplicity, readability, easy navigation, responsive layouts, and consistent user interactions.

## 2. Design Goals

- Create a clean and user-friendly interface.
- Make book searching simple and convenient.
- Display book covers and details clearly.
- Organize saved books in an understandable layout.
- Provide easy navigation between application pages.
- Support desktop and mobile screen sizes.
- Maintain a consistent design across all pages.
- Provide clear feedback for user actions.
- Make registration and login simple.
- Display useful reading statistics on the dashboard.

## 3. Design Theme

Book Basket uses a modern and library-inspired interface.

The design includes a consistent colour scheme, readable typography, organized content sections, and reusable interface elements.

### 3.1 Colour Palette

| Element | Design |
|---|---|
| Primary Colour | Deep Purple |
| Secondary Colour | Soft Lavender |
| Background | Light Grey |
| Card Background | White |
| Main Text | Dark Grey |
| Button Text | White |

### 3.2 Typography

- Use clear and readable fonts.
- Use bold text for important headings.
- Maintain consistent font sizes.
- Ensure sufficient contrast between text and background.
- Use consistent typography throughout the application.

## 4. Main Application Pages

### 4.1 Login Page

The Login page allows registered users to access their Book Basket account.

Main elements:

- Book Basket branding.
- Email address input field.
- Password input field.
- Sign In button.
- Create Account link.
- Input validation and error messages.

### 4.2 Registration Page

The Registration page allows new users to create an account.

Main elements:

- Name input field.
- Email address input field.
- Password input field.
- Confirm Password input field.
- Create Account button.
- Login navigation link.
- Form validation messages.

### 4.3 Dashboard Page

The Dashboard provides an overview of the user's reading library.

Main elements:

- Application navigation.
- Search functionality.
- Welcome section.
- Reading statistics.
- My Library section.
- Favourite Books section.
- Navigation to other application pages.

### 4.4 Explore Books Page

The Explore Books page allows users to search for available books.

Main elements:

- Book search field.
- Search button.
- Search results.
- Book cover images.
- Book titles and author names.
- Book Details navigation.
- Add to Library functionality.

If no matching books are found, an appropriate message is displayed.

### 4.5 Book Details Page

This page displays additional information about a selected book.

Main elements:

- Book cover image.
- Book title.
- Author name.
- Book description, when available.
- Publisher and publication information, when available.
- Add to Library option.

### 4.6 My Library Page

The My Library page displays books saved by the logged-in user.

Main elements:

- Saved book cards.
- Book cover images.
- Book titles and authors.
- Reading status.
- Favourite controls.
- Remove from Library option.

### 4.7 Favourites Page

The Favourites page displays books marked as favourites by the user.

Main elements:

- Favourite book cards.
- Book cover images.
- Book titles and authors.
- View Details option.
- Remove from Favourites option.

### 4.8 Profile Page

The Profile page provides access to the user's account information and logout functionality.

Main elements:

- User account information.
- Profile details.
- Logout option.

## 5. Reading Status Design

The application supports three reading categories:

- Want to Read
- Currently Reading
- Completed

Users can update the reading status of books saved in their personal library.

The selected status is displayed clearly within the library interface.

## 6. Reusable UI Components

The frontend uses reusable React components to maintain consistency and simplify development.

| Component | Purpose |
|---|---|
| Navbar | Provides application navigation |
| SearchBar | Allows users to search for books |
| BookCard | Displays individual book information |
| BookList | Displays multiple books |
| Dashboard Cards | Displays reading statistics |
| Form Inputs | Accepts user information |
| Buttons | Performs application actions |
| Status Controls | Updates reading status |

## 7. Responsive Design

Book Basket is designed to support different screen sizes.

The responsive interface was checked using browser device emulation.

Supported layouts include:

- Desktop screens.
- Tablet screens.
- Mobile screens.

Responsive design considerations include:

- Navigation elements adjust to smaller screens.
- Book cards fit the available screen width.
- Text wraps within available space.
- Input fields and buttons remain accessible.
- Content sections adjust according to screen size.

## 8. User Experience Guidelines

- Keep navigation simple and understandable.
- Display clear messages when no books are found.
- Show success messages after completed actions.
- Display understandable error messages.
- Validate required form fields.
- Provide feedback during user interactions.
- Use consistent buttons, spacing, and layouts.
- Display placeholders when book cover images are unavailable.
- Make important actions easy to identify.
- Protect pages that require authentication.

## 9. Accessibility Considerations

- Use readable font sizes.
- Maintain sufficient colour contrast.
- Provide meaningful alternative text for images.
- Use clear labels for input fields.
- Make interactive elements easy to identify.
- Support keyboard navigation wherever possible.

## 10. Conclusion

The Book Basket user interface focuses on simplicity, readability, and ease of use.

The application includes login, registration, dashboard, book exploration, book details, personal library, favourites, and profile pages.

The responsive interface and consistent design help users manage their personal reading collections conveniently across different screen sizes.