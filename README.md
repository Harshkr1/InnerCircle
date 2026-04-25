# InnerCircle - Full Stack Social Media Platform

InnerCircle is a full-stack social media web application where users can create, share, and manage posts within a private community. It includes authentication, membership-based content visibility, and a modern responsive UI inspired by platforms like Reddit.

**Live Demo:** https://innercircle-r6cn.onrender.com/

---

## Overview

InnerCircle is built using Node.js, Express, PostgreSQL, and Passport.js. It demonstrates real-world backend concepts such as session management, authentication flows, database design, and scalable architecture.

This project is ideal for showcasing full-stack development skills, especially for software engineering roles.

---

## Features

### Authentication and Security

- User signup and login system
- Password hashing using bcrypt
- Session-based authentication using Passport.js
- Persistent sessions stored in PostgreSQL (connect-pg-simple)
- Flash-based error handling for login failures

### Message Posting System

- Create, update, and delete posts
- Ownership-based access control (only creators can edit/delete)
- Dynamic feed rendering
- Clean UI with reusable components

### Membership System

- Users can upgrade to "Elite" via a challenge
- Elite members can view:
  - Author username
  - Post timestamps
- Regular users see restricted content

### UI and User Experience

- Fully responsive design using Tailwind CSS
- Social media-style grid layout (Reddit-inspired)
- Mobile-first responsive navbar
- Clean and modern interface

### Backend Architecture

- MVC pattern (Controllers, Routers, Database layer)
- Modular route handling
- Middleware-based authentication
- Separation of concerns for scalability

### Request Handling Optimization

- Implements POST → Redirect → GET (PRG pattern)
- Prevents duplicate form submissions on refresh
- Improves user experience and data consistency

---

## Tech Stack

- Frontend: EJS, Tailwind CSS
- Backend: Node.js, Express.js
- Authentication: Passport.js (Local Strategy)
- Database: PostgreSQL
- Session Store: connect-pg-simple
- Validation: express-validator

---

## Project Structure

```
InnerCircle/
├── controller/
├── routers/
├── db/
├── views/
├── public/
├── app.js
├── package.json
```

---

## Environment Variables

Create a `.env` file in the root directory:

```
DEVELOPMENT_DATABASE_URL=postgresql://user:password@localhost:5432/innercircle
PRODUCTION_DATABASE_URL=your_production_database_url
SESSION_SECRET=your_secret_key
```

---

## Installation

Clone the repository and install dependencies:

```
git clone https://github.com/your-username/InnerCircle.git

cd InnerCircle
npm install
```

## Running the Application

Start the server:

```
npm start
```

The application will run on:

```
http://localhost:3000
```

---

## Database Setup

Run the database initialization script:

node db/populatedb.js LOCAL_DATABASE

This will:

- Create required tables (users, messages)
- Insert sample data for testing

---

## Key Concepts Implemented

- Session-based authentication using Passport.js
- Secure password storage with bcrypt
- Flash messages for error handling
- PostgreSQL-backed session storage
- Middleware-driven route protection
- PRG pattern to prevent duplicate submissions
- Modular backend architecture (MVC)
- Responsive frontend using Tailwind CSS

---

## Future Improvements

- Add likes and comments system
- Implement real-time updates (WebSockets)
- User profile pages
- Image upload support
- REST API for mobile integration

---

## Author

Harsh Kumar

---

## License

This project is open-source and available under the MIT License
