# Supabase Todo List Application

A full-stack todo list application with authentication using React and Supabase.

## Features

### Authentication
- ✅ User Registration (Sign Up)
- ✅ User Login (Sign In)
- ✅ Password Reset
- ✅ Email Verification
- ✅ Protected Routes
- ✅ Logout Functionality

### Todo List
- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Strike-through completed tasks
- ✅ Delete tasks
- ✅ Collapsible completed items section
- ✅ Task counter (pending/completed)
- ✅ User-specific todos (privacy)
- ✅ Real-time updates

### UI/UX
- ✅ Modern, clean interface
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Custom checkboxes
- ✅ Empty state messaging

## Tech Stack

### Frontend (Client)
- React 18
- Supabase Client Library
- Modern CSS with Gradients
- Context API for State Management

### Backend (Server)
- Node.js
- Express.js
- Supabase Admin SDK
- JWT Token Verification
- CORS Support

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

### Running the Application

1. **Start the Client (React App)**
   ```bash
   cd client
   npm start
   ```
   The client will run on http://localhost:3000

2. **Start the Server (Express API)**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on http://localhost:5000

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Email Verification**: Check your email for verification link
3. **Sign In**: Login with your credentials
4. **Dashboard**: View your profile information
5. **Password Reset**: Use "Forgot Password" to reset your password
6. **Sign Out**: Logout from the application

## API Endpoints

- `GET /` - Server status
- `GET /health` - Health check
- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update user profile (protected)
- `GET /api/users` - Get all users (admin only)

## Security Features

- JWT token verification
- Protected API routes
- Environment variables for sensitive data
- CORS configuration
- Input validation

## Folder Structure

```
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main App component
│   │   ├── AuthContext.js # Authentication context
│   │   ├── AuthForm.js    # Login/Signup form
│   │   ├── Dashboard.js   # User dashboard
│   │   ├── supabaseClient.js # Supabase config
│   │   └── index.css      # Styles
│   └── package.json
├── server/                # Express backend
│   ├── server.js          # Main server file
│   ├── .env              # Environment variables
│   └── package.json
└── README.md
```

## Customization

- Modify `client/src/index.css` for styling changes
- Update `AuthForm.js` to add more fields
- Extend `Dashboard.js` with more features
- Add more API endpoints in `server.js`

## Troubleshooting

1. **Email not received**: Check spam folder and ensure email confirmation is enabled in Supabase
2. **CORS errors**: Ensure server is running and CORS is properly configured
3. **Token errors**: Check if tokens are properly set in environment variables

## Support

For issues with Supabase configuration, visit the [Supabase Documentation](https://supabase.com/docs).
