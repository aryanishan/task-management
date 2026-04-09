# Node.js Internship Practical - Task Management API

This is a simple server-side application for a Task Management API built using Node.js, Express, and SQL (SQLite). This was developed exactly to match the requirements for the Node.js internship practical interview.

## Features Completed
- [x] Create tasks with title and description.
- [x] View list of all tasks.
- [x] Edit task details.
- [x] Mark tasks as completed.
- [x] Delete tasks.
- [x] Persistence (using SQLite as a simple database option requires 0 setup!).
- [x] Validation prevents empty titles and marks errors gracefully.
- [x] Bonus: Implemented due dates and categories.
- [x] Bonus: Implemented unit tests (Jest & Supertest).

## Code Structure & Decisions

- **SQLite Database**: Instead of MongoDB/MySQL which require a server, I chose SQLite (while writing standard SQL queries). This provides simple, portable zero-configuration persistence perfect for evaluating interview tasks locally without managing database environments.
- **MVC Architecture**: Uses a generic separation of concerns with `models`, `controllers`, and `routes`. This makes the code organized, maintainable, and highly scalable.
- **Jest & SuperTest**: Test suites hit an in-memory SQLite database (`NODE_ENV=test`) ensuring test execution doesn't mutate actual server data and requires no mock setup.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:3000` and automatically create a `database.sqlite` file in the root.*

3. **Run Unit Tests (Bonus)**
   ```bash
   npm test
   ```

## API Endpoints Overview

| Method | Route | Body / Description |
|---|---|---|
| `GET` | `/api/tasks` | Returns list of tasks |
| `POST` | `/api/tasks` | `{ "title": "Required", "description": "", "dueDate": "2026-05-10", "category": "Work" }` |
| `GET` | `/api/tasks/:id` | Returns single task by ID |
| `PUT` | `/api/tasks/:id` | Updates task fields. E.g., `{ "title": "New Title" }` |
| `PATCH` | `/api/tasks/:id/complete` | Marks a task as completed |
| `DELETE` | `/api/tasks/:id` | Removes the task from DB |
