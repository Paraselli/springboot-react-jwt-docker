# 🚀 Spring Boot + React + JWT + Docker

## 📌 Overview

This project is a **full-stack application** built using:

* Spring Boot (Backend APIs)
* React (Frontend UI)
* JWT (Authentication & Authorization)
* Docker (Containerization)

It demonstrates how to build a **secure, scalable, and containerized application**.

---

## 🧩 Architecture

Frontend (React) → Backend (Spring Boot API) → JWT Authentication

* Users authenticate using JWT tokens
* Backend validates tokens for protected endpoints

---

## 🛠️ Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring Security
* JWT (JSON Web Token)

### Frontend

* React.js
* Axios

### DevOps

* Docker
* Docker Compose

---

## 📂 Project Structure

```id="n7nm5o"
springboot-react-jwt-docker/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 Clone Repository

```id="x1lbxo"
git clone https://github.com/Paraselli/springboot-react-jwt-docker.git
cd springboot-react-jwt-docker
```

---

### 🔹 Run with Docker (Recommended)

```id="kkjy0j"
docker-compose up --build
```

👉 This will start:

* Spring Boot backend
* React frontend

---

### 🔹 Run Without Docker

#### Backend

```id="2ncsw7"
cd backend
mvn spring-boot:run
```

#### Frontend

```id="5ovnjr"
cd frontend
npm install
npm start
```

---

## 🔐 Authentication Flow (JWT)

1. User logs in with credentials
2. Backend generates JWT token
3. Token sent to frontend
4. Frontend stores token
5. Token is included in headers for protected APIs

---

## 🔄 API Endpoints (Example)

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| POST   | /auth/login    | User login         |
| POST   | /auth/register | Register user      |
| GET    | /api/data      | Protected endpoint |

---

## 🐳 Docker Setup

```id="l9y2p2"
docker-compose up --build
```

---

## 🔐 Security Features

* JWT-based authentication
* Protected API endpoints
* Stateless session management

---

## 🚀 Features

* Full-stack application
* Secure login system
* Token-based authentication
* Dockerized setup

---

## 📈 Future Improvements

* Refresh token implementation
* Role-based access control (RBAC)
* CI/CD pipeline integration
* Kubernetes deployment
* Cloud deployment (Azure/AWS)

---

## 💥 Author

Ram P

---

## 🔗 Connect with me

🔗 https://linkedin.com/in/ram-paraselli
💻 https://github.com/Paraselli

---

## ⭐ If you like this project, give it a star!
