# Silent SOS — Emergency Alert Web Application

A web-based emergency alert system designed to help users discreetly notify their trusted contacts and authorized administrators when they need urgent assistance.

## Project Overview

Silent SOS is a safety-focused web application built around a simple emergency alert workflow. It enables registered users to trigger an SOS alert, share their location, monitor alert status, and review their alert history. Administrators can monitor incoming alerts, acknowledge emergencies, and manage their resolution.

The project aims to provide a clear, accessible, and organized way to manage emergency alerts through a web interface.

## Key Features

### User Features

* User registration and secure login
* Protected user dashboard
* SOS alert activation through a press-and-hold interaction
* Location sharing and location tracking during an alert
* Trusted emergency contact management
* Active alert status monitoring
* Alert history and detailed alert information
* Alert activity timeline and location history
* In-app notifications
* Profile and account settings

### Administrator Features

* Dedicated administrator dashboard
* Overview of total, active, and resolved alerts
* Active and historical alert filtering
* Alert details and activity timeline
* Acknowledge active emergency alerts
* Resolve alerts after appropriate handling
* View registered users

### Security Features

* Password hashing
* JWT-based authentication
* Role-based access control
* Protected frontend routes
* Server-side authorization checks
* Environment-based configuration
* Rate limiting and HTTP security middleware

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios
* React Icons
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcryptjs
* Helmet
* express-rate-limit

### Development Tools

* ESLint
* Nodemon
* Git and GitHub

## Project Structure

```text
silent-sos/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── contacts/
│   │   │   └── sos/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Prerequisites

Install the following before running the application:

* Node.js and npm
* MongoDB Atlas account or a compatible MongoDB instance
* Git (optional, for version control)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd silent-sos
```

If you already have the project locally, open a terminal in the project directory.

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the placeholder values with your own configuration. Never commit the real `.env` file or expose database credentials.

### 3. Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend should start on the configured port. Verify its health endpoint at:

`http://localhost:5000/api/health`

### 4. Configure the Frontend

Open a separate terminal:

```bash
cd client
npm install
```

Configure the frontend API base URL according to the existing API configuration in the project. For local development, the backend typically runs at `http://localhost:5000`.

### 5. Start the Frontend

From the `client` directory:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Available Development Checks

Run backend linting from the `server` directory:

```bash
npm run lint
```

Run frontend linting from the `client` directory:

```bash
npm run lint
```

Create a production frontend build:

```bash
npm run build
```

## Emergency Alert Workflow

1. A user registers or logs in.
2. The user configures trusted contacts and grants location permission when prompted.
3. The user activates the SOS alert.
4. The application creates the alert and shares available location information.
5. The administrator reviews and acknowledges the alert.
6. The administrator resolves the alert after handling it.
7. The user can review alert status, history, location records, and the activity timeline.

## Current Scope and Limitations

* Silent SOS is currently a web application, not a native Android or iOS application.
* Location accuracy depends on the device, browser, permissions, and available location signals.
* In-app notification records are supported; actual SMS and email delivery must not be assumed.
* Direct integration with police, ambulance services, or other emergency agencies is not included in the current scope.
* The application should not be treated as a replacement for official emergency services.
* Production deployment requires additional security, reliability, privacy, and operational testing.

## Security and Privacy Notes

* Keep database credentials and JWT secrets private.
* Do not upload `.env` files or `node_modules` to version control.
* Request location access only when needed and explain its purpose to users.
* Protect emergency contact information and location records.
* Use HTTPS and secure deployment configuration in production.
* Test authorization rules before exposing administrator functionality publicly.

## Project Status

The core user and administrator workflows have been implemented and tested in the local development environment. Backend linting and frontend lint/build checks have passed during development.

Production readiness, real-world emergency response reliability, and third-party notification delivery require separate verification.

## Future Enhancements

Potential future improvements include:

* SMS and email notification integrations
* Additional emergency contact delivery options
* Deployment monitoring and audit reporting
* Further accessibility and mobile-browser testing
* Production security and load testing

## License

Add a license appropriate to your distribution plans before publishing the repository.
