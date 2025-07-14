# MentorMatch Backend

MentorMatch is a mentorship platform backend built with Node.js, Express, and Sequelize. It provides RESTful APIs for user authentication, mentor/mentee matching, session scheduling, feedback, and more. This backend powers the MentorMatch web application, enabling seamless connections between mentors and mentees.

## Features
- User registration and authentication (JWT-based)
- Role-based access: Mentee, Mentor, Admin
- Mentor availability management
- Mentee requests and mentor matching
- Session scheduling and reminders
- Feedback and ratings for both mentors and mentees
- Admin dashboard for user and session management

## Technology Stack
- Node.js
- Express.js
- Sequelize ORM (MySQL)
- JWT Authentication
- Nodemailer (email notifications)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm
- MySQL database (local or cloud, e.g., Railway)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/mentorship-platform-backend.git
   cd mentorship-platform-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_HOST=your_db_host
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=MentorMatch <noreply@example.com>
   ```

### Database Migration
If using Sequelize migrations, run:
```sh
npx sequelize-cli db:migrate
```

### Running the Application
Start the server:
```sh
npm start
```
The server will run on `http://localhost:5000` by default.

## API Endpoints Overview

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/me` — Get current user info
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password

### Users
- `GET /api/users/mentors` — Public mentors directory
- `GET /api/users/me` — Get current user profile

### Availability
- `POST /api/availability` — Set mentor availability
- `GET /api/availability/me` — Get mentor's own availability
- `GET /api/availability/:mentorId` — Get a mentor's availability

### Requests
- `POST /api/requests` — Mentee sends mentorship request
- `GET /api/requests/sent` — Mentee views sent requests
- `GET /api/requests/received` — Mentor views received requests
- `PUT /api/requests/:id` — Mentor updates request status

### Sessions
- `POST /api/sessions` — Book a session
- `GET /api/sessions/mentee` — Mentee views sessions
- `GET /api/sessions/mentor` — Mentor views sessions
- `PUT /api/sessions/:id/feedback` — Submit feedback

### Admin
- `GET /api/admin/users` — List all users
- `PUT /api/admin/users/:id/role` — Update user role
- `DELETE /api/admin/users/:id` — Delete user
- `GET /api/admin/sessions` — List all sessions
- `GET /api/admin/matches` — List all matches
- `POST /api/admin/assign` — Assign mentor to mentee

## Contribution
Contributions are welcome! Please fork the repository and submit a pull request. For major changes, open an issue first to discuss your ideas.

## License
This project is licensed under the MIT License.

## Contact
For questions or support, please contact [yourname](mailto:your.email@example.com).
