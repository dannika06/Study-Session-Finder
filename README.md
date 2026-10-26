# Study Session Finder

A simple web app that lets CS and CSD students post and find study sessions for their courses.

## Demo Path
1. Find/Create course
2. Add name and availability
3. Display dashboard to find others to study with

## Success Criterion
A student can create a study session for its CS396 class and add their availability on Friday from 1:00pm to 4:00pm. Then the newly added study session will be listed in the dashboard for that specific class name along with the student name and availability.

## How to Run
```bash
npm install
node server.js
```

Then open http://localhost:3000

## Sample Data

To load realistic sample sessions:
```
node seed.js
```

To clear and re-seed:
```
node seed.js --reset
```