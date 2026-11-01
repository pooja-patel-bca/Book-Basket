# Book Basket

Book Basket is a full-stack book management web application that helps users discover books, view book details, and manage their personal reading collections.

Users can create an account, search for books, save books to their library, organise them by reading status, and mark their favourite books.

## Features

- User registration and login.
- Search books by title or author.
- View book details, descriptions, and cover images.
- Add books to a personal library.
- View and manage saved books.
- Update reading status.
- Add and remove favourite books.
- Remove books from the personal library.
- Dashboard with reading statistics.
- User profile section.
- Responsive user interface.
- Error handling and form validation.

## Reading Status

- Want to Read
- Currently Reading
- Completed

## Technology Stack

### Frontend
- React.js
- Vite
- HTML
- CSS
- JavaScript
- Axios

### Backend
- Node.js
- Express.js
- Mongoose
- Helmet
- CORS
- JSON Web Token (JWT)

### Database
- MongoDB Atlas

### External API
- Open Library API

### Development Tools
- Visual Studio Code
- Postman
- Git
- GitHub

## Project Structure

```text
Book Basket Project/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── Docs/
│   ├── API_Documentation.md
│   ├── Architecture.md
│   ├── Database.md
│   ├── design.md
│   ├── phase.md
│   ├── PRD.md
│   └── rules.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
│
├── .gitignore
├── CHANGELOG.md
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the Project Folder

Open the project folder in Visual Studio Code.

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Add any other environment variables required by your application.

Start the backend server:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## API Documentation

The backend provides API routes for:

- User registration and authentication.
- Book search and book details.
- Personal library management.
- Reading status updates.
- Favourite book management.

Detailed API information is available in the `Docs/API_Documentation.md` file.

## Testing

The backend APIs were tested using Postman. The initial Postman test suite passed all 29 test cases (29/29).

The application was also tested manually, including:

- User registration and login.
- Book search and book details.
- Adding and removing books.
- Updating reading status.
- Managing favourite books.
- Dashboard statistics.
- User session and saved data.

## Project Status

The frontend and backend development have been completed. The application is connected to MongoDB Atlas and its main features have been tested successfully.

## Future Enhancements

- Reading progress tracking.
- Book ratings and reviews.
- Personalised book recommendations.
- Reading goals and achievements.
- Advanced reading statistics.

## Author

Developed as an academic project using the MERN stack.