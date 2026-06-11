# JobTracker Pro

JobTracker Pro is a full-stack web application that helps job seekers organize their job search in one place. Users can securely track job applications, manage interview notes, prepare with an interview question bank, and review their progress through dashboard charts.

## Live Demo

- Frontend: https://job-tracker-pro-xi.vercel.app/login
- Backend health check: https://jobtracker-pro-api.onrender.com/api/health

The backend is hosted on Render and may take a short time to respond after a period of inactivity.

## Features

- User signup, login, logout, and private data with JWT authentication
- Create, view, edit, and delete job applications
- Search applications by company or job title
- Filter applications by status
- Drag-and-drop Kanban board with Wishlist, Applied, Interview, Offer, and Rejected columns
- Notes for interviews, recruiter contacts, salary details, and follow-up reminders
- Interview question bank with categories and suggested answers
- Dashboard charts for weekly applications, status breakdown, and success rate

## Technology

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Authentication: JSON Web Tokens
- Charts: Recharts
- Drag and drop: dnd-kit
- Deployment: Vercel and Render

## Local Setup

### Prerequisites

- Node.js and npm
- Access to a MongoDB Atlas database

### Backend

1. Open a terminal in the `backend` folder.
2. Install dependencies:

```bash
npm install
```

3. Create a `backend/.env` file:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

4. Start the backend:

```bash
npm run dev
```

5. Confirm that it is working at:

```text
http://localhost:5001/api/health
```

### Frontend

1. Open another terminal in the `frontend` folder.
2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm run dev
```

4. Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

The frontend automatically uses the local API during development and the Render API in production.

## Testing the Deployed App

1. Open the frontend link and create an account or log in.
2. Add, edit, search, filter, and delete a job application.
3. Move a job between Kanban columns and confirm that its status changes.
4. Open the charts tab and confirm that the application data is displayed.
5. Add and delete an interview question in the Question Bank tab.
6. Log out and confirm that protected pages redirect to the login screen.

## Sprint Progress

### Sprint 1

- Set up the repository and project structure
- Initialized the React and Node.js applications
- Added MongoDB and JWT authentication
- Added the project description and team quotes

### Sprint 2

- Completed job application CRUD
- Added notes to job applications
- Connected the frontend to the backend API
- Added automatic job list refresh

### Sprint 3

- Added the drag-and-drop Kanban board
- Added dashboard charts and success-rate statistics
- Connected charts and Kanban status updates to backend data

### Sprint 4

- Added the Interview Question Bank
- Added job search and status filtering
- Configured production API URLs
- Deployed the frontend to Vercel and backend to Render
- Tested authentication, job CRUD, Kanban status updates, and question bank operations locally and in production
