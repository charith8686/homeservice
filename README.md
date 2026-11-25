# HomeServices — React + Node.js (Local Storage)

This conversion retains the original HomeServices design, copy, service types/prices, admin demo account, user/admin flows, and booking statuses. Existing CSS is copied from the uploaded `style.css`.

## Stack
- React + Vite
- Node.js + Express API
- Browser Local Storage for users, current session, and bookings (no MongoDB)

## Run
1. Install Node.js (LTS).
2. In this folder run: `npm install`
3. Run both servers: `npm run dev`
4. Frontend: http://localhost:5173
5. Express API: http://localhost:5000/api/health

Admin demo login: `admin@homeservices.com` / `admin123`

Note: Since user/booking data is stored in Local Storage, it is local to the browser and not shared between browsers/devices. Passwords are stored as plain Local Storage values for this requested frontend-only storage setup; this is a demo, not production authentication.
