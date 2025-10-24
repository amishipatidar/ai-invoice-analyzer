# AI Invoice Analyzer

AI Invoice Analyzer is a full-stack **MERN (MongoDB, Express, React, Node.js)** application that intelligently processes PDF invoices.  
It uses **Google's Gemini AI** to extract structured data from uploaded invoices, allowing users to easily manage, view, and export their financial data.

---

## Features

-  **User Authentication** — Secure JWT-based registration and login  
-  **PDF Invoice Upload** — Upload invoices via drag-and-drop  
-  **AI Data Extraction** — Uses Google Gemini to extract invoice number, vendor, total, items, etc.  
-  **Asynchronous Processing** — Background invoice processing prevents UI blocking  
-  **Data Management** — View, track, and delete processed invoices  
-  **Dashboard** — Central hub for recent and new invoices  
-  **History Page** — View all past invoices with filters (Completed, Processing, Failed)  
-  **Export Data** — Download completed invoices as **CSV** or **JSON**  
-  **Dark Mode** — Built-in light/dark theme toggle  
-  **Secure & Scalable** — Includes Helmet, rate limiting, and CORS configuration  

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React, Vite, React Router, Tailwind CSS, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **AI** | Google Generative AI (Gemini Pro) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **File Handling** | Multer (for uploads), pdf-parse (for text extraction) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas Account
- Google Gemini API Key

---

### Clone the Repository

```bash
git clone https://github.com/your-username/ai-invoice-analyzer.git
cd ai-invoice-analyzer
```

---

### Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file inside backend/ and add:**

```bash
PORT=8000
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-google-gemini-api-key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Start the backend:**
```bash
npm run dev
```
> Backend runs on **http://localhost:8000**

---

## Frontend Setup

```bash
cd frontend
npm install
```

**Create `.env` file inside frontend/ and add:**
```bash
VITE_API_URL=http://localhost:8000/api
```

**Start the frontend:**
```bash
npm run dev
```
> Frontend runs on **http://localhost:5173**

---

## Access the Application

Once both servers are running, open your browser at:

👉 **http://localhost:5173**

You can now register a new account and upload invoices!

---

## Project Structure

<details>
<summary>Click to view</summary>

```
ai-invoice-analyzer/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Invoice.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── invoices.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── invoiceController.js
│   ├── utils/
│   │   ├── geminiService.js
│   │   └── pdfProcessor.js
│   └── uploads/
│       └── .gitkeep
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   ├── FileUpload.jsx
        │   ├── InvoiceTable.jsx
        │   └── ProtectedRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   └── History.jsx
        └── context/
            ├── AuthContext.jsx
            └── ThemeContext.jsx
```
</details>

---

## API Endpoints

All invoice routes are protected (require JWT token).

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive JWT |
| GET | `/api/auth/me` | Get authenticated user details |
| POST | `/api/invoices/upload` | Upload and process a PDF invoice |
| GET | `/api/invoices` | Get all invoices for logged-in user |
| GET | `/api/invoices/:id` | Get single invoice details |
| DELETE | `/api/invoices/:id` | Delete an invoice |
| GET | `/api/invoices/export?format=json/csv` | Export invoice data |

---

## Deployment

### Backend (Render)

1. Push your backend folder to GitHub  
2. Create a new Web Service on Render  
3. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables from `.env`
5. Once deployed, note your backend URL  
   Example:  
   ```
   https://my-invoice-api.onrender.com
   ```

### 🔹 Frontend (Vercel)

1. Push your frontend folder to GitHub  
2. Import the repo on Vercel  
3. Add environment variable:
   ```
   VITE_API_URL=https://my-invoice-api.onrender.com/api
   ```
4. Deploy the app  
   Example:  
   ```
   https://my-invoice-app.vercel.app
   ```

### Final Step

Update your Render `.env`:
```
FRONTEND_URL=https://my-invoice-app.vercel.app
```

This ensures CORS works correctly.

---
 

