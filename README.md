# kNow

**Capture curiosity.**

kNow is a personal knowledge management application for capturing what you learn, organizing knowledge into collections, and keeping track of topics you want to research later.

## Features

- User authentication
- Private knowledge entries for each user
- Create, edit, and delete knowledge
- Research Later queue
- Convert completed research into knowledge
- Collections and tags
- Dashboard with learning statistics and weekly goals

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express
- JWT authentication
- bcrypt

### Database
- PostgreSQL

## Architecture

Browser / React  
↓ HTTP API  
Node.js / Express  
↓ SQL  
PostgreSQL

## Running Locally

Start the backend:

```bash
cd server
node index.js