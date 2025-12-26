# House-Rental-Management-System
The Rental &amp; Lease House Management System is a web app that connects owners and tenants. Owners can add house details, upload images, and set rent or lease prices. Tenants can search properties, view details, and contact owners. Built using Node.js, Express, and MySQL

# 🏠 Rental & Lease House Management System

*Connecting Owners & Tenants — Fast, Simple, Transparent*

---

## 📌 Project Overview

The **Rental & Lease House Management System** is a web-based platform designed to simplify the process of:

✔ Listing houses for **rent or lease**
✔ Browsing available properties
✔ Viewing house images, price, and owner contact
✔ Managing tenant and owner profiles

This system replaces manual processes with a structured, user-friendly and centralized platform.

---

## 🎯 Objectives

* Provide a convenient way for **owners** to list properties.
* Allow **tenants** to easily search and view properties.
* Maintain **secure records** of users and houses.
* Support image uploads and real-time data fetch.
* Offer CRUD operations (Create, Read, Update, Delete) for owners.

---

## 🌟 Key Features

### 👤 Authentication

* User Signup & Login
* Password hashing using **bcrypt**

### 🏡 Owner Features

* Add owner details
* Upload house details with image
* Add rent/lease pricing
* Edit & delete listings
* Manage properties in dashboard

### 👥 Tenant Features

* Create tenant profile
* Browse houses with images
* Filter by **Rent** or **Lease**
* Search by **Address**
* View owner contact info

### 🖼 Image Handling

* Upload and store images
* Display using Base64 encoding

### ⚙️ Backend Functions

* Node.js Express APIs
* MySQL persistent storage
* RESTful routing
* File upload handling

---

## 🏗️ Tech Stack

| Layer       | Technology                      |
| ----------- | ------------------------------- |
| Frontend    | HTML, CSS, JavaScript           |
| Backend     | Node.js, Express.js             |
| Database    | MySQL                           |
| Security    | bcrypt (password hashing)       |
| File Upload | express-fileupload / formidable |

---

## 📂 Folder Structure

```
Rental-House-Management/
│
├── app.js
├── package.json
├── package-lock.json
├── MySQL.txt
│
├── public/
│   ├── homepage.html
│   ├── login.html
│   ├── signup.html
│   ├── ownerhp.html
│   ├── ownerdet.html
│   ├── owner.html
│   ├── ownerview.html
│   ├── tenanthp.html
│   ├── tenantdet.html
│   ├── tenantview.html
│   ├── rent.html
│   ├── lease.html
│   ├── next.html
│   ├── house.html
│   ├── home.jpg
│   ├── eye.png
│   └── eye-off.png
│
├── uploads/
│
└── README.md
```

> 🔹 `public/` holds all UI files
> 🔹 `uploads/` stores house images
> 🔹 `MySQL.txt` contains database tables

---

## 🛠️ Installation Guide

### ✅ Prerequisites

Make sure these are installed first:

* Node.js
* MySQL
* npm package manager

---

### 📥 Step 1 — Install Dependencies

Inside the project folder:

```bash
npm install
```

---

### 🗄️ Step 2 — Database Setup

1️⃣ Open MySQL
2️⃣ Create database:

```sql
CREATE DATABASE house_management;
```

3️⃣ Run table queries from **MySQL.txt**
4️⃣ Update DB credentials inside `app.js`:

```js
database: 'house_management'
```

---

### ▶️ Step 3 — Run Server

```bash
node app.js
```

Visit:

👉 [http://localhost:3000](http://localhost:3000)

---

## 🚦 Application Flow

### 👤 User Login

* User signs up
* Logs in
* Redirects to tenant or owner dashboard depending on role

---

### 🏡 Owner Workflow

1. Add Owner Details
2. Add House Details
3. Upload image
4. Add rent/lease details
5. Edit or delete listings

---

### 👥 Tenant Workflow

1. Create tenant profile
2. Search houses
3. Select **rent or lease**
4. View property & owner details
5. Contact owner manually

---

## 🗂️ API Endpoints (Example)

| Method | Route                   | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/signup`               | User registration |
| POST   | `/login`                | Login validation  |
| POST   | `/ownerdet`             | Add owner         |
| POST   | `/house_details`        | Add house         |
| GET    | `/api/house-details`    | List houses       |
| PUT    | `/api/update-house/:id` | Update property   |
| DELETE | `/api/delete-house/:id` | Remove property   |

---

## 🗄️ Sample Database Tables

### users

| Column   | Type         |
| -------- | ------------ |
| user_id  | varchar      |
| password | varchar      |
| role     | owner/tenant |

### owners

owner_id, name, phone, user_id

### houses

house_id, owner_id, address, house_type, image

### rent / lease tables

rent_price, advance_amount, period etc.

---

## 🔐 Security Considerations

✔ Password hashing
✔ No plain-text storage
✔ Validation handled server-side
✔ Basic routing protection
✔ Avoids direct DB exposure

---

## 🛠️ Troubleshooting

**Port already in use**

```bash
killall node
```

**DB connection error**

✔ Check MySQL is running
✔ Verify credentials
✔ Ensure database exists

---

## 🚀 Future Enhancements

* Online inquiries
* Map-based house search
* Admin dashboard
* Cloud image storage
* JWT authentication

---

## 🤝 Contribution Guidelines

1. Fork project
2. Create feature branch
3. Commit & push
4. Create pull request

---

## 📜 License

This project is created for **academic / learning purposes**.
Use freely with credit.

---

## 🙌 Team

Developed by **Pavan & Team** 💙




