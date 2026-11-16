# Study Session Finder

A small web app that helps students find classmates in the same course who are free at the same times. A student creates an account, adds a course with their name, availability, and an optional contact, and everyone can search the list to find people to study with.

Built for CS 396 with Node.js, Express, and SQLite.

## Quickstart

**Requirements:** [Node.js](https://nodejs.org) 18 or newer.

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Load sample data
node seed.js

# 3. Start the server
node server.js
```

Then open <http://localhost:3000>.

The SQLite database file (`study.db`) is created automatically the first time the server starts.

**Useful commands**

| Command | What it does |
|---|---|
| `node seed.js` | Adds sample sessions if the table is empty |
| `node seed.js --reset` | Clears all sessions, then adds the sample data again |

To start completely fresh, stop the server and delete `study.db`.

## Using the app

1. Open the home page to see the list of study sessions. Type in the search box to filter by course or student name.
2. Click **Log in** in the top corner, then choose **Create account** (username plus a password of 6 or more characters).
3. Fill in the form with a course, your name, your availability, and an optional contact, then submit.
4. Your session appears at the top of the list. Adding a session while logged out sends you to the login page.

## How it works

The project has three parts: a browser frontend, an Express server, and a SQLite database.

```
Browser (public/)  <--JSON over fetch-->  Express server (server.js)  <-->  SQLite (study.db)
```

**Frontend (`public/`)**
- `index.html`, `app.js`, and `style.css` make up the main page. `app.js` loads sessions from the API, draws them with DOM methods (`textContent`, so user input is never run as HTML), filters them in the browser as you type, and posts new sessions from the form.
- `login.html` and `login.js` handle logging in and creating accounts.

**Server (`server.js`)**
- Serves the `public/` folder and exposes a small JSON API.
- Passwords are hashed with `bcryptjs` and never stored in plain text.
- Login state is kept in a cookie-based session (`express-session`). The `requireLogin` middleware rejects requests to protected routes with a 401, and the frontend redirects to the login page.

**Database (`database.js`)**
- Opens `study.db` with `better-sqlite3` and creates the tables if they don't exist.
- `sessions`: `id`, `course_name`, `student_name`, `availability`, `contact`, `status`
- `users`: `id`, `username` (unique), `password_hash`
- All queries use parameters (`?`), which protects against SQL injection.

### API routes

| Method | Route | Login required | Purpose |
|---|---|---|---|
| GET | `/api/courses` | No | List all sessions, newest first |
| POST | `/api/courses` | Yes | Create a session (`course_name` required) |
| POST | `/api/register` | No | Create an account and log in |
| POST | `/api/login` | No | Log in |
| POST | `/api/logout` | No | Log out |

Errors return JSON like `{ "error": "message" }` with a status code (400 invalid input, 401 not logged in, 409 username taken, 500 server error), and the frontend shows the message under the form.

## Project structure

| File / folder | Purpose |
|---|---|
| `server.js` | Express server and API routes |
| `database.js` | SQLite connection and table setup |
| `seed.js` | Loads sample data |
| `public/` | Frontend files served to the browser |
| `package.json` | Project config and dependencies |
| `.gitignore` | Ignores `node_modules/` and `study.db` |

## Known limitations

- **Availability is free text**, so the app can't match times automatically.
- **Posts can't be edited or deleted** after they are submitted.
- **Sessions aren't linked to accounts**, so any logged-in user can post under any name.
- **Login sessions are stored in memory**, so restarting the server logs everyone out.
- **Contact information is public.** Anyone who opens the site can read it, so only share what you are comfortable making visible.
- The list has no pagination, so it would slow down with very large amounts of data.

## Team

[Add team member names and roles here.]