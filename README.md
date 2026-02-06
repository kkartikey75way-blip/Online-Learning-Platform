# 📘 Online Learning Platform with Progress Tracking

**Author:** Kartikey Srivastava  
**Tech Stack:** MERN (MongoDB, Express, React, Node.js) + TypeScript  
**Project Type:** Full-Stack Learning Management System (LMS)

---

## 📌 Project Overview

The Online Learning Platform is a full-stack educational system where instructors can create structured courses and students can enroll, learn, and track their progress.  
The platform is designed with scalability, role-based access, and real-world data integrity in mind.

### Use Cases
- Corporate training programs  
- Online skill development platforms  
- University course supplements  

---

## ✨ Features Implemented

### 👨‍🏫 Instructor Features
- Create, update, publish, and delete courses  
- Organize courses into modules and lessons  
- Set enrollment capacity limits  
- Enable drip content (structure ready)  
- Create assignments and quizzes  
- View student enrollment and progress data  

### 👨‍🎓 Student Features
- Enroll in published courses  
- Access structured lessons  
- Submit assignments and attempt quizzes  
- Track progress with completion percentage  
- Get AI-based video recommendations per lesson  

### 📊 Progress Tracking
- Progress initialized automatically on enrollment  
- Lesson-level completion tracking  
- Real-time progress percentage calculation  
- Defensive handling of deleted or orphaned data  

### 🤖 AI-Assisted Learning
- AI-generated YouTube video recommendations  
- Graceful fallback when AI services are unavailable  
- AI is treated as an enhancement, not a dependency  

### 🧹 Data Integrity & Safety
- Full cascade deletion of course-related data  
- Orphan reference handling after deletions  
- Role-based authorization (Instructor / Student)  

---

## 🏗️ System Architecture

Frontend (React)  
⬇  
Backend (Node.js + Express + TypeScript)  
⬇  
MongoDB (Mongoose ODM)

---

## 📂 Project Structure

Online-Learning-Platform  
├── online-learning-backend  
│   ├── src  
│   │   ├── controllers  
│   │   ├── models  
│   │   ├── routes  
│   │   ├── middleware  
│   │   ├── services  
│   │   ├── types  
│   │   ├── app.ts  
│   │   └── server.ts  
│  
├── online-learning-frontend  
│   ├── src  
│   │   ├── pages  
│   │   ├── components  
│   │   ├── services  
│   │   └── router  

---

## 🔐 Authentication & Authorization

- JWT-based authentication  
- Role-based access control  
  - INSTRUCTOR → course creation & management  
  - STUDENT → enrollment & learning  
- Protected routes using middleware  

---

## 🧪 API Highlights

- Courses: `/api/courses`  
- Modules: `/api/modules/course/:courseId`  
- Lessons: `/api/lessons/module/:moduleId`  
- Enrollment: `/api/courses/:id/enroll`  
- Progress: `/api/progress/user/:userId`  
- Assignments: `/api/assignments`  
- Quizzes: `/api/quizzes`  
- Certificates: `/api/certificates`  
- AI Videos: `/api/ai/videos?heading=LessonTitle`  

---

## ⚙️ Setup Instructions

### Clone Repository
```bash
git clone https://github.com/kkartikey75way-blip/Online-Learning-Platform.git
cd Online-Learning-Platform
```
## Backend Setup
cd online-learning-backend
npm install
npm run dev


Create .env :-
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=optional_ai_key

## Frontend Setup
cd online-learning-frontend
npm install
npm run dev


