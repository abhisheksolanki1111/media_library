# Secure Media Library App

A secure media library application with role-based access control and file expiry functionality.

## Features

- User authentication with JWT
- Role-based access control (viewer, uploader, admin)
- Media file upload with expiry time
- Automatic file access revocation after expiry
- Admin dashboard for managing expired files
- Responsive UI with React Bootstrap

## Technologies

- Backend: Laravel 9, PHP 8, MySQL
- Frontend: React 18, React Router 6, React Bootstrap
- Authentication: JWT (JSON Web Tokens)

## Installation

### Backend

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Copy `.env.example` to `.env` and configure your database settings
4. Install dependencies: `composer install`
5. Generate application key: `php artisan key:generate`
6. Run migrations: `php artisan migrate`
7. Start the development server: `php artisan serve`

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## API Endpoints

- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user info
- POST `/api/auth/logout` - User logout
- GET `/api/media` - List active media files
- POST `/api/media` - Upload new media (uploader/admin only)
- GET `/api/media/{id}` - Get media file
- DELETE `/api/media/{id}` - Delete media file (admin only)
- GET `/api/media/expired` - List expired media files (admin only)

## Roles

- **Viewer**: Can view active media files
- **Uploader**: Can upload new media files and view active files
- **Admin**: Can upload, view, delete files, and manage expired files