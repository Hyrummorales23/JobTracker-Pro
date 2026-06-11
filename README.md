# JobTracker Pro

JobTracker Pro is a full-stack web application designed to help job seekers organize their job search in one place. Users will be able to track applications, manage interview notes, prepare with an interview question bank, and review job-search progress through dashboard charts.

## Project Goals

- Keep each user's job application data private and secure.
- Allow users to add, view, edit, and delete job applications.
- Organize applications by status with a Kanban board.
- Store notes for interviews, recruiter contacts, salary details, and follow-up reminders.
- Help users practice with saved technical and behavioral interview questions.
- Show progress with charts for weekly applications, success rate, and status breakdown.

## Planned Tech Stack

- Frontend: React with Vite
- Backend: Node.js and Express
- Database: MongoDB Atlas
- Authentication: JSON Web Tokens
- Styling: Tailwind CSS
- Charts: Recharts or Chart.js
- Version control: Git and GitHub

## Sprint 1 Focus

The first sprint focuses on project setup, repository structure, initial React and Node.js setup, MongoDB connection planning, basic authentication work, and README updates.

## Team Quotes

- "The best way to predict the future is to create it." - Peter Drucker
- "First, solve the problem. Then, write the code." - John Johnson
- "Success is the sum of small efforts, repeated day in and day out." - Robert Collier

## Sprint 2 Progress (Week 4)

### Completed Features
- ✅ User Authentication (Signup/Login with JWT)
- ✅ Password Hashing with bcrypt
- ✅ Full Job CRUD (Create, Read, Update, Delete)
- ✅ Notes per application
- ✅ MongoDB Atlas integration
- ✅ Responsive Dashboard with JobForm and JobList

### Sprint 2 Tasks Completed
- Created Job model and API routes
- Built functional JobForm, JobList, and JobCard components
- Connected frontend to backend with Axios
- Implemented auto-refresh after adding jobs

## Sprint 3 Progress (Week 5)

### Completed Features
- ✅ Kanban Board with drag-and-drop functionality
- ✅ Dashboard Charts (applications per week, status breakdown)
- ✅ Job status updates via drag-and-drop
- ✅ Visual data representation with Recharts

### Sprint 3 Tasks Completed
- Installed react-beautiful-dnd and recharts
- Created KanbanBoard component with draggable job cards
- Implemented drag-and-drop to update job status in database
- Added BarChart and PieChart components
- Connected charts to backend data

## Live Demo

- **Frontend:** https://job-tracker-pro-xi.vercel.app/login
- **Backend API:** https://jobtracker-pro-api.onrender.com/api/health

## Deployment

This app is deployed on:
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas