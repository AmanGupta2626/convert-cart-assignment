# 🛒 ConvertCart MERN Microservices App

This project is a **MERN stack** application using **microservice architecture** with two backend services:

- **Product Service** – Fetches and stores products from WooCommerce into MongoDB
- **Segment Service** – Evaluates product segments based on user-defined rules

Frontend is built with **React + Vite + Tailwind CSS**.

---

## 📂 Project Structure
```
ConvertCart/
├── client/ # React + Vite frontend
├── server/
│ ├── product-service/ # Product microservice
│ └── segment-service/ # Segment evaluation microservice
└── README.md
```
---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/convertcart.git
cd convertcart
```

## 🖥 Frontend Setup (React + Vite)

```bash
cd client
npm install
npm run dev
```

App will run on: http://localhost:5173

Make sure .env in client contains:

- **VITE_PRODUCT_SERVICE_URL** =http://localhost:4000
- **VITE_SEGMENT_SERVICE_URL** =http://localhost:5000

## ⚙ Backend Setup (Microservices)

**Common Prerequisites:**

- Node.js ≥ 18
- MongoDB Atlas connection string
- WooCommerce API Keys (for Product Service)

### 2️⃣ Product Service

This service fetches products from WooCommerce and stores them in MongoDB.

**Setup:**
```bash
cd server/product-service
npm install
```
## Create .env file:

- PORT=4000
- MONGO_URI=your_mongodb_uri
- WC_BASE_URL=https://wp-multisite.convertcart.com/wp-json/wc/v3
- WC_CONSUMER_KEY=your_wc_consumer_key
- WC_CONSUMER_SECRET=your_wc_consumer_secret

## Run:

npm start
Runs at: http://localhost:4000

### 3️⃣ Segment Service
**Setup:**
```bash
cd server/segment-service
npm install
```
## Create .env:

- PORT=5000
- MONGO_URI=your_mongodb_uri

## Run:

```bash
npm start
```
Runs at: http://localhost:5000

## 📡 API Endpoints
##  Product Service : Returns all products
``` 
    GET /api/products  
```

## Segment Service : Returns filtered products based on rules
```
   POST /api/segments/evaluate
```
- Example Request :
```
{
  "rules": "price > 1000\nstock_status = instock\non_sale = true"
}
```
### 📜 Description of Ingestion Logic
```
The Product Service ingestion process works as follows:

- On API call , it requests product data from the WooCommerce REST API using provided API keys.
- It maps WooCommerce fields (e.g., id, name, price, stock_status) to the MongoDB Product schema.
- Prices are converted from string to number and stock statuses are validated against the allowed enum values (instock, outofstock, onbackorder).
- Existing products in the database are cleared (optional) to ensure data freshness.
- The cleaned and transformed products are bulk inserted into MongoDB.
- These stored products are later queried by the Segment Service for rule-based filtering.

```
### 🐳 Running with Docker
You can containerize and run both backend microservices using Docker and Docker Compose.

## 1️⃣ Build the images
```bash
docker compose build
```
## This will build Docker images for:

- Product Service (Node.js + MongoDB connection + WooCommerce integration)
- Segment Service (Node.js + MongoDB connection)

## 2️⃣ Start the containers

**Run in attached mode (logs in terminal):**

```bash
docker compose up
```
**Or run in detached mode (background):**

```bash
docker compose up -d
```

### 🐳 Deployment Notes
Each microservice should be deployed separately (e.g., Render, Heroku, or Docker)
Update frontend .env with deployed backend URLs

### 🌐 Live Demo Links
- Frontend: https://convert-cart-assignment-beta.vercel.app/
- Product Service : https://product-service-9w3j.onrender.com
- Product Service Swagger API Docs: https://product-service-9w3j.onrender.com/api-docs/
- Segment Service : https://segment-service.onrender.com
- Segment Service Swagger API Docs: https://segment-service.onrender.com/api-docs/