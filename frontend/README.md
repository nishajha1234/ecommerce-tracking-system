# 🛒 E-commerce User Tracking System

A backend-focused project that simulates how modern e-commerce platforms track user behavior and generate analytics for better decision-making.

---

## 💡 Objective

* Understand user behavior and engagement
* Identify high-engagement pages and drop-off points
* Simulate real-world analytics systems used in e-commerce

---

## 🚀 Features

* Track pages visited and products viewed
* Measure time spent on each page
* Identify most engaged page
* Detect user drop-off point
* Store and view data in structured format

---

## ⚙️ How It Works

1. User performs actions (visit page, view product)
2. Each action is recorded as an event
3. Events are sent to backend and stored
4. Time spent is calculated when user exits a page
5. Backend processes data to generate insights
6. Results are exposed via analytics APIs (logs/summary)

---

## 🧠 System Design

* Event-based tracking system (each action = event)
* Raw event logs stored for flexibility
* Analytics computed dynamically
* Stateless API design with persistent data storage

---

## 🗂️ Data Model

Each user action is stored as a tracking event:

* **userId** – identifies the user
* **page** – page visited
* **productId** – optional (for product views)
* **action** – visit / view / click / exit
* **timeSpent** – time spent on page (seconds)
* **timestamp** – event time

---

## 🧩 Approach

* Used event-driven tracking for flexibility
* Stored raw logs instead of precomputed data
* Calculated analytics on demand
* Focused on backend-heavy implementation

---

## ⚠️ Assumptions

* Static user ID (no authentication system)
* Time tracked on page exit
* Single-user/session focus
* Small dataset (no pagination applied)

---

## 🛠️ Tech Stack

* Frontend: HTML, JavaScript
* Backend: Node.js, Express.js
* Database: MongoDB

---

## 🔗 API Flow

* Frontend sends user events to backend via REST APIs
* Backend stores events in database
* Analytics endpoint processes and returns insights

---

## 🌍 Real-World Relevance

This project mimics tracking systems used in platforms like Google Analytics and Mixpanel, where user events are collected and processed to improve user experience and business decisions.

---

## 🔮 Future Improvements

* Add authentication and session tracking
* Real-time analytics dashboard
* Data visualization (charts)
* Scalable architecture (Redis, queues)

---
