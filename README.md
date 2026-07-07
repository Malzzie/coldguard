# ❄️ ColdGuard

> **An Intelligent Cold Chain Warehouse Management System**

ColdGuard is a full-stack warehouse management system developed as part of a **Master of Science in Software Engineering** capstone project. The application demonstrates how modern software engineering principles can be applied to cold chain logistics by combining warehouse inventory management, temperature monitoring, intelligent alerting, operational reporting, and AI-assisted decision support into a single integrated platform.

The system enables warehouse personnel to:

- Monitor warehouse inventory
- Record and analyse temperature readings
- Configure temperature thresholds
- Manage warehouse alerts
- Generate operational reports
- Analyse warehouse performance
- Receive AI-assisted operational recommendations

The project follows an Agile Scrum development methodology, with implementation completed across multiple development sprints and supported by comprehensive project documentation.


---

## 🚀 Live Demonstration

| Component | Link |
|----------|------|
| 🌐 Frontend | **[ColdGuard Web App](https://coldguard.vercel.app/)** |
| ⚙️ Backend API | **[ColdGuard API](https://coldguard-api-5214.onrender.com/)** |
| 📚 Swagger API Documentation | **[Interactive API Docs](https://coldguard-api-5214.onrender.com/docs)** |
| 📦 Repository | **[GitHub] (https://github.com/Malzzie/coldguard)** |

---

## ✨ Key Features

- ✅ Secure JWT Authentication
- ✅ Warehouse Dashboard
- ✅ Inventory Management
- ✅ Temperature Monitoring
- ✅ Temperature Threshold Management
- ✅ Intelligent Alert Management
- ✅ Inventory Movement Audit Trail
- ✅ Executive Reporting
- ✅ Temperature Trend Insights
- ✅ AI Warehouse Risk Advisor
- ✅ CSV Report Export
- ✅ Search & Filtering
- ✅ Responsive User Interface

---

## 🛠 Technology Stack

### Frontend

- React
- React Router
- Vite
- Bootstrap 5
- JavaScript (ES6+)
- Fetch API

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn
- JWT Authentication (python-jose)
- Passlib / bcrypt (Password Hashing)



### Development Tools

- Git
- GitHub
- Jira Scrum Board
- Swagger / OpenAPI
- Pytest
- HTTPX
- Render
- Vercel

---


# 🏗️ System Architecture

ColdGuard follows a modern three-tier architecture, separating the presentation layer, business logic, and data persistence layer.

```text
                    React Frontend (Vite + Bootstrap)
                               │
                               │ REST API (HTTPS)
                               ▼
                     FastAPI Backend (Python)
                               │
                  Authentication & Business Logic
                               │
                        SQLAlchemy ORM
                               │
                               ▼
                         SQLite Database
```

The application follows RESTful API principles and uses JSON for communication between the frontend and backend. Authentication is secured using JSON Web Tokens (JWT), while SQLAlchemy provides object-relational mapping for database operations.

For detailed architectural artefacts, including UML diagrams, domain models and design decisions, refer to the Sprint documentation.

---


# 📂 Project Structure

```text
ColdGuard/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── ai.py                 # AI Risk Advisor endpoints
│   │   │   ├── alerts.py             # Alert management and audit trail
│   │   │   ├── auth.py               # Authentication routes
│   │   │   ├── inventory.py          # Inventory CRUD and stock operations
│   │   │   ├── locations.py          # Storage location routes
│   │   │   ├── movements.py          # Inventory movement tracking
│   │   │   ├── reports.py            # Reporting endpoints
│   │   │   ├── temperature.py        # Temperature monitoring routes
│   │   │   └── thresholds.py         # Temperature threshold management
│   │   │
│   │   ├── database.py               # Database configuration
│   │   ├── main.py                   # FastAPI application entry point
│   │   ├── models.py                 # SQLAlchemy database models
│   │   ├── schemas.py                # Pydantic request/response schemas
│   │   └── security.py               # Password hashing and JWT utilities
│   │
│   ├── tests/
│   │   └── test_api.py               # Backend API tests
│   │
│   └── requirements.txt              # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   ├── pages/                    # Application pages
│   │   ├── services/                 # API service layer
│   │   ├── assets/                   # Static frontend assets
│   │   └── App.jsx                   # Main React router
│   │
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.js                # Vite configuration
│
├── docs/
│   ├── architecture/                 # Architecture documentation
│   │   ├── adr/                      # Architecture Decision Records
│   │   └── diagrams/                 # Architecture and system diagrams
│   │
│   └── project-documentation/        # Sprint documentation
│
├── docker/                           # Containerization artefacts
│
└── README.md                         # Project overview and setup guide

```
---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/Malzzie/coldguard.git
cd ColdGuard
```

---

## Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

The backend API will be available at:

```
http://127.0.0.1:8000
```

Swagger documentation:

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```
http://localhost:5173
```

---

# ▶️ Running ColdGuard

1. Start the FastAPI backend.
2. Start the React frontend.
3. Open the frontend in your browser.
4. Sign in using the demo administrator account.
5. Begin exploring the ColdGuard dashboard.

---

# 🔐 Demo Credentials

The deployed application includes a seeded administrator account for demonstration purposes.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@coldguard.com | Password123 |

User creation is intentionally controlled by an administrator to reflect a managed warehouse environment where access should not be self-service.

---

# 🎓 Academic Notes

ColdGuard was developed as a Master's capstone project to demonstrate applied software engineering in a cold chain warehouse context.

## Demo Data

The application automatically seeds demo warehouse data on startup. This ensures that assessors can immediately evaluate the system without manually creating inventory, temperature readings, thresholds, or alerts.

## AI Risk Advisor

The AI Risk Advisor uses rule-based decision support logic to analyse temperature readings and open alerts. It is designed to demonstrate how operational warehouse data can be converted into management recommendations.

## Admin-Controlled Users

User registration is restricted to administrative control. This reflects a realistic warehouse environment where system access is managed by authorised personnel.

---

# 📚 Project Documentation

ColdGuard is supported by detailed sprint documentation, architecture notes, diagrams, and Architecture Decision Records.

Documentation is stored in:

```text
docs/

```

---

---

# 👨‍💻 Author

**Malibongwe Sojola**

Master of Science in Software Engineering

GitHub: https://github.com/Malzzie

Repository: https://github.com/Malzzie/coldguard

---

# 🙏 Acknowledgements

This project was developed as part of the Master of Science in Software Engineering programme.

Special thanks to the lecturers, supervisors, and peers whose guidance and feedback contributed to the successful completion of this project.

The project also draws upon established software engineering practices, including:

- Agile Scrum methodology
- Domain-Driven Design (DDD)
- RESTful API design
- Layered software architecture
- Secure authentication using JWT
- Modern React frontend development
- Continuous version control using Git and GitHub

---

# 📈 Project Status

| Module | Status |
|---------|--------|
| Authentication | ✅ Complete |
| Inventory Management | ✅ Complete |
| Temperature Monitoring | ✅ Complete |
| Threshold Management | ✅ Complete |
| Alert Management | ✅ Complete |
| Reporting | ✅ Complete |
| Temperature Trend Insights | ✅ Complete |
| AI Risk Advisor | ✅ Complete |
| Frontend | ✅ Complete |
| Backend API | ✅ Complete |
| Deployment | ✅ Complete |

---

# ⭐ Project Highlights

ColdGuard demonstrates the practical application of modern software engineering principles within a cold chain warehouse management environment.

Key achievements include:

- Full-stack React and FastAPI application
- Secure JWT authentication
- RESTful API architecture
- AI-assisted warehouse decision support
- Interactive reporting and analytics
- Comprehensive sprint documentation
- Architecture Decision Records (ADRs)
- Deployment using Render and Vercel
- End-to-end testing using Pytest
- Agile Scrum project management using Jira

---

> **ColdGuard was developed to demonstrate how intelligent software solutions can improve visibility, compliance, and operational decision-making within cold chain warehouse environments.**