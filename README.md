# 🏥 Medcare Hospital Management System

![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite) ![C#](https://img.shields.io/badge/Backend-C%23_.NET-blue?logo=dotnet) ![Axios](https://img.shields.io/badge/HTTP-Axios-5A29E4) ![License](https://img.shields.io/badge/license-MIT-green.svg)

A full-stack Hospital Management System with a **React** frontend and an **ASP.NET Core Web API** backend. The system enables secure management of hospital records including doctors, patients, and appointment scheduling, with a clean dashboard UI and role-based access control.

---

## 📑 Table of Contents
1. [Application Description](#-application-description)
2. [Tech Stack](#️-tech-stack)
3. [Project Structure](#-project-structure)
4. [Frontend Setup](#-frontend-setup)
5. [Backend Setup](#-backend-setup)
6. [API Routes](#-api-routes)
7. [Security Architecture](#️-security-architecture)
8. [Screenshots](#-screenshots)

---

## 📋 Application Description

Medcare is a full-stack Hospital Management System that allows hospital staff to manage their operations through a modern web dashboard.

**What it does:**
- Secure login and registration with role-based access (Admin / User)
- Dashboard with live stats — total doctors, patients, and appointments
- Full CRUD for Doctors, Patients, and Appointments
- Admins can add, edit, and delete all records
- Regular users can view permitted records, while Admins can add, edit, and delete doctors, patients, and appointments.
- Automatic token refresh and session management via HttpOnly cookies

**Frontend** is built with React + Vite, using React Router for navigation, Axios for API communication, and Tailwind CSS for styling.

**Backend** is built with ASP.NET Core Web API, Entity Framework Core, SQL Server, and ASP.NET Core Identity for authentication.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7, Axios, Tailwind CSS |
| Backend | C#, ASP.NET Core Web API, Entity Framework Core |
| Database | Microsoft SQL Server |
| Auth | ASP.NET Core Identity, JWT, HttpOnly Cookies |
| Background Jobs | Hangfire |

---

## 📂 Project Structure

```
HospitalSystem_App/
├── frontend/                  # React application
│   └── src/
│       ├── components/        # Reusable UI components (Sidebar, Layout, ProtectedRoute)
│       ├── pages/             # Page components (Dashboard, DoctorList, AddDoctor, etc.)
│       ├── services/          # Axios service files (api.js, doctorService.js, etc.)
│       ├── App.jsx            # Root component with all routes
│       └── main.jsx           # Entry point
│
└── HospitalSystem/            # ASP.NET Core backend
    ├── Controllers/           # API routing and HTTP request handling
    ├── Services/              # Core business logic
    ├── DTOs/                  # Data Transfer Objects
    ├── Models/                # Domain entities
    ├── Database/              # DbContext and configurations
    └── Jobs/                  # Hangfire background tasks
```

---

## 💻 Frontend Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/FelopaterAshraf/HospitalSystem_App.git
```

2. **Navigate to the frontend folder:**
```bash
cd HospitalSystem_App/frontend
```

3. **Install dependencies:**
```bash
npm install
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser at:**
```
http://localhost:5173
```

> ⚠️ Make sure the backend is running on port **5087** before starting the frontend, otherwise API calls will fail.

---

## 🚀 Backend Setup

### Prerequisites
- .NET 8 SDK
- Microsoft SQL Server
- Visual Studio or VS Code

### Steps

1. **Navigate to the backend folder:**
```bash
cd HospitalSystem_App/HospitalSystem
```

2. **Update the connection string** in `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=HospitalDB;Trusted_Connection=True;"
}
```

3. **Apply database migrations:**
```bash
dotnet ef database update
```

4. **Run the application:**
```bash
dotnet run
```

5. **The API will be available at:**
```
http://localhost:5087
```

6. **Hangfire Dashboard (background jobs):**
```
http://localhost:5087/hangfire
```

> 💡 The first registered user is automatically assigned the **Admin** role. All subsequent users get the **User** role.

---

## 🌐 API Routes

### Authentication
| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login and receive cookies | Public |
| POST | /api/auth/refresh | Rotate JWT token | Valid Refresh Cookie |
| POST | /api/auth/logout | Logout and clear cookies | Authorized |
| GET  | /api/auth/me | Get current user info | Authorized |

### Doctors
| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | /api/doctors | Get all doctors | Authorized |
| GET | /api/doctors/{id} | Get doctor by ID | Authorized |
| POST | /api/doctors | Create new doctor | Admin Only |
| PUT | /api/doctors/{id} | Update doctor | Admin Only |
| DELETE | /api/doctors/{id} | Delete doctor | Admin Only |

### Patients
| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | /api/patients | Get all patients | Authorized |
| GET | /api/patients/{id} | Get patient by ID | Authorized |
| POST | /api/patients | Create new patient | Admin Only |
| PUT | /api/patients/{id} | Update patient | Admin Only |
| DELETE | /api/patients/{id} | Delete patient | Admin Only |

### Appointments
| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | /api/appointments | Get all appointments | Authorized |
| GET | /api/appointments/{id} | Get appointment by ID | Authorized |
| POST | /api/appointments | Book new appointment | Admin Only |
| PUT | /api/appointments/{id} | Update appointment | Admin Only |
| DELETE | /api/appointments/{id} | Cancel appointment | Admin Only |

---

## 🛡️ Security Architecture

- **HttpOnly Cookies** protect JWT tokens from XSS attacks — tokens are handled by the browser and cannot be accessed via JavaScript
- **Refresh Token Rotation** — expired JWTs are automatically replaced with new ones using a secure refresh token
- **Role-Based Authorization** — Admin and User roles control access to create, update, and delete operations
- **Axios Interceptor** — automatically redirects to login if a 401 response is received from the backend

---

## 📸 Screenshots & API Testing

### 🖥️ Frontend Application

**Login Page**
![Login Page](images/frontend/login-page.png)

**Register Page**
![Register Page](images/frontend/register-page.png)

**Dashboard Overview**
![Dashboard](images/frontend/dashboard-overview.png)

---

**Doctor Directory**
![Doctor Directory](images/frontend/doctor-directory.png)

**Add New Doctor**
![Add Doctor](images/frontend/add-doctor-form.png)

**Edit Doctor Profile**
![Edit Doctor](images/frontend/edit-doctor-form.png)

---

**Patient Records**
![Patient Records](images/frontend/patient-records.png)

**Register New Patient**
![Add Patient](images/frontend/add-patient-form.png)

**Edit Patient Record**
![Edit Patient](images/frontend/edit-patient-form.png)

---

**Appointments List**
![Appointments](images/frontend/appointments-list.png)

**Book Appointment**
![Book Appointment](images/frontend/book-appointment-form.png)

**Edit Appointment**
![Edit Appointment](images/frontend/edit-appointment-form.png)

---

### 🔐 Postman API Testing

**User Registration**
![User Registration](images/register.png)

**User Login & Token Generation**
![User Login](images/login.png)

**Token Rotation (Refresh Endpoint)**
![Refresh Token](images/refresh.png)

**Role-Based Authorization (403 Forbidden)**
![403 Forbidden](images/forbidden.png)

---

### 🩺 Doctor Management
**Create Doctor** | ![Create Doctor](images/create-doctor.png)

**DTO Validation (400 Bad Request)** | ![Doctor Validation](images/doctor-validation.png)

**Get All Doctors** | ![Get All Doctors](images/get-doctors.png)

**Get Doctor By ID** | ![Get Doctor by ID](images/doctor-by-id.png)

**Update Doctor** | ![Update Doctor](images/update-doctor.png)

**Delete Doctor** | ![Delete Doctor](images/delete-doctor.png)

---

### 🤒 Patient Management
**Create Patient** | ![Create Patient](images/create-patient.png)

**Get All Patients** | ![Get All Patients](images/get-patients.png)

**Get Patient By ID** | ![Get Patient by ID](images/patient-by-id.png)

**Update Patient** | ![Update Patient](images/update-patient.png)

**Delete Patient** | ![Delete Patient](images/delete-patient.png)

---

### 📅 Appointment Scheduling
**Create Appointment** | ![Create Appointment](images/create-appointment.png)

**Get All Appointments** | ![Get All Appointments](images/get-appointments.png)

**Update Appointment** | ![Update Appointment](images/update-appointment.png)

**Delete Appointment** | ![Delete Appointment](images/delete-appointment.png)

---

### ⚙️ Background Automation
**Hangfire Cron Job Scheduler** | ![Hangfire Dashboard](images/hangfire.png)

---

Developed by Felopater Ashraf.
