# EC2 Manager Dashboard

A lightweight, local web-based tool to manage AWS EC2 instances. Built with **Flask (Python)** for the backend and **React (TypeScript)** for the frontend, this project allows users to:

- Select AWS regions
- View running EC2 instances
- Terminate selected instances
- (Optionally) Launch new instances with default settings

---

## 🔧 Technologies Used

- **Frontend**: React, TypeScript, HTML, CSS
- **Backend**: Flask, Python, Boto3 (AWS SDK)
- **AWS Services**: EC2
- **Other Tools**: Flask-CORS for cross-origin communication

---

## 📁 Project Structure

```
ec2-manager/
├── backend/             # Flask app (Python + Boto3)
│   └── app.py
├── frontend/            # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── TerminateProcess.tsx
│   └── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.x and pip
- Node.js and npm
- AWS CLI with valid credentials (`aws configure`)

### Backend Setup (Flask)
```bash
cd backend
pip install flask flask-cors boto3
python app.py
```

> Backend runs at: `http://localhost:5000`

### Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```

> Frontend runs at: `http://localhost:3000`

---

## 🌐 API Endpoints

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| GET    | `/api/get_instances` | Fetch EC2 instances by region   |
| POST   | `/terminate`         | Terminate selected instance     |
| POST   | `/deploy` *(optional)*| Launch EC2 instance (default AMI)|

---

## 📊 Performance (Compared to AWS Console)

| Operation   | AWS Console Time | EC2 Manager Time | Improvement |
|-------------|------------------|------------------|-------------|
| Deployment  | 35–65 seconds     | 6–12 seconds     | ~80% faster |
| Termination | 18–30 seconds     | 6–12 seconds     | ~60% faster |
