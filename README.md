# 🏥 Hospital Management System

![C#](https://img.shields.io/badge/language-C%23-blue.svg) ![.NET Core](https://img.shields.io/badge/Framework-.NET%20Core-purple.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

A robust, layered-architecture Hospital Management System built with **ASP.NET Core Web API**. This application enables the secure management of hospital records, including doctors, patients, and appointment scheduling, utilizing modern .NET development practices and dual-token authentication.

---

## 📑 Table of Contents
1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Installation](#-installation)
5. [Security Architecture](#-security-architecture-why-http-only-cookies)
6. [API Documentation](#-api-documentation)

---

## ⚙️ Features
- 🌐 **RESTful Architecture**: A pure Web API designed for seamless frontend integration.
- 📅 **Appointment Management**: Full CRUD operations with strict DTO validation.
- 🔐 **Identity Security**: Integrated ASP.NET Core Identity for secure session management and Role-Based Authorization (Admin/User).
- 🗄️ **Data Persistence**: Uses Entity Framework Core with migrations for structured SQL Server database management.
- 🔄 **Automation**: Includes Hangfire background cron jobs for automated database cleanup.
- 🛡️ **Advanced Auth**: Supports secure token-based authentication with automatic Refresh Token rotation.

---

## 🛠️ Tech Stack
- **C# & ASP.NET Core Web API**: The core language and framework used to build the RESTful backend architecture.
- **Entity Framework (EF) Core**: The ORM used to interact with the database using C# and LINQ.
- **Microsoft SQL Server**: The relational database used to store hospital records securely.
- **ASP.NET Core Identity & JWT**: Used for authentication, user management, and role-based authorization.
- **Hangfire**: Used for background job scheduling and automation.

---

## 📂 Project Structure
- `Controllers/`: API routing and HTTP request handling.
- `Services/`: Core business logic and database interactions.
- `DTOs/`: Data Transfer Objects for secure request/response shaping.
- `Models/`: Core domain entities (Doctor, Patient, ApplicationUser).
- `Database/`: ApplicationDbContext and database configurations.
- `Jobs/`: Hangfire automated background tasks.

---

## 🚀 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/FelopaterAshraf/HospitalSystem_App.git
```

2. **Navigate to the folder:**
```bash
cd HospitalSystem_App
```

3. **Apply database migrations:**
```bash
dotnet ef database update
```

4. **Run the application:**
```bash
dotnet run
```

5. **Access the Dashboards:**
- Swagger: http://localhost:5087/swagger
- Hangfire: http://localhost:5087/hangfire

---

## 🛡️ Security Architecture

Uses HTTP-only cookies to protect JWT tokens from XSS attacks. Tokens are automatically handled by the browser and cannot be accessed via JavaScript.

---

## 🌐 API Documentation Highlights

| Method | Endpoint | Description | Authorization |
|--------|----------|------------|--------------|
| POST | /api/auth/register | Register new user | Allow Anonymous |
| POST | /api/auth/login | Login & receive cookies | Allow Anonymous |
| POST | /api/auth/refresh | Rotate JWT | Valid Refresh Cookie |
| GET | /api/doctors | Get all doctors | Authorized |
| POST | /api/appointments | Schedule appointment | Authorized |
| DELETE | /api/patients/{id} | Delete patient | Admin Only |

---

Developed by Felopater Ashraf.
