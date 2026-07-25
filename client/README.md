# Lead Management Platform

A lead management application for small sales teams — a public lead capture form plus an authenticated admin/member application for managing leads through their lifecycle.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, React Router, React Toastify
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT

## Project Structure
/client -> React frontend
/server -> Express backend + API


## Setup

**Backend**

cd server
npm install
npm run dev


**Frontend**

cd client
npm install
npm run dev


## Environment Variables (`server/.env`)

PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
MEMBER1_USERNAME=member1
MEMBER1_PASSWORD=member1
MEMBER2_USERNAME=member2
MEMBER2_PASSWORD=member2
MEMBER3_USERNAME=member3
MEMBER3_PASSWORD=member3
JWT_SECRET=<random secret string>


## Roles & Credentials
| Role | Username | Password | Access |
|---|---|---|---|
| Admin | admin | admin | View all leads, assign leads, update status, add notes |
| Member 1 | member1 | member1 | View only assigned leads, update status, add notes |
| Member 2 | member2 | member2 | Same as above |
| Member 3 | member3 | member3 | Same as above |

## Features
- Public lead capture form with client-side validation
- Admin login and Member login with JWT-based authentication
- Role-based authorization enforced on both client and server
- Lead lifecycle: status pipeline (New → Contacted → Qualified → Converted → Lost)
- Lead assignment to team members
- Timestamped notes per lead
- Activity trail logging status changes, assignments, and notes
- Paginated and filterable lead list (admin view)

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/admin-login` | Public | Admin login. Body: `{ username, password }`. Returns `{ token }` |
| POST | `/auth/member-login` | Public | Member login. Body: `{ username, password }`. Returns `{ token, name }` |

### Leads

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/leads` | Public | Submit a new lead. Body: `{ firstName, lastName, company, phone, email, message }` |
| GET | `/leads?page=1&limit=10&status=New&assignedTo=Member 1` | Admin | List leads, paginated and filterable by status/assignedTo |
| GET | `/leads/my-leads` | Member | Get leads assigned to the logged-in member |
| PATCH | `/leads/:id/assign` | Admin | Assign a lead. Body: `{ assignedTo }` |
| PATCH | `/leads/:id/status` | Admin/Member | Update lead status. Body: `{ status }` |
| POST | `/leads/:id/notes` | Admin/Member | Add a note. Body: `{ text }` |

All protected routes require header: `Authorization: Bearer <token>`

### Status Codes
- `200` OK
- `201` Created
- `400` Bad Request (missing/invalid fields)
- `401` Unauthorized (missing/invalid token)
- `403` Forbidden (wrong role)
- `404` Not Found
- `500` Server Error

## Tests

cd server
npm test

Covers: authentication rules (unauthorized access, invalid login), and two core flows (lead creation, lead assignment).

## Deployment
- Backend deployed on: <add your Render URL here>
- Frontend deployed on: <add your Vercel URL here>

## AI Usage
Used Claude (Anthropic) to scaffold Express routes, Mongoose models, JWT authentication middleware, and React components; to debug a MongoDB Atlas connection issue (IP whitelist, DNS SRV resolution, and a system clock/TLS certificate mismatch); and to plan the lead lifecycle features (status, assignment, notes, activity trail) against the task brief.