# Food E-Commerce System (Phase 1) - `amitfoodproduct.in`

This project consists of a Node.js Backend API and a React Admin Panel.

## Prerequisites

- Node.js (v14+)
- MongoDB (Running locally or Atlas)

## 1. Backend Setup

The backend handles API requests, database connections, and authentication.

### Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Ensure `.env` exists with `MONGO_URI` and `JWT_SECRET`.
   - Admin seeding is configured in `seeder.js`.

### Running the Server

1. Start the development server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

### Database Seeding (Admin Account)

To reset/create the admin user (`prince960876@gmail.com`):

```bash
node seeder.js
```

## 2. Admin Panel Setup

The admin panel allows management of products and orders.

### Installation

1. Navigate to the `admin-panel` directory:
   ```bash
   cd ../admin-panel
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Admin Panel

1. Start the development server:
   ```bash
   npm run dev
   ```
   Access the panel at `http://localhost:5173`.

### Admin Credentials

- **Email**: `prince960876@gmail.com`
- **Password**: `Princekum@r123`

## Features Implemented

- **Login**: Secure Admin Authentication using JWT.
- **Dashboard**: Overview of products, orders, and revenue.
- **Manage Products**: Add, List, and Delete products.
  - Includes Image Upload, Stock, Unit, Category.
- **Orders**: View customer orders and update status (Pending -> Delivered).
