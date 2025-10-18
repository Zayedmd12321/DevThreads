# DevThreads — Nested Commenting System  
### Inter IIT Tech 14.0 Dev Team Selection Task  

A fully functional **nested commenting system** built using the **MERN stack**, supporting authentication, threaded replies, upvotes, sorting, and admin privileges — all wrapped in a clean, responsive, and interactive UI.  
The project is **Dockerized**, with the **backend hosted on Railway** and the **frontend deployed on Vercel**.

---

## Live Links  

- **Frontend (Vercel):** [https://devthreads-web.vercel.app](https://devthreads-web.vercel.app)  
- **Backend (Railway):** [https://devthreads-api.up.railway.app](https://devthreads-api.up.railway.app)  
- **GitHub Repository:** [https://github.com/Zayedmd12321/DevThreads](https://github.com/Zayedmd12321/DevThreads)

---

## Features  

### Core Features  
- Display a **single post/article** with nested comments.  
- **Multi-level threaded replies** — each comment can have replies recursively. 
- **Focused Thread View** if there are more replies the screen caannot handle. 
- **Upvote system** for ranking popular comments.  
- **Collapsible threads** for cleaner navigation.
- **Reply or Post** a comment which gets stored in Database.  
- **Sorting Comments** based on recents, popular & oldest.
- **Upvote** gets stored in Database. 
- **Responsive UI** for desktop, tablet, and mobile.  

### Authentication  
- Basic login page with **user id auth**.  
- JWT-based secure session handling.  
- Restricted access to the main comment interface.  

### Backend Functionality (Optional Task Completed)  
- RESTful API built with **Express.js** and **MongoDB**.  
- Models for **User** and **Comment** with proper schema relations.  
- API endpoints for CRUD operations on comments, authentication, and upvotes.  

### Dockerization & Deployment  
- Application containerized using **Docker**.  
- **Backend hosted on Railway** with MongoDB Atlas connection.  
- **Frontend deployed on Vercel** for production-ready performance.  

### Bonus Features  
- **Sorting options**: Sort comments by most upvoted, most replies, or newest.  
- **Admin privileges**: Admins can delete any comment.  
- **User Actions**: User can delete their own comment.
- Intuitive nested indentation and collapsible design for deep threads.  

---

## Tech Stack  

| Layer | Technology |
|:------|:------------|
| **Frontend** | Next JS, TailwindCSS, TypeScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Auth** | JWT-based authentication |
| **Containerization** | Docker |
| **Deployment** | Frontend: Vercel · Backend: Railway |

---

## Setup Instructions  

### Prerequisites  
Make sure you have installed:  
- Node.js (v18 or above)  
- Docker (latest version)  
- MongoDB Atlas account (for cloud database)  

---

### Backend Setup  

```bash
# Clone the repository
git clone https://github.com/Zayedmd12321/DevThreads.git
cd DevThreads/backend

# Create .env file
touch .env
```

Add the following environment variables in `.env`:

```env
MONGODB_URI = mongodb+srv://zayedmd12321:zayedZAYED12321@devthreads.7u6tkwd.mongodb.net/?retryWrites=true&w=majority&appName=DevThreads
JWT_SECRET = zayedZAYED12321
FRONTEND_URL = http://localhost:3000
```

Then run:

```bash
npm install
npm start
```

The backend will run on `http://localhost:8000`.

---

### Frontend Setup  

```bash
cd ../frontend
npm install
npm run dev
```

Add the following environment variables in `.env`:

```env
NEXT_PUBLIC_BACKEND_URL = http://localhost:8000/api
```

The frontend will run on `http://localhost:3000`.

---

### Docker Setup  

To build and run the entire application in Docker:

```bash
docker-compose up --build
```

This will spin up both backend and frontend containers.

---

## API Endpoints  

| Method | Endpoint | Description |
|:--------|:----------|:-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/comments` | Fetch all comments |
| `POST` | `/api/comments` | Add new comment |
| `PUT` | `/api/comments/:id/upvote` | Upvote a comment |
| `DELETE` | `/api/comments/:id` | Delete comment (Admin only) |

---

## Approach  

- Designed a recursive UI component to display nested comments efficiently.  
- Implemented lazy rendering to handle deeply nested structures.  
- Used context/state management to maintain comment tree structure dynamically.    
- Ensured backend scalability and secure authentication using **JWT**.  
- Containerized both frontend and backend for easy deployment and reproducibility.  

---

## Author  

**Zayed**  
Inter IIT Tech Meet 14.0 — Dev Team Selection Task Submission  
[eagle.zayed@gmail.com](mailto:zayedmd12321@gmail.com)  
[GitHub Profile](https://github.com/Zayedmd12321)

---
