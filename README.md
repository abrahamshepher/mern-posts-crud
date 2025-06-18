# MERN Posts CRUD Application

A full-stack blog application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, post management, and commenting system.

## Features

- 🔐 **User Authentication**: Register, login, email verification, and password reset
- 📝 **Post Management**: Create, read, update, and delete blog posts
- 💬 **Comments System**: Add and manage comments on posts
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔒 **Security**: JWT authentication, rate limiting, and input validation
- 📚 **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Axios** for API calls
- **React Query** for state management
- **React Hot Toast** for notifications

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email functionality
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **Rate limiting** for API protection
- **Swagger** for API documentation

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-posts-crud
```

### 2. Set Up Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (for email verification and password reset)
SMTP_HOST=smtp.gmail.com
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Server Configuration
PORT=4000
NODE_ENV=development
```

**Note**: For Gmail, you'll need to use an App Password instead of your regular password. Enable 2-factor authentication and generate an App Password in your Google Account settings.

### 3. Install Dependencies

#### Backend Dependencies

```bash
cd server
npm install
```

#### Frontend Dependencies

```bash
cd ../client
npm install
```

## Running the Application

### Development Mode

#### 1. Start the Backend Server

```bash
cd server
npm run server
```

The server will start on `http://localhost:4000`

#### 2. Start the Frontend Development Server

In a new terminal:

```bash
cd client
npm run dev
```

The React application will start on `http://localhost:5173`

### Production Mode

#### Build the Frontend

```bash
cd client
npm run build
```

#### Start the Production Server

```bash
cd server
npm start
```

## API Documentation

Once the server is running, you can access the API documentation at:

```
http://localhost:4000/api-docs
```

This provides interactive documentation for all available endpoints.

## Available Scripts

### Backend (server directory)

- `npm start` - Start the production server
- `npm run server` - Start the development server with nodemon

### Frontend (client directory)

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Project Structure

```
mern-posts-crud/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/           # Utility functions
│   │   └── main.tsx       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── validations/      # Input validation
│   └── server.js         # Entry point
└── README.md
```

## Features Overview

### Authentication

- User registration with email verification
- Login with JWT tokens
- Password reset functionality
- Protected routes

### Posts

- Create, read, update, and delete posts
- Rich text content
- Author attribution
- Timestamps

### Comments

- Add comments to posts
- Nested comment structure
- User attribution

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running locally or your Atlas connection string is correct
   - Check if the MONGODB_URI environment variable is set

2. **Email Not Working**

   - Verify your SMTP credentials
   - For Gmail, use App Passwords instead of regular passwords
   - Check if 2-factor authentication is enabled

3. **Port Already in Use**

   - Change the PORT in the .env file
   - Kill processes using the default ports

4. **CORS Errors**
   - Ensure the frontend URL is in the allowedOrigins array in server.js
   - Check if both servers are running on the correct ports

### Getting Help

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the API documentation at `/api-docs`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
