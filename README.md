# 🏦 Bank App — Full Stack Banking Application

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

A full-stack banking application with React frontend and Node.js backend — containerized with Docker and deployed on AWS EC2 using Nginx reverse proxy.

🌐 **Live Demo:** [http://44.200.159.137](http://44.200.159.137)

> **Demo Credentials** — Email: `demo@example.com` | Password: `demo123`

---

## 🏗️ Architecture Overview

```
        ┌─────────────────────────────────────────────────┐
        │              AWS EC2 Instance (Ubuntu 22.04)     │
        │                                                   │
        │   ┌───────────────────────────────────────────┐  │
        │   │           Docker Compose                   │  │
        │   │                                            │  │
        │   │          ┌─────────────────┐               │  │
        │   │          │      Nginx      │  ← Port 80    │  │
        │   │          │  Reverse Proxy  │               │  │
        │   │          └────────┬────────┘               │  │
        │   │         /        │          /api            │  │
        │   │    ┌─────────────┘    ┌──────────────┐     │  │
        │   │    ▼                  ▼               │     │  │
        │   │ ┌──────────┐   ┌────────────┐        │     │  │
        │   │ │  React   │   │  Node.js   │         │     │  │
        │   │ │ Frontend │   │  Backend   │         │     │  │
        │   │ │ :3000    │   │  :5000     │         │     │  │
        │   │ └──────────┘   └─────┬──────┘        │     │  │
        │   │                      │ Mongoose       │     │  │
        │   │                      ▼                │     │  │
        │   │                ┌──────────┐           │     │  │
        │   │                │ MongoDB  │           │     │  │
        │   │                │  :27017  │           │     │  │
        │   │                └──────────┘           │     │  │
        │   └───────────────────────────────────────┘     │
        └─────────────────────────────────────────────────┘
                                ▲
                         Browser (User)
                       http://44.200.159.137
```

**Flow:**
- Browser hits `http://44.200.159.137` → Nginx (Port 80)
- Nginx routes `/` → React Frontend (:3000)
- Nginx routes `/api` → Node.js Backend (:5000)
- Backend connects to MongoDB via Mongoose

---

## 📁 Project Structure

```
Bank-App-/
│
├── bank-app-backend/        # Node.js + Express API
│   ├── Dockerfile
│   └── package.json
│
├── bank-app-frontend/       # React Frontend
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   └── nginx.conf           # Reverse proxy config
│
├── docker-compose.yml       # Multi-container setup
├── API_DOCUMENTATION.md
├── FILE_STRUCTURE.md
├── QUICK_START.md
└── README.md
```

---

## 🚀 Local Setup (With Docker)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/) installed
- Git installed

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/prateekgajbar/Bank-App-.git

# 2. Navigate into the project
cd Bank-App-

# 3. Build and start all containers
docker compose up -d --build

# 4. Check running containers
docker ps

# 5. View logs
docker compose logs -f
```

### Access the App Locally

| Service   | URL                    |
|-----------|------------------------|
| Via Nginx | http://localhost       |
| Frontend  | http://localhost:3000  |
| Backend   | http://localhost:5000  |

---

## ☁️ AWS EC2 Deployment Guide

### Step 1 — Launch EC2 Instance

- AMI: **Ubuntu 22.04 LTS**
- Instance Type: `t2.micro` (free tier)
- Security Group — open these ports:

| Port  | Purpose         |
|-------|-----------------|
| 22    | SSH             |
| 80    | HTTP (Nginx)    |
| 3000  | Frontend (dev)  |
| 5000  | Backend (dev)   |

---

### Step 2 — SSH into EC2

```bash
ssh -i your-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

---

### Step 3 — Install Docker on EC2

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo apt install docker-compose -y

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu
newgrp docker
```

---

### Step 4 — Clone & Deploy

```bash
# Clone the repo
git clone https://github.com/prateekgajbar/Bank-App-.git
cd Bank-App-

# Stop system Nginx if running (important!)
sudo systemctl stop nginx
sudo systemctl disable nginx

# Build and run all containers
sudo docker compose up -d --build

# Verify all 4 containers running
sudo docker ps
```

---

### Step 5 — Enable Auto-Restart

```bash
sudo docker update --restart unless-stopped \
  bank-app-nginx bank-app-frontend bank-app-backend bank-app-mongodb
```

---

### Step 6 — Access Live App

```
http://<YOUR_EC2_PUBLIC_IP>
```

---

## 🌐 Nginx Reverse Proxy Config

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://bank-app-frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://bank-app-backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

> **Why `/api`?**
> Frontend calls like `fetch('/api/auth/login')` → Nginx routes to backend at `:5000`.
> Single domain, no exposed ports, zero CORS issues.

---

## 🔧 Docker Compose Overview

```yaml
services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"

  backend:
    build: ./bank-app-backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb

  frontend:
    build: ./bank-app-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend
```

---

## 🛑 Common Commands

```bash
# Stop all containers
sudo docker compose down

# Rebuild after code changes
sudo docker compose up -d --build

# View logs of a specific service
sudo docker compose logs -f backend

# Restart a single container
sudo docker compose restart nginx

# Remove all containers + volumes
sudo docker compose down -v
```

## 👨‍💻 Author

**Prateek Gajbar**
GitHub: [@prateekgajbar](https://github.com/prateekgajbar)

---

## ⭐ Show Some Love

If this project helped you, please give it a ⭐ on GitHub!
