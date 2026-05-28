# 📝 'Do-It' Todo App (Full Stack)

<p align="center">
  <img width="1387" height="806" alt="to do app" src="https://github.com/user-attachments/assets/3c70e3dd-0006-4b62-abd1-2cda1fea55ad" />

  <img src="./client/public/demo.gif" alt="'Do-It' App Demo" width="100%" style="border-radius: 8px;">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</p>

---

## 🚀 Overview & Features

**'Do-It'** is a modern, production-ready full-stack task management application. It is engineered with secure user authentication workflows and a relational database architecture to guarantee strict data isolation and user-specific resource privacy.

### Key Features:
*   🔐 **JWT Authentication:** Secure user signup and login operations powered by token-based authentication (Passwords securely hashed via `bcryptjs`).
*   🛡️ **Protected Routes:** Frontend and backend route guards ensure unauthorized clients cannot access or modify server-side resources.
*   ⚡ **Full CRUD Operations:** Seamless real-time creation, reading, updating, and deletion of user todos.
*   📊 **Status Filtering:** Categorized dashboard views with 'All', 'Active', and 'Completed' tabs for efficient task organization.
*   👥 **Data Isolation:** Row-level data privacy logic guarantees users can only access their own respective todo lists.
*   ✅ **Robust Backend Validation:** Strict payload and schema verification executed at the server layer prior to database writes.

---

## 🛠️ Technology Stack & Dependencies

### Frontend
*   **Core Framework:** React.js (Scaffolded using Vite for optimal build performance)
*   **Routing:** React Router DOM (Declarative client-side routing for Single Page Architecture)
*   **HTTP Client:** Axios (Configured with automated request interceptors for dynamic JWT embedding)
*   **Styling:** Tailwind CSS (Utility-first framework delivering a modern, fully responsive UI layout)

### Backend & Database
*   **Runtime Framework:** Node.js with Express.js (RESTful API Design pattern)
*   **Database Engine:** MySQL (Handled via the native asynchronous `mysql2` driver)
*   **Security Stack:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
*   **Middleware Infrastructure:** `cors` (Cross-Origin Resource Sharing control), `dotenv` (Decoupling environment configurations)

---

## 📁 Repository Structure

```text
do-it-app/
├── client/                 # Frontend React application (Vite-powered)
│   ├── src/                # App source code (Components, Pages, Assets)
│   ├── index.html          # Frontend entry HTML template
│   ├── main.jsx            # React app bootstrapping node
│   ├── package.json        # Frontend configuration and library scripts
│   └── package-lock.json   # Package dependency tree lockfile
│
├── server/                 # Backend REST API Server (Node.js + Express)
│   ├── server.js           # Main application server entry point
│   ├── .env                # Local environment secrets & DB configs (Keep secured)
│   ├── package.json        # Backend server dependencies and initialization scripts
│   └── package-lock.json   # Backend dependency tree lockfile
│
└── README.md               # Comprehensive project documentation & guide
