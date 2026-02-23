# 🏥 Hospital Management System (MVC & Web API)

A hybrid web application built with .NET Core and C# to manage hospital records. This project demonstrates a layered architecture using Controllers, Interfaces, Services, and Models. It features both a frontend HTML user interface (MVC Views) and a backend RESTful Web API.

## ⚙️ Features
* **MVC Web Interface:** Includes dynamically generated HTML Razor Views (`.cshtml`) with custom CSS to visually display the Doctor and Patient directories.
* **Interactive Forms:** Users can seamlessly add new doctors and patients directly from the web browser.
* **Complete CRUD Operations:** Create, Read, Update, and Delete records for both Doctors and Patients via the API.
* **Dependency Injection:** Utilizes `.AddSingleton()` to maintain state and manage service lifecycles across HTTP requests.
* **Hybrid Routing:** Combines standard web routes (`/doctors`) for human users with RESTful API routes (`/api/doctors`) for backend testing.
* **In-Memory Data Storage:** Uses List collections to simulate a database environment for testing purposes.

## 🛠️ Technology Stack
* **Language:** C#
* **Framework:** ASP.NET Core MVC & Web API
* **Frontend:** HTML5, CSS3, Razor Syntax
* **Testing:** Postman / Web Browser

## 🚀 How to Run the Project
1. Clone this repository to your local machine.
2. Open the project folder in Visual Studio Code.
3. Open the integrated terminal and run the following command to start the server:
```bash
   dotnet run

```

4. **To view the HTML Webpages:** Open your browser and navigate to:
* `http://localhost:5087/doctors`
* `http://localhost:5087/patients`



---

## 🖥️ Web User Interface (MVC Views)

The application features a modern, responsive web interface that allows users to seamlessly navigate between Doctor and Patient records and add new entries directly from the browser.

### Doctor Directory & Creation

Users can view all registered doctors and easily add new ones through a dedicated HTML form.

<p align="center">
<img  src="https://github.com/user-attachments/assets/6bc94bb7-342e-4dcb-81be-83d4f2e0660a" width="48%" alt="Doctor Directory">
<img src="https://github.com/user-attachments/assets/6d77dcb9-d99b-4cab-b09f-34382a28f96d" width="48%" alt="Add Doctor Form">
</p>

### Patient Directory & Creation

A uniquely themed patient dashboard that maintains UI consistency while offering the same directory and creation features.

<p align="center">
<img src="https://github.com/user-attachments/assets/ef4dee91-2878-44c6-bd97-55d800b0cf4c" width="48%" alt="Patient Directory">
<img src="https://github.com/user-attachments/assets/fa6541bd-3180-4c9d-a68d-29d911d00640" width="48%" alt="Add Patient Form">
</p>

---

## 🧪 API Testing Documentation (Postman)

The following CRUD operations were successfully tested using **Postman**.

Below are the endpoints and the corresponding test results.

---

### 1️⃣ Retrieve All Doctors (GET)

**Endpoint:**
`GET /api/doctors`

**Description:** Retrieves the complete list of doctors from the system.

**Expected Result:** Returns a `200 OK` status along with a JSON array of all existing doctors.
<img width="1917" height="861" alt="image" src="https://github.com/user-attachments/assets/2cdbe210-efcd-438e-96a1-af2b3eb428c8" />

---

### 2️⃣ Create a New Doctor (POST)

**Endpoint:**
`POST /api/doctors`

**Description:** Adds a new doctor to the system.

**Payload:**

```json
{
  "name": "Dr. Mina",
  "specialty": "Pediatrics"
}

```

**Expected Result:** Returns a `201 Created` status code and the auto-generated ID of the new doctor.
<img width="1919" height="783" alt="image" src="https://github.com/user-attachments/assets/411d1052-874e-41e2-b1cb-1ebf0d1bb494" />

---

### 3️⃣ Retrieve a Specific Doctor (GET by ID)

**Endpoint:**
`GET /api/doctors/2`

**Description:**
Fetches the details of a single doctor using their specific ID.

**Expected Result:** Returns a `200 OK` status and the JSON object containing the doctor's details.
<img width="1919" height="779" alt="image" src="https://github.com/user-attachments/assets/9831f0e6-a786-4af9-aab8-5b3a8767ad68" />

---

### 4️⃣ Update an Existing Doctor (PUT)

**Endpoint:**
`PUT /api/doctors/3`

**Description:**
Updates an existing doctor's information.

**Payload:**

```json
{
  "id": 3,
  "name": "Dr. Farag",
  "specialty": "Senior Pediatrician"
}

```

**Expected Result:** Returns a `200 OK` status and the updated JSON object showing the new name and specialty.
<img width="1919" height="758" alt="image" src="https://github.com/user-attachments/assets/9504e998-0610-4ae5-9a5f-10e3c8fde4a0" />

---

### 5️⃣ Delete a Doctor (DELETE)

**Endpoint:**
`DELETE /api/doctors/2`

**Description:**
Removes a specific doctor from the system permanently.

**Expected Result:** Returns a `204 No Content` status, verifying successful deletion.
<img width="1919" height="834" alt="image" src="https://github.com/user-attachments/assets/737ed2d6-8618-4e62-9f1d-cfc6c7f10f79" />

---

## 🧑‍⚕️ Patient Endpoints

The same CRUD operations demonstrated above for **Doctors** are fully implemented for **Patients**.

All endpoints follow the same RESTful structure and return appropriate HTTP status codes.

### Supported Patient Operations:

* `GET /api/patients` → Retrieve all patients
* `GET /api/patients/{id}` → Retrieve a patient by ID
* `POST /api/patients` → Create a new patient
* `PUT /api/patients/{id}` → Update an existing patient
* `DELETE /api/patients/{id}` → Delete a patient

These endpoints were tested in Postman and return the same standard responses (`200 OK`, `201 Created`, `204 No Content`, `404 Not Found`, etc.).

## 🧑‍⚕️ Patient API Testing

<p align="center">
<img src="https://github.com/user-attachments/assets/93b665ba-843e-4435-ad61-5dd2af31e506" width="48%">
<img src="https://github.com/user-attachments/assets/75656b1e-5385-4490-9556-f87bbc6da46c" width="48%">
</p>

<p align="center">
<img src="https://github.com/user-attachments/assets/c5f74f1b-4e21-4afe-86bd-66bf700a8ef2" width="48%">
<img src="https://github.com/user-attachments/assets/cfb5f377-37a7-4698-aab1-d0c9fc858566" width="48%">
</p>

<p align="center">
<img src="https://github.com/user-attachments/assets/46837c33-f912-4c24-a09f-78c1a4eea689" width="48%">
</p>

